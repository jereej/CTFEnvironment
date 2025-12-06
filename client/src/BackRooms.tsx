import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const BackRooms: React.FC = () => {

    const [isPrompting, setPromptingValue] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sourceMail, setSource] = useState<boolean | null>(null);
    const [doorHovered, setDoorHovered] = useState(false);

    const navigate = useNavigate();

    const flipPromptingValue = (sourceMail: boolean | null) => {
        setError("");
        setUsername("");
        setPassword("");
        setPromptingValue(prev => !prev);
        setSource(sourceMail);
        
    }

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
        setError('Please enter both a username and password');
        return;
        }

        if (sourceMail === true){
            if (username == "dough" && password == "baguette"){
                navigate("/backrooms/mail");
            } else {
                setError("Incorrect credentials");
            }
        } else if (sourceMail === false) {
            if (username == "admin" && password == "admin"){
                navigate("/backrooms/shell");
            } else {
                setError("Incorrect credentials");
            }
        }

    }

return (
    <>
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0A0C0E]"/>
        {/* Content */}
        <div className="absolute min-h-screen w-full bg-[url('/backrooms.png')] bg-contain bg-center bg-no-repeat">

            {/* SVG overlay with door and UI elements */}
            <svg
                className="absolute inset-0 z-10 w-full h-full pointer-events-none"
                viewBox="0 0 1536 1024"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Door hitbox */}
                <path
                    d="M180 270 L340 270 L340 592 L180 592 Z"
                    fill="transparent"
                    strokeWidth="8"
                    className="cursor-pointer pointer-events-auto"
                    style={{
                        stroke: doorHovered ? "#f2d55c" : "transparent",
                        filter: doorHovered
                            ? "drop-shadow(0 0 10px #f2d55c) drop-shadow(0 0 20px #f2d55c)"
                            : "none",
                        transition: "stroke 0.3s ease, filter 0.3s ease",
                    }}
                    onClick={() => navigate("/shop")}
                    onMouseEnter={() => setDoorHovered(true)}
                    onMouseLeave={() => setDoorHovered(false)}
                />

                {/* Mail and Shell buttons / Login form */}
                <foreignObject x="430" y="285" width="650" height="400" className="pointer-events-auto">
                    <div className="w-full h-full flex items-center justify-center">
                        {!isPrompting ? (
                            <div className="flex flex-row gap-20">
                                <button
                                    onClick={() => flipPromptingValue(true)}
                                    className="px-8 py-5 bg-[#302D31FF] text-white rounded-2xl hover:bg-[#756C7AFF] transition"
                                >
                                    <img
                                        src="/mail_icon.svg"
                                        className="w-24 h-24 object-contain hover:scale-105 transition-transform mx-auto"
                                    />
                                    <span className="text-xl">Mail</span>
                                </button>

                                <button
                                    onClick={() => flipPromptingValue(false)}
                                    className="px-8 py-5 bg-[#302D31FF] text-white rounded-2xl hover:bg-[#756C7AFF] transition"
                                >
                                    <img
                                        src="/command-prompt-svgrepo-com.svg"
                                        className="w-24 h-24 object-contain hover:scale-105 transition-transform mx-auto"
                                    />
                                    <span className="text-xl">Shell</span>
                                </button>
                            </div>
                        ) : (
                            <div className="bg-[#7D7780FF] p-6 rounded-2xl shadow-md w-full max-w-xs">
                                <button
                                    onClick={() => flipPromptingValue(null)}
                                    className="text-white mb-2"
                                >
                                    &lt; Back
                                </button>
                                <h1 className="text-xl font-bold mb-4 text-center text-white">Sign in</h1>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                />
                                {error && <p className="text-[#9B3131FF] text-center mb-3 text-sm">{error}</p>}
                                <button
                                    onClick={handleLogin}
                                    className="w-full bg-[#b36be3] text-white py-2 rounded-lg hover:bg-[#794899] transition text-sm"
                                >
                                    Log In
                                </button>
                            </div>
                        )}
                    </div>
                </foreignObject>
            </svg>
        </div>
    </>
);
};

export default BackRooms;