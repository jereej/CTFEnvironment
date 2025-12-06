import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const BackRooms: React.FC = () => {

    const [isPrompting, setPromptingValue] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sourceMail, setSource] = useState<boolean | null>(null);

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
                navigate("/backrooms/oms");
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

            {/* Hover group */}
            <div className="relative w-full h-full group">

                {/* Hover zone */}
                <div
                    onClick={() => navigate("/shop")}
                    className="
                        absolute 
                        z-10
                        pointer-events-auto
                        opacity-0
                        group-hover:opacity-100
                        cursor-pointer
                    "
                    style={{
                        top: "280px",
                        left: "520px",
                        width: "300px",
                        height: "500px",
                    }}
                />

                {/* SVG overlay */}
                <svg
                    className="absolute inset-0 pointer-events-none z-30"
                    viewBox="0 0 1920 1080"
                >
                    <path
                        d="M450 265 L565 255 L565 560 L450 540 Z"
                        fill="none"
                        strokeWidth="8"
                        className="
                            transition-[stroke,filter] duration-300 
                            stroke-transparent
                            group-hover:stroke-[#f2d55c]
                            group-hover:drop-shadow-[0_0_10px_#f2d55c]
                            group-hover:drop-shadow-[0_0_20px_#f2d55c]
                        "
                    />
                </svg>

            </div>
            
            {/* Screen content */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-row gap-4">
                <div className="flex flex-row gap-4 space-x-52">
                    {!isPrompting?(
                        <>
                        <button 
                        onClick={() => flipPromptingValue(true)}
                        className="px-6 py-3 bg-[#302D31FF] text-white rounded-2xl hover:bg-[#756C7AFF] transition">
                        <img
                            src="/mail_icon.svg"
                            className="h-12 w-auto hover:scale-105 transition-transform"
                            style={{ width: '100px', height: '100px', objectFit: 'contain'}}
                        />
                        Mail
                        </button>
                        
                        <button
                        onClick={() => flipPromptingValue(false)}
                        className="px-6 py-3 bg-[#302D31FF] text-white rounded-2xl hover:bg-[#756C7AFF] transition">
                        <img
                            src="/oms_logo.png"
                            className="h-12 w-auto hover:scale-105 transition-transform"
                            style={{ width: '100px', height: '100px', objectFit: 'contain'}}
                        />
                        OMS
                        </button>
                        
                        </>
                    ):(<div className="relative z-10 bg-[#7D7780FF] p-8 rounded-2xl shadow-md w-full max-w-md">
                        <button 
                        onClick={() => flipPromptingValue(null)}
                        className="text-white">
                        <p>&lt; Back</p> 
                        </button>
                        <h1 className="text-2xl font-bold mb-6 text-center">
                        Sign in
                        </h1>          
                        <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {error && <p className="text-[#9B3131FF] text-center mb-4">{error}</p>}
                        <button
                            onClick={handleLogin}
                            className="w-full bg-[#b36be3] text-white py-2 rounded-lg hover:bg-[#794899] transition disabled:opacity-50"
                        >
                            Log In
                        </button>
                    </div>)
                    }
                </div>
            </div>
        </div>
    </>
);
};

export default BackRooms;