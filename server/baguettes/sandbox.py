"""
Sandbox Manager for CTF Shell Challenge

Manages Docker containers for isolated shell sessions.
Each user gets their own ephemeral container that is destroyed on disconnect.
"""

import docker
import logging
import threading
import time
from typing import Optional, Dict, Any
from django.conf import settings

logger = logging.getLogger(__name__)


class SandboxManager:
    """Manages sandbox containers for shell sessions."""

    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        """Singleton pattern to ensure one manager instance."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        self._initialized = True
        self._containers: Dict[str, Any] = {}
        self._container_lock = threading.Lock()

        try:
            # Try to connect to Docker
            self._client = docker.from_env()
            self._client.ping()
            logger.info("Successfully connected to Docker daemon")
        except docker.errors.DockerException as e:
            logger.warning(f"Docker not available: {e}. Using mock mode.")
            self._client = None

    @property
    def is_docker_available(self) -> bool:
        """Check if Docker is available."""
        return self._client is not None

    def create_container(self, session_id: str) -> Optional[str]:
        """
        Create a new sandbox container for a session.

        Args:
            session_id: Unique identifier for the session

        Returns:
            Container ID if successful, None otherwise
        """
        if not self.is_docker_available:
            logger.warning("Docker not available, cannot create container")
            return None

        with self._container_lock:
            # Check if container already exists for this session
            if session_id in self._containers:
                logger.info(f"Container already exists for session {session_id}")
                return self._containers[session_id]['id']

            try:
                image = getattr(settings, 'SANDBOX_IMAGE', 'lesbaguettes/sandbox:latest')
                memory = getattr(settings, 'SANDBOX_MEMORY', '64m')
                cpu = getattr(settings, 'SANDBOX_CPU', 0.5)

                container = self._client.containers.run(
                    image=image,
                    detach=True,
                    tty=True,
                    stdin_open=True,
                    network_mode='none',  # No network access
                    mem_limit=memory,
                    memswap_limit=memory,  # No swap
                    cpu_period=100000,
                    cpu_quota=int(100000 * cpu),
                    pids_limit=50,  # Prevent fork bombs
                    security_opt=['no-new-privileges'],
                    cap_drop=['ALL'],
                    labels={
                        'ctf.session': session_id,
                        'ctf.created': str(time.time()),
                    },
                    auto_remove=True,
                )

                self._containers[session_id] = {
                    'id': container.id,
                    'container': container,
                    'created': time.time(),
                    'last_activity': time.time(),
                }

                logger.info(f"Created container {container.id[:12]} for session {session_id}")
                return container.id

            except docker.errors.ImageNotFound:
                logger.error(f"Sandbox image not found: {image}")
                return None
            except docker.errors.APIError as e:
                logger.error(f"Failed to create container: {e}")
                return None

    def execute_command(self, session_id: str, command: str) -> Optional[str]:
        """
        Execute a command in the session's container.

        This is a simple execution method. For interactive sessions,
        use attach_stream instead.
        """
        if not self.is_docker_available:
            return None

        with self._container_lock:
            if session_id not in self._containers:
                return None

            container_info = self._containers[session_id]
            container_info['last_activity'] = time.time()

        try:
            container = container_info['container']
            result = container.exec_run(command, tty=True)
            return result.output.decode('utf-8', errors='replace')
        except Exception as e:
            logger.error(f"Failed to execute command: {e}")
            return None

    def get_exec_stream(self, session_id: str):
        """
        Get an interactive exec instance for the container.

        Returns an exec instance that can be used for bidirectional I/O.
        """
        if not self.is_docker_available:
            return None, None

        with self._container_lock:
            if session_id not in self._containers:
                return None, None

            container_info = self._containers[session_id]
            container_info['last_activity'] = time.time()

        try:
            container = container_info['container']

            # Create exec instance for interactive bash
            exec_id = self._client.api.exec_create(
                container.id,
                '/bin/bash -l',
                tty=True,
                stdin=True,
                stdout=True,
                stderr=True,
            )

            # Start exec and get socket
            socket = self._client.api.exec_start(
                exec_id['Id'],
                tty=True,
                socket=True,
                demux=False,
            )

            return exec_id['Id'], socket

        except Exception as e:
            logger.error(f"Failed to create exec stream: {e}")
            return None, None

    def resize_tty(self, session_id: str, exec_id: str, rows: int, cols: int):
        """Resize the TTY for an exec instance."""
        if not self.is_docker_available:
            return

        try:
            self._client.api.exec_resize(exec_id, height=rows, width=cols)
        except Exception as e:
            logger.error(f"Failed to resize TTY: {e}")

    def destroy_container(self, session_id: str):
        """
        Destroy the container for a session.

        Args:
            session_id: The session identifier
        """
        with self._container_lock:
            if session_id not in self._containers:
                return

            container_info = self._containers.pop(session_id)

        try:
            container = container_info['container']
            container.stop(timeout=2)
            logger.info(f"Destroyed container for session {session_id}")
        except Exception as e:
            # Container might already be stopped/removed
            logger.debug(f"Container cleanup: {e}")

    def update_activity(self, session_id: str):
        """Update the last activity timestamp for a session."""
        with self._container_lock:
            if session_id in self._containers:
                self._containers[session_id]['last_activity'] = time.time()

    def cleanup_stale_containers(self, timeout_seconds: int = None):
        """
        Remove containers that have been inactive for too long.

        Args:
            timeout_seconds: Inactivity timeout (default from settings)
        """
        if timeout_seconds is None:
            timeout_seconds = getattr(settings, 'SANDBOX_TIMEOUT', 900)

        current_time = time.time()
        stale_sessions = []

        with self._container_lock:
            for session_id, info in self._containers.items():
                if current_time - info['last_activity'] > timeout_seconds:
                    stale_sessions.append(session_id)

        for session_id in stale_sessions:
            logger.info(f"Cleaning up stale session: {session_id}")
            self.destroy_container(session_id)

    def get_active_sessions(self) -> int:
        """Return the number of active sessions."""
        with self._container_lock:
            return len(self._containers)


# Global singleton instance
sandbox_manager = SandboxManager()
