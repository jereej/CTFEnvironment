import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';

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

            {/* SVG overlay with clickable door and UI elements */}
            <svg
                className="absolute inset-0 z-10 w-full h-full pointer-events-none"
                viewBox="0 0 1536 1024"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Door hitbox */}
                <path
                    d="M699 57 L1065 57 L1065 600 L699 600 Z"
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
                    onClick={() => navigate("/backrooms")}
                    onMouseEnter={() => setDoorHovered(true)}
                    onMouseLeave={() => setDoorHovered(false)}
                />

                {/* Back arrow */}
                <a href="/" className="pointer-events-auto">
                    <image
                        href="/back_arrow.png"
                        x="30"
                        y="30"
                        width="80"
                        height="80"
                        className="cursor-pointer"
                    />
                </a>

                {/* Baguette logo with ellipse clip */}
                <defs>
                    <clipPath id="ellipseClip">
                        <ellipse cx="1280" cy="250" rx="140" ry="90" />
                    </clipPath>
                </defs>
                <image
                    href="/baguette_logo.png"
                    x="1140"
                    y="160"
                    width="280"
                    height="180"
                    clipPath="url(#ellipseClip)"
                />

                {/* Newspaper button */}
                <image
                    href="/newspaper.png"
                    x="1150"
                    y="380"
                    width="260"
                    height="200"
                    className="cursor-pointer pointer-events-auto"
                    onClick={() => setIsNewsPaperOpen(true)}
                />
            </svg>
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