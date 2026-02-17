"use client";

import { useState, useOptimistic, startTransition } from "react";
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
import { getEventColor, getEventLabel, EventType } from "@/lib/event-types"; // Ujisti se, že máš EventType exportovaný
import { deleteEvent, createEvent } from "@/app/actions/events";
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
    // Přepisujeme typy, aby odpovídaly Eventu, ale byly povinné tam, kde potřebujeme jistotu
    couple_id: string; // Tady chceme string (ne null)
    created_at: string;

    // Změna: Povolit null, stejně jako v Event
    description?: string | null;
    type?: string | null;

    isOptimistic?: boolean; // Tady to může zůstat boolean | undefined
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

    // --- 1. OPTIMISTIC UI LOGIKA ---

    // Definice reduceru pro useOptimistic
    // Akce může být buď přidání (ADD) nebo smazání (DELETE)
    type OptimisticAction =
        | { type: "ADD"; event: Event }
        | { type: "DELETE"; id: string };

    const [optimisticEvents, updateOptimisticEvents] = useOptimistic(
        events,
        (state, action: OptimisticAction) => {
            if (action.type === "ADD") {
                return [...state, { ...action.event, isOptimistic: true }];
            }
            if (action.type === "DELETE") {
                return state.filter((e) => e.id !== action.id);
            }
            return state;
        },
    );

    // Funkce pro přidání (předáme ji do Dialogu)
    const handleAddEvent = async (formData: FormData) => {
        // A. Přečteme data pro Optimistic Update
        const title = formData.get("title") as string;
        const dateFrom = formData.get("dateFrom") as string;
        const startTimeStr = formData.get("startTime") as string;
        const type = formData.get("type") as string;
        const location = formData.get("location") as string;
        const endTimeStr = formData.get("endTime") as string;
        const dateTo = formData.get("dateTo") as string;

        // Validace (stejná jako na serveru)
        if (!title || !dateFrom || !startTimeStr) return;

        // Výpočet časů (zjednodušená verze pro UI)
        const startIso = new Date(`${dateFrom}T${startTimeStr}`).toISOString();
        let endIso = null;
        if (endTimeStr) {
            const endDateBase = dateTo || dateFrom;
            endIso = new Date(`${endDateBase}T${endTimeStr}`).toISOString();
        } else if (dateTo && dateTo !== dateFrom) {
            endIso = new Date(`${dateTo}T00:00:00`).toISOString();
        }

        const newEvent: Event = {
            id: Math.random().toString(), // Dočasné ID
            title,
            start_time: startIso,
            end_time: endIso,
            location,
            couple_id: coupleId,
            created_at: new Date().toISOString(),
            type: type || "date",
            description: null,
            color: null,
            creator_id: "me",
        };

        // B. OKAMŽITĚ aktualizujeme UI
        startTransition(() => {
            updateOptimisticEvents({ type: "ADD", event: newEvent });
        });

        // C. Voláme Server Action na pozadí
        try {
            await createEvent(formData);
        } catch {
            toast.error("Nepodařilo se vytvořit událost.");
            // React automaticky revertne stav při revalidaci nebo chybě
        }
    };

    // Funkce pro smazání
    const handleDeleteEvent = async (eventId: string) => {
        // A. OKAMŽITĚ smažeme z UI
        startTransition(() => {
            updateOptimisticEvents({ type: "DELETE", id: eventId });
        });

        // B. Voláme Server Action
        try {
            await deleteEvent(eventId);
            toast.success("Smazáno.");
        } catch {
            toast.error("Nepodařilo se smazat událost.");
        }
    };

    // --- KONEC OPTIMISTIC LOGIKY ---

    // 2. Transformace dat (Eventy + Narozeniny)
    // Používáme optimisticEvents místo events!
    const items: CalendarItem[] = optimisticEvents.map((e) => ({
        ...e,
        couple_id: (e as unknown as CalendarItem).couple_id || coupleId,
        created_at:
            (e as unknown as CalendarItem).created_at ||
            new Date().toISOString(),
        color: e.color || "#E27D60",
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
        `${partnerProfile?.nickname || "Partner"} má narozeniny 🎉`,
    );

    // 3. Mapa událostí
    const eventsMap: Record<string, CalendarItem[]> = {};

    items.forEach((event) => {
        const startDate = new Date(event.start_time);
        const endDate = event.end_time
            ? new Date(event.end_time)
            : new Date(event.start_time);

        const current = new Date(startDate);
        current.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        while (current <= end) {
            const dateKey = format(current, "yyyy-MM-dd");
            if (!eventsMap[dateKey]) eventsMap[dateKey] = [];
            eventsMap[dateKey].push(event);
            current.setDate(current.getDate() + 1);
        }
    });

    // 4. Handlery
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
                                                        event.isOptimistic &&
                                                            "opacity-50",
                                                    )}
                                                    style={{
                                                        backgroundColor:
                                                            event.is_birthday
                                                                ? "#FFD700"
                                                                : getEventColor(
                                                                      event.type ??
                                                                          undefined,
                                                                  ),
                                                    }}
                                                    title={event.title}
                                                />
                                            ))}
                                        {dayEvents.length >
                                            (isCalendarLayout ? 8 : 4) && (
                                            <div
                                                className={cn(
                                                    "bg-muted-foreground/30",
                                                    "w-full h-1.5 rounded-sm",
                                                    "md:size-2 md:rounded-full md:w-2 md:h-2",
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
                                        className={cn(
                                            "group flex flex-col gap-1 hover:bg-muted/50 p-3 border rounded-lg transition-all",
                                            event.isOptimistic &&
                                                "opacity-60 grayscale-[0.5]",
                                        )}
                                        style={{
                                            // Oprava: event.type může být null, převedeme na undefined
                                            borderLeft: `4px solid ${event.is_birthday ? "#FFD700" : getEventColor(event.type ?? undefined)}`,
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold group-hover:text-primary text-sm transition-colors">
                                                {event.title}
                                            </h3>
                                            <span className="block mb-1 font-bold text-muted-foreground text-xs uppercase tracking-wider">
                                                {event.is_birthday
                                                    ? "Narozeniny"
                                                    : // Oprava: event.type může být null
                                                      getEventLabel(
                                                          event.type ??
                                                              undefined,
                                                      )}
                                            </span>

                                            {/* Smazání - voláme naši wrapper funkci */}
                                            <Trash2
                                                className={cn(
                                                    "size-4 hover:text-destructive transition-colors cursor-pointer",
                                                    event.isOptimistic &&
                                                        "invisible", // Nemazat, dokud se neuloží
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!event.is_birthday) {
                                                        handleDeleteEvent(
                                                            event.id,
                                                        );
                                                    }
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
                        {/* Předáváme onAddEvent */}
                        <AddEventDialog
                            coupleId={coupleId}
                            defaultDate={date}
                            onAddEvent={handleAddEvent}
                        >
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
