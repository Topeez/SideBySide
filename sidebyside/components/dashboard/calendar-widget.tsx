"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddEventDialog } from "./add-event-dialog";
import { Plus, MapPin, Gift } from "lucide-react";
import { Event } from "@/types/event";
import { getEventColor, getEventLabel } from "@/lib/event-types";

interface Profile {
    birth_date?: string | Date;
    nickname?: string;
}

interface CalendarWidgetProps {
    events: Event[];
    coupleId: string;
    userProfile?: Profile | null;
    partnerProfile?: Profile | null;
}

type CalendarItem = Event & {
    is_birthday?: boolean;
    couple_id: string;
    created_at: string;
    description?: string;
    type?: string;
};

export function CalendarWidget({
    events = [],
    coupleId,
    userProfile,
    partnerProfile,
}: CalendarWidgetProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // 1. Transformace dat (Eventy + Narozeniny)
    const allCalendarItems = useMemo(() => {
        // Převedeme DB eventy a zajistíme DEFAULT BARVU
        const items: CalendarItem[] = events.map((e) => ({
            ...e,
            couple_id: (e as unknown as CalendarItem).couple_id || coupleId,
            created_at:
                (e as unknown as CalendarItem).created_at ||
                new Date().toISOString(),
            color: e.color || "#E27D60", // Důležité: Fallback barva pro DB eventy
        }));

        const addBirthday = (
            profile: Profile | null | undefined,
            title: string,
        ) => {
            if (profile?.birth_date) {
                const bdayDate = new Date(profile.birth_date);
                const currentYear = new Date().getFullYear();
                const nextBday = new Date(
                    currentYear,
                    bdayDate.getMonth(),
                    bdayDate.getDate(),
                );
                items.push({
                    id: `bday-${title}-${currentYear}`,
                    title: title,
                    start_time: nextBday.toISOString(),
                    end_time: null,
                    location: "Oslava?",
                    is_birthday: true,
                    couple_id: coupleId,
                    created_at: new Date().toISOString(),
                });
            }
        };
        addBirthday(userProfile, "Moje narozeniny 🎂");
        addBirthday(partnerProfile, "Partnerovy narozeniny 🎉");
        return items;
    }, [events, userProfile, partnerProfile, coupleId]);

    // 2. Mapa událostí
    const eventsMap = useMemo(() => {
        const map: Record<string, CalendarItem[]> = {};
        allCalendarItems.forEach((event) => {
            const dateKey = format(new Date(event.start_time), "yyyy-MM-dd");
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(event);
        });
        return map;
    }, [allCalendarItems]);

    // 3. Handlery
    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setIsDialogOpen(true);
        }
    };

    const selectedDateKey = date ? format(date, "yyyy-MM-dd") : null;
    const selectedDateEvents = selectedDateKey
        ? eventsMap[selectedDateKey] || []
        : [];

    return (
        <div className="flex flex-col space-y-4 col-span-12 md:col-span-6 lg:col-span-4 bg-background shadow-sm p-4 border rounded-xl h-full">
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={cs}
                className="p-0 w-full"
                classNames={{
                    month: "w-full flex flex-col items-center space-y-4",
                    table: "w-full border-collapse", // Odstranil jsem text-xl, to dělá obří čísla
                    head_row: "flex w-full mb-2",
                    head_cell:
                        "text-muted-foreground rounded-md w-full font-normal text-sm", // Zmenšil jsem font hlavičky
                    row: "flex w-full mt-2",

                    // BUŇKA (KONTEJNER)
                    cell: cn(
                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50",
                        "h-16 w-full md:h-20",
                    ),

                    // TLAČÍTKO DNE (SAMOTNÝ ČTVEREČEK)
                    day: cn(
                        "flex flex-col justify-start items-center hover:bg-accent/50 aria-selected:opacity-100 m-2 p-0 rounded-md size-full font-normal transition-colors",
                    ),

                    // STAVY
                    day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md",
                    day_today:
                        "bg-secondary text-secondary-foreground font-bold", // Dnešek
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                    caption:
                        "flex justify-center pt-1 relative items-center mb-4",
                    caption_label: "text-lg font-bold capitalize",
                }}
                formatters={{
                    formatDay: (date) => {
                        const dateKey = format(date, "yyyy-MM-dd");
                        const dayEvents = eventsMap[dateKey] || [];
                        const hasEvents = dayEvents.length > 0;

                        return (
                            <div className="relative flex flex-col justify-start items-center p-2 size-full">
                                {/* Číslo dne - můžeš zvětšit text-lg */}
                                <span className="font-medium text-xl">
                                    {date.getDate()}
                                </span>

                                {hasEvents && (
                                    <div className="flex flex-col gap-1 mt-1 px-1 w-full">
                                        {dayEvents
                                            .slice(0, 3)
                                            .map((event, i) => (
                                                <div
                                                    key={i}
                                                    className="shadow-sm rounded-sm w-full h-1.5"
                                                    style={{
                                                        backgroundColor:
                                                            event.is_birthday
                                                                ? "#FFD70"
                                                                : getEventColor(
                                                                      event.type,
                                                                  ),
                                                    }}
                                                    title={event.title}
                                                />
                                            ))}
                                        {dayEvents.length > 3 && (
                                            <div className="flex justify-center gap-0.5 w-full h-1">
                                                <span className="bg-muted-foreground/40 rounded-full size-full" />
                                                <span className="bg-muted-foreground/40 rounded-full size-full" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) as never;
                    },
                }}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 capitalize">
                            {date
                                ? format(date, "EEEE, d. MMMM", { locale: cs })
                                : "Události"}
                            {selectedDateEvents.length > 0 && (
                                <span className="px-2 py-0.5 border rounded-full font-normal text-muted-foreground text-xs">
                                    {selectedDateEvents.length}
                                </span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Přehled plánů pro tento den
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 px-1 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {selectedDateEvents.length > 0 ? (
                            selectedDateEvents.map((event) => {
                                const start = new Date(
                                    event.start_time,
                                ).toLocaleTimeString("cs-CZ", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                                const end = event.end_time
                                    ? new Date(
                                          event.end_time,
                                      ).toLocaleTimeString("cs-CZ", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : null;

                                return (
                                    <div
                                        key={event.id}
                                        className="group flex flex-col gap-1 hover:bg-muted/50 p-3 border rounded-lg transition-all"
                                        style={{
                                            borderLeft: `4px solid ${
                                                event.is_birthday
                                                    ? "#FFD700"
                                                    : getEventColor(event.type)
                                            }`,
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold group-hover:text-primary text-sm transition-colors">
                                                {event.title}
                                            </h3>
                                            <span className="block mb-1 font-bold text-muted-foreground text-xs uppercase tracking-wider">
                                                {event.is_birthday
                                                    ? "Narozeniny"
                                                    : getEventLabel(event.type)}
                                            </span>
                                            <span className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] text-muted-foreground">
                                                {event.is_birthday
                                                    ? "CELÝ DEN"
                                                    : `${start}${end ? ` - ${end}` : ""}`}
                                            </span>
                                        </div>
                                        {event.description && (
                                            <p className="text-muted-foreground text-xs line-clamp-1">
                                                {event.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
                                            {event.location && (
                                                <>
                                                    <MapPin className="size-3" />{" "}
                                                    {event.location}
                                                </>
                                            )}
                                            {event.is_birthday && (
                                                <Gift className="size-3 text-yellow-600" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col justify-center items-center bg-muted/50 py-8 border-2 border-dashed rounded-lg text-muted-foreground text-center">
                                <p className="text-sm">Zatím nic.</p>
                                <p className="opacity-70 text-xs">
                                    Naplánuj rande nebo výlet!
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-2 pt-2 border-t">
                        <AddEventDialog coupleId={coupleId} defaultDate={date}>
                            <Button className="gap-2 bg-primary hover:bg-primary-foreground w-full sm:w-auto text-white">
                                <Plus className="size-4" />
                                Naplánovat akci
                            </Button>
                        </AddEventDialog>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
