import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";
import { ClosestEventProps } from "@/types/event";
import { AddEventDialog } from "./add-event-dialog";

export function ClosestEvent({
    nextEvent,
    hasCouple,
    coupleId,
}: ClosestEventProps) {
    return (
        <Card className="md:col-span-2 bg-primary/10 border-[#8FBC8F]/30 h-full">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle className="font-medium text-[#2F4F2F] text-lg">
                    Nejbližší plán
                </CardTitle>
                <CalendarDays className="w-5 h-5 text-[#8FBC8F]" />
            </CardHeader>
            <CardContent>
                {nextEvent ? (
                    <>
                        <div className="mb-2 font-bold text-stone-800 text-3xl">
                            {nextEvent.title}
                        </div>
                        <p className="mb-6 text-stone-600 capitalize">
                            {new Date(nextEvent.start_time).toLocaleDateString(
                                "cs-CZ",
                                {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    hour: "numeric",
                                    minute: "2-digit",
                                }
                            )}
                            {nextEvent.location
                                ? ` • ${nextEvent.location}`
                                : ""}
                        </p>
                    </>
                ) : (
                    <>
                        <div className="opacity-60 mb-2 font-bold text-stone-800 text-3xl">
                            {hasCouple
                                ? "Žádný plán v dohledu"
                                : "Zatím žádný plán"}
                        </div>
                        <p className="mb-6 text-stone-600">
                            {hasCouple
                                ? "Co takhle si něco naplánovat?"
                                : "Naplánuj si něco hezkého."}
                        </p>
                    </>
                )}

                {coupleId ? (
                    <AddEventDialog coupleId={coupleId}>
                        <Button className="bg-[#8FBC8F] hover:bg-[#7DA87D] text-white">
                            <Plus className="mr-2 w-4 h-4" /> Přidat
                        </Button>
                    </AddEventDialog>
                ) : (
                    <Button className="bg-primary hover:bg-[#7DA87D] text-white">
                        <Plus className="mr-2 size-4" /> Přidat
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
