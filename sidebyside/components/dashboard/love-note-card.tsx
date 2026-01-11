"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Pencil } from "lucide-react";
import { useState } from "react";
import { updateLoveNote } from "@/app/actions/update-note"; // Import akce
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

    // Kdo to napsal?
    const isMyNote = authorId === currentUserId;

    return (
        <Card className="group relative md:col-span-3 bg-[#FFF5F0] border-[#FFDCC7]">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center gap-2 font-medium text-secondary text-sm">
                    <div className="flex items-center gap-2">
                        <Heart className="fill-current w-4 h-4" />
                        {isMyNote ? "Tvůj vzkaz" : "Vzkaz pro tebe"}
                    </div>
                    {/* Tlačítko editace (zobrazí se po najetí myší) */}
                    <Button
                        variant={"ghost"}
                        onClick={() => setIsEditing(!isEditing)}
                        className="hover:bg-transparent opacity-0 group-hover:opacity-100 text-secondary transition-all duration-300"
                    >
                        <Pencil className="w-3 h-3" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <form
                        action={async (formData) => {
                            await updateLoveNote(formData);
                            setIsEditing(false); // Zavřít po uložení
                        }}
                        className="space-y-2"
                    >
                        <input type="hidden" name="coupleId" value={coupleId} />
                        <Textarea
                            name="note"
                            defaultValue={initialNote}
                            className="bg-white/50 border-[#E27D60]/20 min-h-20 text-sm"
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
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-[#E27D60] hover:bg-[#cf866c] text-white"
                            >
                                Uložit
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="min-h-10 text-stone-700 italic whitespace-pre-wrap">
                        &quot;{initialNote}&quot;
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
