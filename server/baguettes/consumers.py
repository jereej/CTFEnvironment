"""
WebSocket Consumer for CTF Shell Challenge

Handles WebSocket connections and bridges them to sandbox containers.
"""

import json
import logging
import asyncio
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from .sandbox import sandbox_manager

logger = logging.getLogger(__name__)


class ShellConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for interactive shell sessions.

    Handles:
    - Connection lifecycle (connect, disconnect)
    - Bidirectional I/O between WebSocket and container
    - TTY resize events
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.session_id = None
        self.exec_id = None
        self.socket = None
        self.reader_task = None
        self.connected = False

    async def connect(self):
        """Handle WebSocket connection."""
        # Generate unique session ID
        self.session_id = str(uuid.uuid4())

        # Accept the WebSocket connection first
        await self.accept()

        # Check if Docker is available
        if not sandbox_manager.is_docker_available:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Shell service is not available. Docker is not configured.'
            }))
            await self.send(text_data=json.dumps({
                'type': 'fallback',
                'message': 'Entering simulated shell mode...'
            }))
            self.connected = True
            # Send welcome message for simulated mode
            await self.send_simulated_welcome()
            return

        # Create sandbox container
        container_id = await asyncio.to_thread(
            sandbox_manager.create_container,
            self.session_id
        )

        if not container_id:
            # Fall back to simulated mode if container creation fails
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Sandbox container not available. Using simulated mode.'
            }))
            await self.send(text_data=json.dumps({
                'type': 'fallback',
                'message': 'Entering simulated shell mode...'
            }))
            self.connected = True
            await self.send_simulated_welcome()
            return

        # Get interactive exec stream
        self.exec_id, self.socket = await asyncio.to_thread(
            sandbox_manager.get_exec_stream,
            self.session_id
        )

        if not self.exec_id or not self.socket:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Failed to start shell. Please try again.'
            }))
            await asyncio.to_thread(
                sandbox_manager.destroy_container,
                self.session_id
            )
            await self.close()
            return

        self.connected = True

        # Send connection success message
        await self.send(text_data=json.dumps({
            'type': 'status',
            'status': 'connected',
            'session_id': self.session_id
        }))

        # Start reading from container
        self.reader_task = asyncio.create_task(self.read_from_container())

        logger.info(f"Shell session started: {self.session_id}")

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        self.connected = False

        # Cancel reader task
        if self.reader_task:
            self.reader_task.cancel()
            try:
                await self.reader_task
            except asyncio.CancelledError:
                pass

        # Close socket
        if self.socket:
            try:
                self.socket.close()
            except Exception:
                pass

        # Destroy container
        if self.session_id:
            await asyncio.to_thread(
                sandbox_manager.destroy_container,
                self.session_id
            )
            logger.info(f"Shell session ended: {self.session_id}")

    async def receive(self, text_data=None, bytes_data=None):
        """Handle incoming WebSocket messages."""
        if text_data:
            try:
                data = json.loads(text_data)
                msg_type = data.get('type', 'input')

                if msg_type == 'input':
                    await self.handle_input(data.get('data', ''))
                elif msg_type == 'resize':
                    await self.handle_resize(
                        data.get('rows', 24),
                        data.get('cols', 80)
                    )
                elif msg_type == 'ping':
                    await self.send(text_data=json.dumps({'type': 'pong'}))

            except json.JSONDecodeError:
                # Treat as raw input
                await self.handle_input(text_data)

    async def handle_input(self, data: str):
        """Send input to the container."""
        if not self.connected:
            return

        # Update activity timestamp
        await asyncio.to_thread(
            sandbox_manager.update_activity,
            self.session_id
        )

        if not sandbox_manager.is_docker_available:
            # Simulated mode
            await self.handle_simulated_input(data)
            return

        if self.socket:
            try:
                # Get the underlying socket and write to it
                sock = self.socket._sock
                sock.sendall(data.encode('utf-8'))
            except Exception as e:
                logger.error(f"Failed to send to container: {e}")
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Connection to shell lost'
                }))

    async def handle_resize(self, rows: int, cols: int):
        """Handle terminal resize."""
        if not sandbox_manager.is_docker_available:
            return

        if self.exec_id:
            await asyncio.to_thread(
                sandbox_manager.resize_tty,
                self.session_id,
                self.exec_id,
                rows,
                cols
            )

    async def read_from_container(self):
        """Read output from container and send to WebSocket."""
        if not self.socket:
            return

        try:
            sock = self.socket._sock
            sock.setblocking(False)

            while self.connected:
                try:
                    # Try to read from socket
                    data = await asyncio.to_thread(self._read_socket, sock)
                    if data:
                        await self.send(text_data=json.dumps({
                            'type': 'output',
                            'data': data
                        }))
                    else:
                        # Small delay if no data
                        await asyncio.sleep(0.01)

                except BlockingIOError:
                    await asyncio.sleep(0.01)
                except Exception as e:
                    if self.connected:
                        logger.error(f"Error reading from container: {e}")
                    break

        except asyncio.CancelledError:
            pass

    def _read_socket(self, sock):
        """Read from socket (blocking call for thread)."""
        try:
            sock.setblocking(True)
            sock.settimeout(0.1)
            data = sock.recv(4096)
            return data.decode('utf-8', errors='replace') if data else None
        except TimeoutError:
            return None
        except Exception:
            return None

    # --- Simulated Shell Mode (when Docker is not available) ---

    async def send_simulated_welcome(self):
        """Send welcome message for simulated shell."""
        welcome = """
===========================================
   Les Baguettes Internal System v2.1
   (SIMULATED MODE - Docker not available)
===========================================

Welcome, baker! This is a simulated shell for testing.
Some features may be limited.

Type 'help' for available commands
Type 'challenges' to see your objectives

baker@lesbaguettes:~$ """
        await self.send(text_data=json.dumps({
            'type': 'output',
            'data': welcome
        }))

    async def handle_simulated_input(self, data: str):
        """Handle input in simulated mode."""
        # Simple command simulation for testing without Docker
        if not hasattr(self, '_sim_buffer'):
            self._sim_buffer = ''

        self._sim_buffer += data

        # Echo input
        await self.send(text_data=json.dumps({
            'type': 'output',
            'data': data
        }))

        # Check for newline (command entered)
        if '\r' in data or '\n' in data:
            command = self._sim_buffer.strip()
            self._sim_buffer = ''

            response = self.simulate_command(command)
            await self.send(text_data=json.dumps({
                'type': 'output',
                'data': response
            }))

    def simulate_command(self, command: str) -> str:
        """Simulate basic shell commands."""
        cmd = command.lower().strip()

        if not cmd:
            return '\nbaker@lesbaguettes:~$ '

        if cmd == 'help':
            return """
Les Baguettes Internal System - Available Commands
===================================================

Navigation:    cd, ls, pwd, tree
File viewing:  cat, less, head, tail
Searching:     grep, find
Utilities:     file, base64

Note: This is simulated mode. Start Docker for full functionality.

baker@lesbaguettes:~$ """

        if cmd == 'challenges':
            return """
============================================================
           LES BAGUETTES CTF CHALLENGES
============================================================

  Level 1: The Basics
  [ ] Find the secret recipe hidden in baker's home
  [ ] Read the encoded message from the supplier
  [ ] Count how many orders were placed

  Level 2: Investigation
  [ ] Find who accessed the system at 3:00 AM
  [ ] Identify the IP with the most failed logins

  Level 3: Advanced
  [ ] Find a way to read root's secret file

  Flags are in format: BAGUETTE{...}

============================================================

baker@lesbaguettes:~$ """

        if cmd == 'ls':
            return '\nnotes.txt  orders/  messages/\nbaker@lesbaguettes:~$ '

        if cmd == 'ls -la' or cmd == 'ls -al' or cmd == 'll':
            return """
total 24
drwxr-xr-x 4 baker baker 4096 Dec  2 10:00 .
drwxr-xr-x 3 root  root  4096 Dec  2 09:00 ..
-rw-r--r-- 1 baker baker 1024 Dec  2 09:00 .bashrc
-rw------- 1 baker baker  512 Dec  2 08:00 .secret_recipe
-rw-r--r-- 1 baker baker  256 Dec  2 09:30 notes.txt
drwxr-xr-x 2 baker baker 4096 Dec  2 09:00 orders
drwxr-xr-x 2 baker baker 4096 Dec  2 09:00 messages
baker@lesbaguettes:~$ """

        if cmd == 'pwd':
            return '\n/home/baker\nbaker@lesbaguettes:~$ '

        if cmd == 'cat .secret_recipe':
            return """
================================================
    GRANDMA'S SECRET BAGUETTE RECIPE
================================================

BAGUETTE{hidden_files_revealed}

================================================
baker@lesbaguettes:~$ """

        if cmd == 'whoami':
            return '\nbaker\nbaker@lesbaguettes:~$ '

        if cmd == 'id':
            return '\nuid=1000(baker) gid=1000(baker) groups=1000(baker)\nbaker@lesbaguettes:~$ '

        # Default response
        return f'\n{command}: command simulated (Docker required for full functionality)\nbaker@lesbaguettes:~$ '
