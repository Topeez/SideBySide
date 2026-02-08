"use client";

import { useDashboardLayout } from "@/components/layout-provider";
import { layoutConfig } from "@/config/dashboard-layouts";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardGridProps {
    eventSlot: ReactNode;
    noteSlot: ReactNode;
    todoSlot: ReactNode;
    calendarSlot: ReactNode;
    profileSlot: ReactNode;
}

export function DashboardGrid({
    eventSlot,
    noteSlot,
    todoSlot,
    calendarSlot,
    profileSlot,
}: DashboardGridProps) {
    const { layout } = useDashboardLayout();
    // Fallback na default, kdyby náhodou layout nebyl nastaven
    const config = layoutConfig[layout] || layoutConfig.default;

    return (
        <div className="gap-4 grid grid-cols-12 h-full">
            {/* auto-rows-fr pomůže, aby se widgety roztahovaly stejně */}

            <div
                className={cn(
                    "transition-all duration-300",
                    config.closestEvent,
                )}
            >
                <div className="size-full">{eventSlot}</div>
            </div>

            <div className={cn("transition-all duration-300", config.loveNote)}>
                <div className="size-full">{noteSlot}</div>
            </div>

            <div className={cn("transition-all duration-300", config.todo)}>
                <div className="size-full">{todoSlot}</div>
            </div>

            <div className={cn("transition-all duration-300", config.calendar)}>
                <div className="size-full">{calendarSlot}</div>
            </div>

            <div className={cn("transition-all duration-300", config.profile)}>
                <div className="size-full">{profileSlot}</div>
            </div>
        </div>
    );
}
