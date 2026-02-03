"use client";

import { useThemeColor, ThemeColor } from "@/components/theme-color-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { updateTheme } from "@/app/actions/profile";
import { toast } from "sonner";

const colors: { value: ThemeColor; label: string; colorClass: string }[] = [
    { value: "default", label: "Výchozí (Sage)", colorClass: "bg-[#8fbc8f]" },
    { value: "rose", label: "Růžová", colorClass: "bg-rose-600" },
    { value: "blue", label: "Modrá", colorClass: "bg-blue-600" },
    { value: "violet", label: "Fialová", colorClass: "bg-violet-600" },
    { value: "orange", label: "Oranžová", colorClass: "bg-orange-500" },
    { value: "green", label: "Zelená", colorClass: "bg-emerald-500" },
    { value: "yellow", label: "Žlutá", colorClass: "bg-amber-500" },
    { value: "slate", label: "Šedá", colorClass: "bg-slate-600" },
];

export function AppearanceForm() {
    const { themeColor, setThemeColor } = useThemeColor();

    const handleThemeChange = async (newTheme: ThemeColor) => {
        // 1. Optimistický update (okamžitá změna v UI)
        setThemeColor(newTheme);

        // 2. Uložení do DB
        try {
            await updateTheme(newTheme);
            toast.success("Vzhled byl aktualizován");
        } catch {
            toast.error("Nepodařilo se uložit vzhled");
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-medium text-lg">Barevné schéma</h3>
                <p className="text-muted-foreground text-sm">
                    Vyber si akcentovou barvu pro svůj dashboard.
                </p>
            </div>

            <div className="gap-4 grid grid-cols-2 md:grid-cols-4 pt-2">
                {colors.map((color) => (
                    <Button
                        key={color.value}
                        variant="outline"
                        className={cn(
                            "relative flex flex-col gap-3 hover:bg-accent/50 py-4 h-auto transition-all",
                            themeColor === color.value &&
                                "border-primary ring-1 ring-primary bg-accent/50",
                        )}
                        onClick={() => handleThemeChange(color.value)}
                    >
                        <div
                            className={cn(
                                "shadow-sm rounded-full size-8",
                                color.colorClass,
                            )}
                        />
                        <span className="font-medium">{color.label}</span>

                        {themeColor === color.value && (
                            <div className="top-2 right-2 absolute bg-background p-0.5 rounded-full text-primary">
                                <Check className="size-3" />
                            </div>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}
