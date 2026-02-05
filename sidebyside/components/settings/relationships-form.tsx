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
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ActionButton from "../action-button";

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
                        <PopoverTrigger asChild>
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
                        <PopoverContent
                            className="p-0 w-auto max-w-3/4"
                            align="start"
                        >
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
                <p className="text-muted-foreground text-xs">
                    Zobrazí se na vašem dashboardu jako počítadlo dní.
                </p>
            </div>
        </div>
    );
}
