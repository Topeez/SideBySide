"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useEffect, useCallback } from "react";

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme();

    const isDark = resolvedTheme === "dark";

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.shiftKey && e.key === "D") {
                setTheme(isDark ? "light" : "dark");
            }
        },
        [isDark, setTheme],
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div
            className={cn(
                "flex backdrop-blur-lg p-1.5 border border-muted rounded-full w-16 h-8 transition-all duration-300 cursor-pointer",
                className,
            )}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            role="button"
            aria-label="Toggle theme"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    setTheme(isDark ? "light" : "dark");
                }
            }}
        >
            <div className="flex justify-between items-center w-full">
                <div
                    className={cn(
                        "flex justify-center items-center rounded-full w-6 h-6 transition-transform duration-300",
                        isDark
                            ? "transform translate-x-0 bg-zinc-800"
                            : "transform translate-x-8 bg-gray-200",
                    )}
                >
                    {isDark ? (
                        <Moon
                            className="size-4 text-foregorund"
                            strokeWidth={1.5}
                        />
                    ) : (
                        <Sun
                            className="size-4 text-muted-foreground"
                            strokeWidth={1.5}
                        />
                    )}
                </div>
                <div
                    className={cn(
                        "flex justify-center items-center rounded-full w-6 h-6 transition-transform duration-300",
                        isDark ? "bg-transparent" : "transform -translate-x-8",
                    )}
                >
                    {isDark ? (
                        <Sun
                            className="w-4 h-4 text-foreground"
                            strokeWidth={1.5}
                        />
                    ) : (
                        <Moon
                            className="w-4 h-4 text-foreground"
                            strokeWidth={1.5}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
