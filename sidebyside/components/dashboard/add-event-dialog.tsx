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
import { Plus, Clock, MapPin, CalendarIcon } from "lucide-react";
import { createEvent } from "@/app/actions/events";
import { useState, useEffect } from "react";
import { EVENT_TYPES, EventType } from "@/lib/event-types";
import { cn } from "@/lib/utils";
import ActionButton from "../action-button";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export interface AddEventDialogProps {
    coupleId: string;
    defaultDate?: Date;
    children?: React.ReactNode;
    onAddEvent?: (formData: FormData) => Promise<void>;
}

export function AddEventDialog({
    coupleId,
    defaultDate,
    children,
    onAddEvent,
}: AddEventDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState("");

    const [date, setDate] = useState<DateRange | undefined>(() => ({
        from: defaultDate || new Date(),
        to: defaultDate || undefined,
    }));

    useEffect(() => {
        if (isOpen && defaultDate) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDate((prevDate) => {
                if (prevDate?.from?.getTime() === defaultDate.getTime()) {
                    return prevDate;
                }

                return {
                    from: defaultDate,
                    to: undefined,
                };
            });
        }
    }, [isOpen, defaultDate]);

    const [selectedType, setSelectedType] = useState<EventType>("date");
    const iconClasses =
        "top-2.5 left-2.5 absolute size-4 text-muted-foreground";

    const handleSubmit = async (formData: FormData) => {
        if (!date?.from) {
            toast.error("Vyberte prosím datum.");
            return;
        }

        setIsOpen(false);

        const promise = onAddEvent
            ? onAddEvent(formData)
            : createEvent(formData);

        toast.promise(promise, {
            loading: "Ukládám událost…",
            success: "Událost vytvořena.",
            error: "Nepodařilo se vytvořit událost.",
        });

        // Reset
        setLocation("");
        setSelectedType("date");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <ActionButton>
                        <Plus className="size-4" />
                    </ActionButton>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nová událost</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 pt-4">
                    <input type="hidden" name="coupleId" value={coupleId} />
                    <input type="hidden" name="type" value={selectedType} />
                    <input
                        type="hidden"
                        name="dateFrom"
                        value={
                            date?.from ? format(date.from, "yyyy-MM-dd") : ""
                        }
                    />
                    <input
                        type="hidden"
                        name="dateTo"
                        value={
                            date?.to
                                ? format(date.to, "yyyy-MM-dd")
                                : date?.from
                                  ? format(date.from, "yyyy-MM-dd")
                                  : ""
                        }
                    />

                    <div className="space-y-1">
                        <Label>Kdy?</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    className={cn(
                                        "justify-center w-full font-normal text-center",
                                        !date && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 size-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(
                                                    date.from,
                                                    "dd.MM.yyyy",
                                                    { locale: cs },
                                                )}{" "}
                                                -{" "}
                                                {format(date.to, "dd.MM.yyyy", {
                                                    locale: cs,
                                                })}
                                            </>
                                        ) : (
                                            format(date.from, "dd.MM.yyyy", {
                                                locale: cs,
                                            })
                                        )
                                    ) : (
                                        <span>Vyberte datum</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="p-0 w-auto"
                                align="center"
                            >
                                <Calendar
                                    autoFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                    locale={cs}
                                />
                            </PopoverContent>
                        </Popover>
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
                                <Clock className={iconClasses} />
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
                                <MapPin className={iconClasses} />
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="Místo..."
                                    className="pl-9"
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
                                    onClick={() =>
                                        window.open(
                                            `https://maps.google.com/?q=${location}`,
                                            "_blank",
                                        )
                                    }
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
                                        <ActionButton
                                            key={key}
                                            type="button"
                                            onClick={() =>
                                                setSelectedType(
                                                    key as EventType,
                                                )
                                            }
                                            className={cn(
                                                "inset-shadow-muted flex flex-col justify-center items-center gap-1 hover:bg-primary/10 shadow-lg p-8! rounded-lg transition-all",
                                                isSelected
                                                    ? "border-primary inset-shadow-primary/50! bg-primary/10 text-primary"
                                                    : "border-transparent  bg-muted hover:bg-muted/80 text-muted-foreground",
                                            )}
                                        >
                                            <Icon
                                                className="size-5"
                                                style={{
                                                    color: isSelected
                                                        ? "currentColor"
                                                        : config.color,
                                                }}
                                            />
                                            <span className="font-medium text-xs">
                                                {config.label}
                                            </span>
                                        </ActionButton>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    <ActionButton type="submit" className="w-full">
                        Uložit
                    </ActionButton>
                </form>
            </DialogContent>
        </Dialog>
    );
}
