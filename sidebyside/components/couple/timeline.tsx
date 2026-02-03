"use client";

import {
    Heart,
    Home,
    Plane,
    Circle,
    Baby,
    Car,
    Star,
    MapPin,
    LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

const ICON_MAP: Record<string, LucideIcon> = {
    heart: Heart,
    home: Home,
    plane: Plane,
    ring: Circle,
    baby: Baby,
    car: Car,
    star: Star,
    map: MapPin,
};

interface Milestone {
    id: string;
    title: string;
    description?: string;
    date: string;
    icon: string;
}

export function CoupleTimeline({ items }: { items: Milestone[] }) {
    if (items.length === 0) {
        return (
            <div className="py-10 border-2 border-dashed rounded-xl text-muted-foreground text-center">
                <p>Zatím žádné milníky.</p>
                <p className="text-sm">Přidejte první vzpomínku!</p>
            </div>
        );
    }

    return (
        <div className="relative space-y-8 ml-4 pb-4 border-muted border-l-2">
            {items.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || Star;

                return (
                    <div key={item.id} className="group relative pl-8">
                        {/* Kulička na čáře */}
                        <div className="top-1 -left-2.25 absolute bg-background p-1 border-2 border-primary rounded-full group-hover:scale-110 transition-transform">
                            {/* Renderujeme komponentu */}
                            <IconComponent className="size-3 text-primary" />
                        </div>

                        {/* Obsah */}
                        <div className="flex flex-col">
                            <span className="mb-0.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                {format(new Date(item.date), "d. MMMM yyyy", {
                                    locale: cs,
                                })}
                            </span>
                            <h3 className="font-semibold text-foreground text-lg leading-tight">
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
