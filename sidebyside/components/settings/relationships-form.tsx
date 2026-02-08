"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { CalendarIcon, HeartCrack, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ActionButton from "../action-button";
import { UnpairButton } from "./unpair-button";

export function RelationshipForm({
    coupleId,
    initialDate,
}: {
    coupleId: string;
    initialDate: string | null;
}) {
    const [date, setDate] = useState<Date | undefined>(
        initialDate ? new Date(initialDate) : undefined,
    );
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSave = async () => {
        if (!date) return;
        setLoading(true);

        const formattedDate = format(date, "yyyy-MM-dd");

        const { error } = await supabase
            .from("couples")
            .update({ relationship_start: formattedDate })
            .eq("id", coupleId);

        if (error) {
            toast.error("Chyba při ukládání výročí.");
            console.error(error);
        } else {
            toast.success("Výročí uloženo! ❤️");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-2">
                <label className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                    Datum začátku vztahu
                </label>
                <div className="flex justify-between items-center w-full">
                    <Popover>
                        <PopoverTrigger asChild className="max-w-3/4">
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "justify-start w-60 font-normal text-left",
                                    !date && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 size-4" />
                                {date ? (
                                    format(date, "PPP", { locale: cs })
                                ) : (
                                    <span>Vyberte datum</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                locale={cs}
                            />
                        </PopoverContent>
                    </Popover>

                    <ActionButton
                        onClick={handleSave}
                        disabled={loading || !date}
                    >
                        {loading && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Uložit
                    </ActionButton>
                </div>
                <p className="text-muted-foreground text-sm">
                    Zobrazí se na vašem dashboardu jako počítadlo dní.
                </p>

                <div className="pt-6 border-t">
                    <h4 className="flex items-center gap-2 mb-2 font-semibold text-destructive">
                        <HeartCrack className="size-4" /> Nebezpečná zóna
                    </h4>
                    <div className="bg-destructive/10 p-4 border border-destructive/20 rounded-lg">
                        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
                            <div className="text-sm">
                                <p className="font-medium text-destructive-foreground">
                                    Odpárovat partnera
                                </p>
                                <p className="mt-1 text-muted-foreground">
                                    Pokud se rozhodnete jít každý svou cestou,
                                    zde můžete ukončit sdílení dat.
                                </p>
                            </div>
                            <UnpairButton coupleId={coupleId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
