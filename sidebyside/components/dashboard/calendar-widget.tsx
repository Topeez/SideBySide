"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddEventDialog } from "./add-event-dialog";
import { Plus, MapPin, Gift, Trash2 } from "lucide-react";
import { Event } from "@/types/event";
import { getEventColor, getEventLabel } from "@/lib/event-types";
import { deleteEvent } from "@/app/actions/events";
import ActionButton from "../action-button";
import { useDashboardLayout } from "../layout-provider";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

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
    const { layout } = useDashboardLayout();

    const isCalendarLayout = layout === "calendar";

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
        addBirthday(
            partnerProfile,
            partnerProfile?.nickname + " má narozeniny 🎉",
        );
        return items;
    }, [events, userProfile, partnerProfile, coupleId]);

    // 2. Mapa událostí
    const eventsMap = useMemo(() => {
        const map: Record<string, CalendarItem[]> = {};

        allCalendarItems.forEach((event) => {
            const startDate = new Date(event.start_time);
            // Pokud end_time neexistuje, bereme to jako jednodenní akci (konec = začátek)
            const endDate = event.end_time
                ? new Date(event.end_time)
                : new Date(event.start_time);

            const current = new Date(startDate);
            current.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(0, 0, 0, 0);

            while (current <= end) {
                const dateKey = format(current, "yyyy-MM-dd");
                if (!map[dateKey]) map[dateKey] = [];

                map[dateKey].push(event);

                current.setDate(current.getDate() + 1);
            }
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
        <div
            suppressHydrationWarning
            className="inset-shadow-muted inset-shadow-xs flex flex-col space-y-4 col-span-12 md:col-span-6 lg:col-span-4 bg-card shadow-lg p-4 border border-none rounded-xl h-full"
        >
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={cs}
                className="bg-card p-0 size-full"
                classNames={{
                    month: cn(
                        "flex flex-col items-center space-y-4 w-full",
                        isCalendarLayout && "text-4xl",
                    ),
                    month_grid: "w-full border-collapse",
                    weekdays: cn("flex my-2 w-full"),
                    weekday: cn(
                        "rounded-xl w-full font-normal text-muted-foreground text-sm",
                        isCalendarLayout && "md:text-xl",
                    ),
                    week: "flex w-full mt-2",
                    day: cn(
                        "flex flex-col justify-start items-center hover:bg-transparent! m-1 sm:m-4 md:m-2 p-0 size-full font-normal text-foreground transition-colors",
                        isCalendarLayout && "md:m-4 md:p-2 lg:p-4",
                        "rounded-xl!",
                    ),
                    selected: "text-foreground",
                    today: "text-primary font-bold rounded-xl",
                    outside: "text-muted-foreground opacity-50",
                    disabled: "text-muted-foreground opacity-50",
                    hidden: "invisible",
                    month_caption:
                        "flex justify-center py-1 relative items-center mb-4",
                    caption_label: cn(
                        "font-bold text-lg capitalize",
                        isCalendarLayout && "md:text-2xl",
                    ),
                }}
                formatters={{
                    formatDay: (date) => {
                        const dateKey = format(date, "yyyy-MM-dd");
                        const dayEvents = eventsMap[dateKey] || [];
                        const hasEvents = dayEvents.length > 0;

                        return (
                            <div className="relative flex flex-col justify-start items-center p-2 rounded-md size-full">
                                <span
                                    className={cn(
                                        "font-medium text-xl",
                                        isCalendarLayout && "md:text-2xl ",
                                    )}
                                >
                                    {date.getDate()}
                                </span>

                                {hasEvents && (
                                    <div
                                        className={cn(
                                            "flex gap-1 mt-1 px-1 w-full",
                                            "flex-col",
                                            "md:flex-row md:flex-wrap md:justify-center md:content-start",
                                        )}
                                    >
                                        {dayEvents
                                            .slice(0, isCalendarLayout ? 8 : 4)
                                            .map((event, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "shadow-sm transition-all",
                                                        "w-full h-1.5 rounded-sm",
                                                        "md:size-2 md:rounded-full md:w-2 md:h-2",
                                                    )}
                                                    style={{
                                                        backgroundColor:
                                                            event.is_birthday
                                                                ? "#FFD700"
                                                                : getEventColor(
                                                                      event.type,
                                                                  ),
                                                    }}
                                                    title={event.title}
                                                />
                                            ))}

                                        {/* Indikátor, že je toho víc (jen jednoduchá tečka/čárka navíc šedivě) */}
                                        {dayEvents.length >
                                            (isCalendarLayout ? 8 : 4) && (
                                            <div
                                                className={cn(
                                                    "bg-muted-foreground/30",
                                                    "w-full h-1.5 rounded-sm", // Mobile
                                                    "md:size-2 md:rounded-full md:w-2 md:h-2", // Desktop
                                                )}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ) as never;
                    },
                }}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg">
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
                                            <Trash2
                                                className="size-4 hover:text-destructive transition-colors cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteEvent(event.id);
                                                    toast.success(
                                                        "Úspěšně smazáno.",
                                                    );
                                                }}
                                            />
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
                            <ActionButton>
                                <Plus className="size-4" />
                                Naplánovat akci
                            </ActionButton>
                        </AddEventDialog>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
