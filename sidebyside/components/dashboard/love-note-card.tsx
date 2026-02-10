"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Pencil } from "lucide-react";
import { useState } from "react";
import { updateLoveNote } from "@/app/actions/update-note";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ActionButton from "../action-button";

interface LoveNoteCardProps {
    initialNote: string;
    coupleId: string;
    authorId: string;
    currentUserId: string;
}

export function LoveNoteCard({
    initialNote,
    coupleId,
    authorId,
    currentUserId,
}: LoveNoteCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const isMyNote = authorId === currentUserId;

    return (
        <Card className="group relative inset-shadow-secondary-foreground/75 inset-shadow-xs col-span-12 md:col-span-4 bg-secondary/15 shadow-md border-none h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center gap-2 font-medium text-secondary text-sm">
                    <div className="flex items-center gap-2">
                        <Heart className="fill-current w-4 h-4" />
                        {isMyNote ? "Tvůj vzkaz" : "Vzkaz pro tebe"}
                    </div>
                    <Button
                        variant={"ghost"}
                        onClick={() => setIsEditing(!isEditing)}
                        className="hover:bg-transparent opacity-0 group-hover:opacity-100 text-secondary transition-all duration-300"
                    >
                        <Pencil className="size-4" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <form
                        action={async (formData) => {
                            await updateLoveNote(formData);
                            setIsEditing(false);
                        }}
                        className="space-y-2"
                    >
                        <input type="hidden" name="coupleId" value={coupleId} />
                        <Textarea
                            name="note"
                            defaultValue={initialNote}
                            className="bg-white/50 border-[#E27D60]/20 focus-visible:border-secondary-foreground/50 focus:ring-secondary-foreground/50! min-h-20 font-sans! text-sm"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(false)}
                            >
                                Zrušit
                            </Button>
                            <ActionButton
                                type="submit"
                                size="sm"
                                className="bg-secondary hover:bg-secondary-foreground"
                            >
                                Uložit
                            </ActionButton>
                        </div>
                    </form>
                ) : (
                    <p className="min-h-10 font-sans text-muted-foreground whitespace-pre-wrap">
                        &quot;{initialNote}&quot;
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
