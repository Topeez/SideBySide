"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Clock, MapPin } from "lucide-react";
import { createEvent } from "@/app/actions/events";
import { useState } from "react";
import { EVENT_TYPES, EventType } from "@/lib/event-types";
import { cn } from "@/lib/utils";

interface AddEventDialogProps {
    coupleId: string;
    defaultDate?: Date;
    children?: React.ReactNode;
}

export function AddEventDialog({
    coupleId,
    defaultDate,
    children,
}: AddEventDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState("");

    // Pokud není datum, dáme dnešek
    const dateToUse = defaultDate || new Date();

    // Formát pro input type="date" (YYYY-MM-DD)
    const dateString = `${dateToUse.getFullYear()}-${String(
        dateToUse.getMonth() + 1,
    ).padStart(2, "0")}-${String(dateToUse.getDate()).padStart(2, "0")}`;

    const [selectedType, setSelectedType] = useState<EventType>("date");

    const iconClasses =
        "top-2.5 left-2.5 absolute size-4 text-muted-foreground";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        size="sm"
                        className="bg-primary hover:bg-primary-foreground"
                    >
                        <Plus className="size-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Nová událost</DialogTitle>
                </DialogHeader>

                <form
                    action={async (formData) => {
                        await createEvent(formData);
                        setIsOpen(false);
                    }}
                    className="space-y-4 pt-4"
                >
                    <input type="hidden" name="coupleId" value={coupleId} />
                    <input type="hidden" name="type" value={selectedType} />

                    <div className="space-y-1">
                        <Label htmlFor="dateBase">Kdy?</Label>
                        <Input
                            type="date"
                            name="dateBase"
                            id="dateBase"
                            defaultValue={dateString}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="title">Co podniknete?</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Večeře, Kino..."
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="startTime">Začátek</Label>
                            <div className="relative">
                                <Clock className={`${iconClasses}`} />
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    className="pl-9"
                                    defaultValue="18:00"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="endTime">Konec</Label>
                            <Input id="endTime" name="endTime" type="time" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="location">Kde?</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className={`${iconClasses}`} />
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="Místo..."
                                    className="pl-9"
                                    // Uložíme si hodnotu do state, abychom ji mohli použít v tlačítku
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    value={location}
                                />
                            </div>
                            {location && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    title="Otevřít v mapách"
                                    onClick={() => {
                                        // Univerzální link, který na mobilu otevře nativní mapy
                                        // a na desktopu Google Maps
                                        window.open(
                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
                                            "_blank",
                                        );
                                    }}
                                >
                                    <MapPin className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Typ akce</Label>
                        <div className="gap-2 grid grid-cols-3">
                            {Object.entries(EVENT_TYPES).map(
                                ([key, config]) => {
                                    const isSelected = selectedType === key;
                                    const Icon = config.icon;

                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() =>
                                                setSelectedType(
                                                    key as EventType,
                                                )
                                            }
                                            className={cn(
                                                "flex flex-col justify-center items-center gap-1 p-2 border-2 rounded-lg transition-all",
                                                isSelected
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-transparent bg-muted hover:bg-muted/80 text-muted-foreground",
                                            )}
                                        >
                                            <Icon
                                                className="w-5 h-5"
                                                style={{
                                                    color: isSelected
                                                        ? "currentColor"
                                                        : config.color,
                                                }}
                                            />
                                            <span className="font-medium text-xs">
                                                {config.label}
                                            </span>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="bg-primary hover:bg-primary-foreground w-full text-background"
                    >
                        Uložit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
