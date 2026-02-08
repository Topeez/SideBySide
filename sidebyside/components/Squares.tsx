"use client";

import React, { useRef, useEffect } from "react";

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
    x: number;
    y: number;
}

interface SquaresProps {
    direction?: "diagonal" | "up" | "right" | "down" | "left";
    speed?: number;
    borderColor?: string;
    squareSize?: number;
    hoverFillColor?: string;
}

const Squares: React.FC<SquaresProps> = ({
    direction = "right",
    speed = 1,
    borderColor = "#999",
    squareSize = 40,
    hoverFillColor = "#222",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);
    const numSquaresX = useRef<number>(0);
    const numSquaresY = useRef<number>(0);
    const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
    const hoveredSquareRef = useRef<GridOffset | null>(null);

    // ZMĚNA: Místo useState použijeme useRef.
    // Tím obejdeme React render cyklus. Canvas si prostě přečte aktuální hodnotu.
    const borderColorRef = useRef<string>(borderColor);

    // 1. Aktualizace barvy (běží při změně props borderColor)
    useEffect(() => {
        // Pokud to není proměnná, uložíme rovnou a končíme
        if (!borderColor.startsWith("--")) {
            borderColorRef.current = borderColor;
            return;
        }

        // Pokud je to CSS proměnná, zjistíme její hodnotu
        const tempDiv = document.createElement("div");
        tempDiv.style.display = "none";
        tempDiv.style.color = `var(${borderColor})`;
        document.body.appendChild(tempDiv);

        const style = window.getComputedStyle(tempDiv);
        const color = style.color;

        document.body.removeChild(tempDiv);

        if (color) {
            borderColorRef.current = color;
        } else {
            borderColorRef.current = borderColor; // Fallback
        }
    }, [borderColor]);

    // 2. Hlavní smyčka
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const drawGrid = () => {
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const startX =
                Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY =
                Math.floor(gridOffset.current.y / squareSize) * squareSize;

            ctx.lineWidth = 0.5;

            for (
                let x = startX;
                x < canvas.width + squareSize;
                x += squareSize
            ) {
                for (
                    let y = startY;
                    y < canvas.height + squareSize;
                    y += squareSize
                ) {
                    const squareX = x - (gridOffset.current.x % squareSize);
                    const squareY = y - (gridOffset.current.y % squareSize);

                    if (
                        hoveredSquareRef.current &&
                        Math.floor((x - startX) / squareSize) ===
                            hoveredSquareRef.current.x &&
                        Math.floor((y - startY) / squareSize) ===
                            hoveredSquareRef.current.y
                    ) {
                        ctx.fillStyle = hoverFillColor;
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    // ZMĚNA: Čteme aktuální barvu z Refu
                    ctx.strokeStyle = borderColorRef.current;
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                }
            }
        };

        const updateAnimation = () => {
            // ... (logika pohybu zůstává stejná) ...
            const effectiveSpeed = Math.max(speed, 0.1);
            switch (direction) {
                case "right":
                    gridOffset.current.x =
                        (gridOffset.current.x - effectiveSpeed + squareSize) %
                        squareSize;
                    break;
                case "left":
                    gridOffset.current.x =
                        (gridOffset.current.x + effectiveSpeed + squareSize) %
                        squareSize;
                    break;
                case "up":
                    gridOffset.current.y =
                        (gridOffset.current.y + effectiveSpeed + squareSize) %
                        squareSize;
                    break;
                case "down":
                    gridOffset.current.y =
                        (gridOffset.current.y - effectiveSpeed + squareSize) %
                        squareSize;
                    break;
                case "diagonal":
                    gridOffset.current.x =
                        (gridOffset.current.x - effectiveSpeed + squareSize) %
                        squareSize;
                    gridOffset.current.y =
                        (gridOffset.current.y - effectiveSpeed + squareSize) %
                        squareSize;
                    break;
            }

            drawGrid();
            requestRef.current = requestAnimationFrame(updateAnimation);
        };

        // Eventy myši
        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const startX =
                Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY =
                Math.floor(gridOffset.current.y / squareSize) * squareSize;

            const hoveredSquareX = Math.floor(
                (mouseX + gridOffset.current.x - startX) / squareSize,
            );
            const hoveredSquareY = Math.floor(
                (mouseY + gridOffset.current.y - startY) / squareSize,
            );

            if (
                !hoveredSquareRef.current ||
                hoveredSquareRef.current.x !== hoveredSquareX ||
                hoveredSquareRef.current.y !== hoveredSquareY
            ) {
                hoveredSquareRef.current = {
                    x: hoveredSquareX,
                    y: hoveredSquareY,
                };
            }
        };

        const handleMouseLeave = () => {
            hoveredSquareRef.current = null;
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        requestRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [direction, speed, hoverFillColor, squareSize]);
    // Poznámka: borderColor jsme odebrali ze závislostí, protože ho čteme přes Ref uvnitř smyčky.
    // To je správně - nechceme restartovat celou animaci jen kvůli změně barvy.

    return (
        <canvas
            ref={canvasRef}
            className="block border-none w-full h-full"
            style={{
                transform: "translateZ(0)",
                willChange: "transform",
            }}
        ></canvas>
    );
};

export default Squares;
