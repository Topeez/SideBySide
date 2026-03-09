"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateNotificationPreferences } from "@/app/actions/profile";
import { toast } from "sonner";
import { Heart, Trophy, ListTodo, Smile, CalendarPlus } from "lucide-react";

const PREF_ITEMS = [
    { key: "love_note",   label: "Vzkazy od partnera/ky",     icon: Heart },
    { key: "milestone",   label: "Nový milník",               icon: Trophy },
    { key: "bucket_item", label: "Položka v Bucket Listu",    icon: CalendarPlus },
    { key: "event",       label: "Nová událost",              icon: CalendarPlus },
    { key: "todo",        label: "Nový úkol",                 icon: ListTodo },
    { key: "mood",        label: "Partner/ka sdílel náladu",     icon: Smile },
] as const;

type PrefKey = typeof PREF_ITEMS[number]["key"];

interface Props {
    initialPrefs: Record<PrefKey, boolean>;
}

export function NotificationPreferences({ initialPrefs }: Props) {
    const [prefs, setPrefs] = useState<Record<PrefKey, boolean>>({
        love_note:   initialPrefs?.love_note   ?? true,
        milestone:   initialPrefs?.milestone   ?? true,
        bucket_item: initialPrefs?.bucket_item ?? true,
        todo:        initialPrefs?.todo        ?? true,
        mood:        initialPrefs?.mood        ?? true,
        event:       initialPrefs?.event       ?? true,
    });

    const handleToggle = async (key: PrefKey, value: boolean) => {
        const updated = { ...prefs, [key]: value };
        setPrefs(updated); 

        const result = await updateNotificationPreferences(updated);
        if (!result?.success) {
            setPrefs(prefs);
            toast.error("Nepodařilo se uložit předvolby.");
        }
    };

    return (
        <div className="space-y-3">
            {PREF_ITEMS.map(({ key, label, icon: Icon }) => (
                <div
                    key={key}
                    className="flex justify-between items-center py-2 last:border-0 border-b"
                >
                    <div className="flex items-center gap-3">
                        <Icon className="size-4 text-muted-foreground" />
                        <Label htmlFor={key} className="font-normal cursor-pointer">
                            {label}
                        </Label>
                    </div>
                    <Switch
                        id={key}
                        checked={prefs[key]}
                        onCheckedChange={(v: boolean) => handleToggle(key, v)}
                    />
                </div>
            ))}
        </div>
    );
}
