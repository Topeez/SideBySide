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
        <Card className="col-span-12 md:col-span-8 bg-primary/15 border-primary h-full">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
                <CardTitle className="font-medium text-primary text-lg">
                    Nejbližší plán
                </CardTitle>
                <CalendarDays className="size-5 text-primary" />
            </CardHeader>
            <CardContent>
                {nextEvent ? (
                    <>
                        <div className="mb-2 font-bold text-foreground text-3xl">
                            {nextEvent.title}
                        </div>
                        <p className="mb-6 text-muted-foreground capitalize">
                            {new Date(nextEvent.start_time).toLocaleDateString(
                                "cs-CZ",
                                {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    hour: "numeric",
                                    minute: "2-digit",
                                },
                            )}
                            {nextEvent.location
                                ? ` • ${nextEvent.location}`
                                : ""}
                        </p>
                    </>
                ) : (
                    <>
                        <div className="opacity-60 mb-2 font-bold text-foreground text-3xl">
                            {hasCouple
                                ? "Žádný plán v dohledu"
                                : "Zatím žádný plán"}
                        </div>
                        <p className="mb-6 text-muted-foreground">
                            {hasCouple
                                ? "Co takhle si něco naplánovat?"
                                : "Naplánuj si něco hezkého."}
                        </p>
                    </>
                )}

                {coupleId ? (
                    <AddEventDialog coupleId={coupleId}>
                        <Button className="bg-primary hover:bg-primary-foreground text-white">
                            <Plus className="mr-2 size-4" /> Přidat
                        </Button>
                    </AddEventDialog>
                ) : (
                    <Button className="bg-primary hover:bg-primary-foreground text-white">
                        <Plus className="mr-2 size-4" /> Přidat
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
