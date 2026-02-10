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
import { Plus, Clock, MapPin, Loader2, CalendarIcon } from "lucide-react";
import { createEvent } from "@/app/actions/events";
import { useState } from "react";
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
    const [isSaving, setIsSaving] = useState(false);

    // Defaultní hodnota: pokud je defaultDate, nastavíme ho jako "from"
    const [date, setDate] = useState<DateRange | undefined>({
        from: defaultDate || new Date(),
        to: defaultDate || new Date(), // Ze začátku to = from (jednodenní)
    });

    const [selectedType, setSelectedType] = useState<EventType>("date");
    const iconClasses =
        "top-2.5 left-2.5 absolute size-4 text-muted-foreground";

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true);
        try {
            await createEvent(formData);
            setIsOpen(false);
            toast.success("Událost vytvořena.");
        } catch {
            toast.error("Nepodařilo se vytvořit událost.");
        } finally {
            setIsSaving(false);
        }
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
            <DialogContent className="sm:max-w-106.25">
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
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start w-full font-normal text-left",
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
                                align="start"
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
                            placeholder="Večeře, Kino, Víkend..."
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
                            <p className="text-[10px] text-muted-foreground">
                                Platí pro{" "}
                                {date?.from
                                    ? format(date.from, "d.M.")
                                    : "začátek"}
                            </p>
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="endTime">Konec</Label>
                            <Input id="endTime" name="endTime" type="time" />
                            <p className="text-[10px] text-muted-foreground">
                                Platí pro{" "}
                                {date?.to
                                    ? format(date.to, "d.M.")
                                    : date?.from
                                      ? format(date.from, "d.M.")
                                      : "konec"}
                            </p>
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

                    <ActionButton
                        type="submit"
                        disabled={isSaving}
                        className="w-full"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Ukládám...
                            </>
                        ) : (
                            <span>Uložit</span>
                        )}
                    </ActionButton>
                </form>
            </DialogContent>
        </Dialog>
    );
}
