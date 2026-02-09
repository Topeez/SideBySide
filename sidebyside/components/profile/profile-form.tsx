"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/app/actions/profile";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Profile } from "@/types/profile";
import ActionButton from "../action-button";

export function ProfileForm({ profile }: { profile: Profile }) {
    const [isPending, startTransition] = useTransition();

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
            <div className="flex justify-center">
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
