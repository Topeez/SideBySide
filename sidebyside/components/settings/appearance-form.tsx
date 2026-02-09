"use client";

import { useThemeColor, ThemeColor } from "@/components/theme-color-provider";
import { useDashboardLayout } from "@/components/layout-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Check, Eye, LucideIcon } from "lucide-react";
import {
    updateTheme,
    updateLayout,
    DashboardLayoutType,
} from "@/app/actions/profile";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

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

const layouts: {
    value: DashboardLayoutType;
    label: string;
    icon: LucideIcon;
}[] = [
    { value: "default", label: "Výchozí", icon: Check },
    { value: "focus", label: "Soustředění (větší todo-list)", icon: Eye },
    { value: "calendar", label: "Kalendář", icon: Calendar },
];

export function AppearanceForm() {
    const { themeColor, setThemeColor } = useThemeColor();
    const { layout, setLayout } = useDashboardLayout();

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

    const handleLayoutChange = async (newLayout: DashboardLayoutType) => {
        setLayout(newLayout);
        try {
            await updateLayout(newLayout);
            toast.success("Rozložení bylo aktualizováno");
        } catch {
            toast.error("Nepodařilo se uložit rozložení");
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

            <Separator />

            <div className="space-y-4">
                <div>
                    <h3 className="font-medium text-lg">
                        Rozložení dashboardu{" "}
                        <span className="text-muted-foreground text-sm">
                            (jen pro PC)
                        </span>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        Vyber si, jak chceš mít uspořádané widgety.
                    </p>
                </div>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                    {layouts.map((l) => (
                        <Button
                            key={l.value}
                            variant="outline"
                            className={cn(
                                "relative flex flex-col gap-4 hover:bg-accent/50 p-4 h-auto",
                                layout === l.value &&
                                    "border-primary ring-1 ring-primary bg-accent/50",
                            )}
                            onClick={() => handleLayoutChange(l.value)}
                        >
                            <div className="gap-1 grid grid-cols-12 bg-muted p-2 rounded-md w-full aspect-video pointer-events-none">
                                {l.value === "default" && (
                                    <>
                                        <div className="col-span-8 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                    </>
                                )}
                                {l.value === "focus" && (
                                    <>
                                        <div className="col-span-6 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-6 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-8 row-span-2 bg-primary/30 border-2 border-primary/40 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                    </>
                                )}
                                {l.value === "calendar" && (
                                    <>
                                        <div className="col-span-8 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                        <div className="col-span-8 row-span-2 bg-primary/30 border-2 border-primary/40 rounded-sm h-full" />
                                        <div className="col-span-4 bg-primary/30 rounded-sm h-full" />
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <l.icon className="size-4" />
                                <span className="font-medium">{l.label}</span>
                            </div>
                            {layout === l.value && (
                                <div className="top-2 right-2 absolute bg-background p-0.5 rounded-full text-primary">
                                    <Check className="size-3" />
                                </div>
                            )}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
