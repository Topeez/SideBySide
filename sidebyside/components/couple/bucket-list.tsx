"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleDashed, Hourglass, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { deleteBucketItem, toggleBucketItemStatus } from "@/app/actions/couple";
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

interface BucketItem {
    id: string;
    title: string;
    status: "planned" | "in_progress" | "completed";
    image_url?: string;
    target_date?: string;
}

export function BucketList({ items }: { items: BucketItem[] }) {
    const handleDelete = async (id: string) => {
        try {
            await deleteBucketItem(id);
            toast.success("Sen byl odstraněn ze seznamu.");
        } catch (error) {
            console.error(error);
            toast.error("Nepodařilo se smazat položku.");
        }
    };

    if (items.length === 0) {
        return (
            <Card className="inset-shadow-muted inset-shadow-xs shadow-lg py-16 rounded-xl text-center">
                <p className="text-muted-foreground">
                    Váš seznam snů je prázdný.
                </p>
            </Card>
        );
    }

    return (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            {items.map((item) => (
                <Card
                    key={item.id}
                    className="group relative inset-shadow-xs iinset-shadow-muted shadow-lg pt-0 border-none overflow-hidden transition-all duration-300"
                >
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="top-2 right-2 z-20 absolute opacity-0 group-hover:opacity-100 shadow-sm w-8 h-8 transition-all"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Opravdu smazat tento sen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tato akce je nevratná. Položka{" "}
                                    <strong>&quot;{item.title}&quot;</strong>{" "}
                                    bude trvale odstraněna z vašeho seznamu.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Zrušit</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                >
                                    Smazat
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div className="relative bg-muted h-40">
                        {item.image_url ? (
                            <Image
                                src={item.image_url}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex justify-center items-center bg-linear-to-br from-indigo-500/10 to-purple-500/10 w-full h-full text-muted-foreground/20">
                                <span className="opacity-20 font-black text-4xl">
                                    ?
                                </span>
                            </div>
                        )}

                        {/* Status Badge */}
                        <div
                            className="top-2 left-2 z-10 absolute hover:scale-105 transition-transform cursor-pointer"
                            onClick={async () => {
                                const nextStatus =
                                    item.status === "planned"
                                        ? "in_progress"
                                        : item.status === "in_progress"
                                          ? "completed"
                                          : "planned";

                                await toggleBucketItemStatus(
                                    item.id,
                                    nextStatus,
                                );
                                toast.success("Stav aktualizován");
                            }}
                        >
                            {item.status === "completed" ? (
                                <Badge className="gap-1 bg-green-500 hover:bg-green-600">
                                    <CheckCircle2 className="size-3" /> Splněno
                                </Badge>
                            ) : item.status === "in_progress" ? (
                                <Badge
                                    variant="secondary"
                                    className="gap-1 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                >
                                    <CircleDashed className="size-3 animate-spin-slow" />{" "}
                                    Pracujeme na tom
                                </Badge>
                            ) : (
                                <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
                                    <Hourglass className="size-3" /> Naplánováno
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        <h3
                            className={`font-semibold text-lg ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        >
                            {item.title}
                        </h3>
                        {item.target_date && (
                            <p className="mt-1 text-muted-foreground text-xs">
                                Cíl:{" "}
                                {new Date(item.target_date).toLocaleDateString(
                                    "cs-CZ",
                                )}
                            </p>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}
