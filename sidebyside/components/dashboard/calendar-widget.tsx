"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { cs } from "date-fns/locale";
import { AddEventDialog } from "./add-event-dialog";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Clock, Gift } from "lucide-react";
import { Event } from "@/types/event";

// Definice typu pro profil (zjednodušená, uprav podle své DB)
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

// Rozšířený typ pro položku v kalendáři (může to být Event nebo Narozeniny)
type CalendarItem = Event & {
    is_birthday?: boolean;
    couple_id: string;
    created_at: string;
};

export function CalendarWidget({
    events = [],
    coupleId,
    userProfile,
    partnerProfile,
}: CalendarWidgetProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // 1. Sloučení Eventů z DB a Narozenin do jednoho pole
    const allCalendarItems = useMemo(() => {
        // Převedeme DB eventy na náš formát (pro jistotu kopie)
        const items: CalendarItem[] = events.map((e) => ({
            ...e,
            // zajistíme, že položky budou mít required pole CalendarItem
            couple_id: (e as unknown as CalendarItem).couple_id || coupleId,
            created_at:
                (e as unknown as CalendarItem).created_at ||
                new Date().toISOString(),
        }));

        // Pomocná funkce pro přidání narozenin
        const addBirthday = (
            profile: Profile | null | undefined,
            title: string
        ) => {
            if (profile?.birth_date) {
                const bdayDate = new Date(profile.birth_date);
                const currentYear = new Date().getFullYear();

                // Vytvoříme datum narozenin pro tento rok
                const nextBday = new Date(
                    currentYear,
                    bdayDate.getMonth(),
                    bdayDate.getDate()
                );

                items.push({
                    id: `bday-${title}-${currentYear}`, // Unikátní ID
                    title: title,
                    start_time: nextBday.toISOString(),
                    end_time: null, // Narozeniny nemají konec
                    color: "#FFD700", // Zlatá barva pro narozeniny
                    location: "Oslava?",
                    is_birthday: true,
                    couple_id: coupleId, // Přidáme couple_id
                    created_at: new Date().toISOString(), // Přidáme created_at
                });
            }
        };

        addBirthday(userProfile, "Moje narozeniny 🎂");
        addBirthday(partnerProfile, "Partnerovy narozeniny 🎉");

        return items;
    }, [events, userProfile, partnerProfile, coupleId]);

    // 2. Data pro tečky v kalendáři (bereme ze sjednoceného seznamu)
    const eventDays = allCalendarItems.map((e) => new Date(e.start_time));

    // 3. Filtrujeme události pro vybraný den (pro pravý panel)
    const selectedDateEvents = allCalendarItems.filter((item) => {
        if (!date) return false;
        const itemDate = new Date(item.start_time);
        return itemDate.toDateString() === date.toDateString();
    });

    return (
        <Card className="flex md:flex-row flex-col md:col-span-3 h-full">
            {/* Levá část: Kalendář */}
            <div className="flex flex-1 justify-center p-4 border-muted border-r">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={cs}
                    // Použijeme sjednocené dny, takže tečka bude i u narozenin
                    modifiers={{ hasEvent: eventDays }}
                    modifiersClassNames={{
                        hasEvent:
                            "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:bg-[#E27D60] after:rounded-full",
                    }}
                    className="bg-card shadow-sm border rounded-md"
                />
            </div>

            {/* Pravá část: Detail a Formulář */}
            <div className="flex flex-col flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground capitalize">
                        {date
                            ? date.toLocaleDateString("cs-CZ", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                              })
                            : "Vyber den"}
                    </h3>

                    {/* --- MODÁL PRO PŘIDÁNÍ --- */}
                    <AddEventDialog coupleId={coupleId} defaultDate={date}>
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-[#7DA87D]"
                            disabled={!date}
                        >
                            <Plus className="size-4" />
                        </Button>
                    </AddEventDialog>
                    {/* ------------------------- */}
                </div>

                {/* Seznam událostí */}
                <div className="flex-1 space-y-3 pr-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {selectedDateEvents.length > 0 ? (
                        selectedDateEvents.map((event) => {
                            // Formátování času
                            const start = new Date(
                                event.start_time
                            ).toLocaleTimeString("cs-CZ", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            const end = event.end_time
                                ? new Date(event.end_time).toLocaleTimeString(
                                      "cs-CZ",
                                      {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      }
                                  )
                                : null;

                            return (
                                <div
                                    key={event.id}
                                    className="flex flex-col gap-1 bg-stone-50 hover:bg-muted p-3 border border-muted rounded-lg transition-colors"
                                    // Tady aplikujeme barvu dynamicky na levý okraj
                                    style={{
                                        borderLeft: `4px solid ${
                                            event.color || "#E27D60"
                                        }`,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-foreground">
                                            {event.title}
                                        </span>
                                    </div>

                                    <div className="flex gap-3 ml-5 text-muted-foreground text-xs">
                                        {/* Pokud jsou to narozeniny, neukazujeme čas, ale ikonku */}
                                        {event.is_birthday ? (
                                            <span className="flex items-center gap-1 font-medium text-yellow-600">
                                                <Gift className="size-3" /> Celý
                                                den
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {start} {end ? `- ${end}` : ""}
                                            </span>
                                        )}

                                        {event.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="size-3" />{" "}
                                                {event.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col justify-center items-center opacity-60 h-full text-muted-foreground text-sm italic">
                            <p>Žádné plány na tento den.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
