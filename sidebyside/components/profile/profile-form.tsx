"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/app/actions/profile";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, CalendarIcon } from "lucide-react";
import { Profile } from "@/types/profile";
import ActionButton from "../action-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

export function ProfileForm({ profile }: { profile: Profile }) {
    const [isPending, startTransition] = useTransition();

    // Stav pro datum narození
    const [birthDate, setBirthDate] = useState<Date | undefined>(
        profile.birth_date ? new Date(profile.birth_date) : undefined,
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await updateProfile(null, formData);
            if (result?.success) {
                toast.success("Nastavení uloženo");
            } else {
                toast.error("Chyba: " + result?.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl">
            {/* Osobní údaje grid */}
            <div className="gap-4 grid md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Celé jméno</Label>
                    <Input
                        id="full_name"
                        name="full_name"
                        defaultValue={profile.full_name || ""}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nickname">Přezdívka</Label>
                    <Input
                        id="nickname"
                        name="nickname"
                        defaultValue={profile.nickname || ""}
                        placeholder="Jak ti má říkat?"
                    />
                </div>
            </div>

            {/* Datum narození s Popover Kalendářem */}
            <div className="flex flex-col space-y-2">
                <Label htmlFor="birth_date">Datum narození</Label>

                <input
                    type="hidden"
                    name="birth_date"
                    value={birthDate ? format(birthDate, "yyyy-MM-dd") : ""}
                />

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start w-full md:w-70 font-normal text-left",
                                !birthDate && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 size-4" />
                            {birthDate ? (
                                format(birthDate, "PPP", { locale: cs }) // "10. února 2026"
                            ) : (
                                <span>Vyberte datum</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                            mode="single"
                            selected={birthDate}
                            onSelect={setBirthDate}
                            locale={cs}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                            startMonth={new Date(1940, 0)}
                            endMonth={new Date()}
                        />
                    </PopoverContent>
                </Popover>
                <p className="text-muted-foreground text-xs">
                    Použije se pro zobrazení narozenin v kalendáři.
                </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <Label htmlFor="bio">Bio / O mně</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile.bio || ""}
                    className="h-32 resize-none"
                    placeholder="Napiš něco o sobě..."
                />
            </div>

            {/* Tlačítko */}
            <div className="flex justify-center pt-4">
                <ActionButton type="submit" disabled={isPending}>
                    {isPending && (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Uložit změny
                </ActionButton>
            </div>
        </form>
    );
}
