import React, { useState, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Shop: React.FC = () => {
    const [isNewsPaperOpen, setIsNewsPaperOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [doorHovered, setDoorHovered] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const navigate = useNavigate();
    const MAX_PAGES = 2;

    const handleWheelZoom = (e: React.WheelEvent) => {
        e.preventDefault();

        setZoom((z) => {
            const next = Math.min(3, Math.max(1, z - e.deltaY * 0.001));
            if (next !== z) {
            setOffset({ x: 0, y: 0 });
            }
            return next;
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom <= 1) return;

        e.preventDefault(); // prevents image ghost-drag
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        setOffset({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

return (
  <div className="fixed inset-0 overflow-hidden bg-[#0A0C0E]">

    {/* Dark base */}
    <div className="absolute inset-0 bg-[#0A0C0E]" />

    {/* Shop background — NO min-h-screen */}
    <div className="absolute inset-0 w-full bg-[url('/shop_screen.png')] bg-contain bg-center bg-no-repeat">

            {/* Hover group */}
            <div className="relative w-full h-full group">

                {/* Hover zone */}
                <div
                    onMouseEnter={() => setDoorHovered(true)}
                    onMouseLeave={() => setDoorHovered(false)}
                    onClick={() => navigate("/backrooms")}
                    className="
                        absolute 
                        z-10
                        opacity-0
                        cursor-pointer
                    "
                    style={{
                        top: "20px",
                        left: "1100px",
                        width: "600px",
                        height: "800px",
                    }}
                />

                {/* SVG overlay */}
                <svg
                    className="absolute inset-0 pointer-events-none z-30"
                    viewBox="0 0 1920 1080"
                >
                    <path
                        d="M890 50 L1240 50 L1240 565 L890 565 Z"
                        fill="none"
                        strokeWidth="8"
                        style={{
                        stroke: doorHovered ? "#f2d55c" : "transparent",
                        filter: doorHovered
                            ? "drop-shadow(0 0 10px #f2d55c) drop-shadow(0 0 20px #f2d55c)"
                            : "none",
                        transition: "stroke 0.3s ease, filter 0.3s ease",
                        }}
                    />
                </svg>
            </div>
                <Link to="/">
                    <img
                        src="/back_arrow.png"
                        alt="Les Baguettes Logo"
                        className="
                            absolute 
                            left-[15%] 
                            top-[10%] h-20 
                            -translate-x-1/2 
                            -translate-y-1/2 
                            transition"
                    />
                </Link>
                <img
                    src="/baguette_logo.png"
                    alt="Les Baguettes Logo"
                    className="
                        absolute 
                        left-[74%] 
                        top-1/4 h-56 
                        -translate-x-1/2 
                        -translate-y-1/2 
                        transition
                        outline
                        outline-4
                        outline-[#757575]"
                    style={{ width: '300px', height: '200px', borderRadius: '42%' }}
                />
                <button
                    onClick={() => setIsNewsPaperOpen(true)}
                    className="
                        absolute
                        left-[74%]
                        top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        z-40
                        px-7
                        py-5
                        transition
                    "
                    >
                    <img
                        src="/newspaper.png"
                        alt="Newspaper icon"
                        className="h-56 w-auto rounded-md transition"
                    />
                </button>
        {isNewsPaperOpen && (
            <div
                className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                onClick={() => setIsNewsPaperOpen(false)}
            >
                <div
                    className="relative bg-neutral-900 rounded-xl shadow-2xl overflow-hidden p-6"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        width: "70vw",
                        height: "85vh"
                    }}
                    >
                    {/* Page Image */}
                    <div
                        className="w-full h-full flex items-center justify-center overflow-hidden"
                        onWheel={handleWheelZoom}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                            opacity: isFlipping ? 0.4 : 1,
                            transition: "opacity 0.3s ease"
                        }}
                    >
                        <img
                            src={`/baguette_news/page${currentPage}.png`}
                            alt={`Page ${currentPage}`}
                            className="rounded-lg shadow-lg bg-white select-none"
                            draggable={false}
                            onMouseDown={handleMouseDown}
                            style={{
                                transform: `
                                translate(${offset.x}px, ${offset.y}px) 
                                scale(${zoom}) 
                                rotateY(${isFlipping ? "-90deg" : "0deg"})
                                `,
                                transition: isDragging
                                ? "none"
                                : "transform 0.3s ease",
                                transformOrigin: "center center",
                                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "contain",
                                backfaceVisibility: "hidden",
                                perspective: "1000px"
                            }}
                        />
                    </div>

                    {/* Left Arrow */}
                    <button
                        onClick={() => {
                            if (currentPage === 1) return;

                            setIsFlipping(true);

                            setTimeout(() => {
                                setCurrentPage((p) => Math.max(1, p - 1));
                                setZoom(1);
                                setOffset({ x: 0, y: 0 });
                                setIsFlipping(false);
                            }, 300);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:scale-110 transition"
                    >
                        ◀
                    </button>

                    {/* Right Arrow */}
                    <button
                        disabled={currentPage >= MAX_PAGES}
                        onClick={() => {
                            if (currentPage >= MAX_PAGES) return;

                            setIsFlipping(true);

                            setTimeout(() => {
                                setCurrentPage((p) => Math.min(MAX_PAGES, p + 1));
                                setZoom(1);
                                setOffset({ x: 0, y: 0 });
                                setIsFlipping(false);
                            }, 300);
                        }}
                        className={`
                            absolute right-4 top-1/2 -translate-y-1/2
                            text-white text-4xl transition
                            ${currentPage >= MAX_PAGES ? "opacity-30 cursor-not-allowed" : "hover:scale-110"}
                        `}
                    >
                        ▶
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsNewsPaperOpen(false)}
                        className="absolute top-3 right-4 text-white text-xl hover:text-gray-300 transition"
                    >
                        ✕
                    </button>

                    {/* Page Indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm opacity-80">
                        Page {currentPage}
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-3 bg-black/50 p-2 rounded-lg">
                        <button
                            onClick={() => setZoom((z) => {
                                const next = Math.max(1, z - 0.2);
                                if (next <= 1) setOffset({ x: 0, y: 0 });
                                return next;
                            })}
                            className="px-3 py-1 text-white text-lg hover:bg-white/20 rounded"
                        >
                            −
                        </button>

                        <span className="text-white text-sm flex items-center">
                            {Math.round(zoom * 100)}%
                        </span>

                        <button
                            onClick={() => setZoom((z) => {
                                const next = Math.min(3, z + 0.2);
                                setOffset({ x: 0, y: 0 }); // center zoom
                                return next;
                            })}
                            className="px-3 py-1 text-white text-lg hover:bg-white/20 rounded"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    </div>
);
};

export default Shop;