import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TerminalMessage {
    type: 'output' | 'error' | 'status' | 'fallback' | 'pong';
    data?: string;
    message?: string;
    status?: string;
    session_id?: string;
}

const Shell: React.FC = () => {
    const navigate = useNavigate();
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(true);
    const [output, setOutput] = useState<string>("");
    const [currentInput, setCurrentInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [sessionTime, setSessionTime] = useState(0);

    // WebSocket connection
    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/shell/`;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setConnecting(false);
            setConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const msg: TerminalMessage = JSON.parse(event.data);

                switch (msg.type) {
                    case 'output':
                        if (msg.data) {
                            setOutput(prev => prev + msg.data);
                        }
                        break;
                    case 'error':
                        setOutput(prev => prev + `\n\x1b[31mError: ${msg.message}\x1b[0m\n`);
                        break;
                    case 'status':
                        if (msg.status === 'connected') {
                            setConnected(true);
                        }
                        break;
                    case 'fallback':
                        // Simulated mode message
                        setOutput(prev => prev + `\n\x1b[33m${msg.message}\x1b[0m\n`);
                        break;
                }
            } catch {
                // Raw text output
                setOutput(prev => prev + event.data);
            }
        };

        ws.onclose = () => {
            setConnected(false);
            setConnecting(false);
            setOutput(prev => prev + "\n\x1b[31mConnection closed.\x1b[0m\n");
        };

        ws.onerror = () => {
            setConnected(false);
            setConnecting(false);
            setOutput(prev => prev + "\n\x1b[31mConnection error.\x1b[0m\n");
        };

        return () => {
            ws.close();
        };
    }, []);

    // Session timer
    useEffect(() => {
        if (!connected) return;

        const timer = setInterval(() => {
            setSessionTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [connected]);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    // Focus input on click
    const focusInput = () => {
        inputRef.current?.focus();
    };

    // Send input to backend
    const sendInput = (data: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'input',
                data: data
            }));
        }
    };

    // Handle key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = currentInput;

            // Add to history
            if (command.trim()) {
                setCommandHistory(prev => [...prev, command]);
            }
            setHistoryIndex(-1);

            // Send command with newline
            sendInput(command + '\r');
            setCurrentInput("");
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex < commandHistory.length - 1
                    ? historyIndex + 1
                    : historyIndex;
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
            } else {
                setHistoryIndex(-1);
                setCurrentInput("");
            }
        } else if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            sendInput('\x03'); // Send Ctrl+C
            setOutput(prev => prev + '^C\n');
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            setOutput("");
        }
    };

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs.toString().padStart(2, '0')}s`;
    };

    // Render ANSI codes (simplified)
    const renderOutput = (text: string) => {
        // Remove ANSI escape codes for clean rendering
        return text
            .replace(/\x1b\[[\d;]*m/g, '')           // Remove color codes
            .replace(/\x1b\[\d*[ABCDK]/g, '')        // Remove cursor codes
            .replace(/\x1b\[\?[\d;]*[hl]/g, '')      // Remove mode switches like [?2004h (bracketed paste)
            .replace(/\x1b\[\d*[JKG]/g, '')          // Remove erase/cursor position codes
            .replace(/\x1b\][\d;]*[^\x07]*\x07/g, '') // Remove OSC sequences
            .replace(/\r/g, '');                      // Remove carriage returns
    };

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-gray-800">
                <button
                    onClick={() => navigate("/backrooms")}
                    className="text-gray-400 hover:text-white transition"
                >
                    &larr; Back
                </button>
                <h1 className="text-green-400 font-mono text-lg">
                    Les Baguettes Terminal
                </h1>
                <button
                    onClick={() => {
                        setOutput("");
                        setCommandHistory([]);
                    }}
                    className="text-gray-400 hover:text-white transition text-sm"
                >
                    Clear
                </button>
            </div>

            {/* Terminal */}
            <div
                ref={terminalRef}
                onClick={focusInput}
                className="flex-1 w-full overflow-y-auto overflow-x-hidden p-4 font-mono text-sm text-green-400 bg-[#0a0a0a] cursor-text whitespace-pre-wrap break-words"
            >
                {connecting && (
                    <div className="text-yellow-400">
                        Connecting to shell...
                    </div>
                )}
                {renderOutput(output)}
                {connected && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent outline-none text-green-400 font-mono text-sm caret-green-400"
                        style={{ width: `${Math.max(1, currentInput.length + 1)}ch` }}
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                    />
                )}
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-t border-gray-800 text-sm">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-400">
                        {connecting ? 'Connecting...' : connected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
                <div className="text-gray-400">
                    Session: {formatTime(sessionTime)}
                </div>
            </div>

            {/* Help overlay hint */}
            {connected && output.length < 100 && (
                <div className="absolute bottom-16 right-4 text-gray-500 text-xs">
                    Type 'help' or 'challenges' to get started
                </div>
            )}
        </div>
    );
};

export default Shell;
