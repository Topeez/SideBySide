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

    // Pokud není datum, dáme dnešek
    const dateToUse = defaultDate || new Date();

    // Formát pro input type="date" (YYYY-MM-DD)
    const dateString = `${dateToUse.getFullYear()}-${String(
        dateToUse.getMonth() + 1
    ).padStart(2, "0")}-${String(dateToUse.getDate()).padStart(2, "0")}`;

    const EVENT_COLORS = [
        { value: "#d16135", label: "Oranžová" }, // Default
        { value: "#264653", label: "Tmavě modrá" },
        { value: "#2A9D8F", label: "Tyrkysová" },
        { value: "#E9C46A", label: "Žlutá" },
        { value: "#F4A261", label: "Světle oranžová" },
        { value: "#E76F51", label: "Červená" },
        { value: "#A68A64", label: "Hnědá" }, // Neutrální
    ];

    // State pro barvu, defaultně první
    const [color, setColor] = useState(EVENT_COLORS[0].value);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button size="sm" className="bg-primary hover:bg-[#7DA87D]">
                        <Plus className="w-4 h-4" />
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
                    {/* Skrytý input pro odeslání vybrané barvy */}
                    <input type="hidden" name="color" value={color} />

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
                                <Clock className="top-2.5 left-2.5 absolute w-4 h-4 text-stone-400" />
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
                        <div className="relative">
                            <MapPin className="top-2.5 left-2.5 absolute w-4 h-4 text-stone-400" />
                            <Input
                                id="location"
                                name="location"
                                placeholder="Místo..."
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Sekce pro výběr barvy - opraveno */}
                    <div className="space-y-2">
                        <Label>Barva štítku</Label>
                        <div className="flex flex-wrap gap-2">
                            {EVENT_COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button" // Důležité, aby to neodeslalo formulář
                                    onClick={() => setColor(c.value)}
                                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                                        color === c.value
                                            ? "border-black scale-110"
                                            : "border-transparent hover:scale-105"
                                    }`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="bg-[#8FBC8F] hover:bg-[#7DA87D] w-full"
                    >
                        Uložit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
