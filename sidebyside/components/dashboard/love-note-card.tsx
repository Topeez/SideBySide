"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { updateLoveNote } from "@/app/actions/update-note";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ActionButton from "../action-button";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    const [isPending, startTransition] = useTransition();

    const isMyNote = authorId === currentUserId;
    const isEmpty = !initialNote || initialNote.trim().length === 0;

    const handleDelete = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("coupleId", coupleId);
            formData.append("note", "");
            await updateLoveNote(formData);
        });
    };

    return (
        <Card className="group relative inset-shadow-secondary-foreground/75 inset-shadow-xs col-span-12 md:col-span-4 bg-secondary/15 shadow-md border-none h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center gap-2 font-medium text-secondary text-sm">
                    <div className="flex items-center gap-2">
                        <Heart className="fill-current w-4 h-4" />
                        {isMyNote ? "Tvůj vzkaz" : "Vzkaz pro tebe"}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {/* AlertDialog pro smazání */}
                        {!isEmpty && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        size="icon"
                                        disabled={isPending}
                                        className="hover:bg-transparent size-8 text-secondary hover:text-destructive cursor-pointer"
                                        title="Smazat vzkaz"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Opravdu smazat vzkaz?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tato akce je nevratná. Vzkaz bude
                                            trvale odstraněn.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Zrušit
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            Smazat
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        <Button
                            variant={"ghost"}
                            size="icon"
                            onClick={() => setIsEditing(!isEditing)}
                            className="hover:bg-transparent size-8 text-secondary hover:text-amber-400 cursor-pointer"
                            title="Upravit vzkaz"
                        >
                            <Pencil className="size-4" />
                        </Button>
                    </div>
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
                            placeholder="Napiš něco hezkého..."
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
                    <p
                        className={cn(
                            "flex items-center min-h-10 font-sans whitespace-pre-wrap",
                            isEmpty
                                ? "text-muted-foreground/60 italic text-sm"
                                : "text-muted-foreground",
                        )}
                    >
                        {isEmpty
                            ? isMyNote
                                ? "Zatím jsi nic nenapsal(a). Klikni na tužku a potěš svou polovičku!"
                                : "Zatím tu žádný vzkaz není."
                            : `"${initialNote}"`}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
