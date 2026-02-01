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
        } catch (error) {
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
                                "shadow-sm rounded-full w-8 h-8",
                                color.colorClass,
                            )}
                        />
                        <span className="font-medium">{color.label}</span>

                        {themeColor === color.value && (
                            <div className="top-2 right-2 absolute bg-background p-0.5 rounded-full text-primary">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}
