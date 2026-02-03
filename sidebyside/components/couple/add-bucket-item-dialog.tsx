"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBucketItem } from "@/app/actions/couple";
import { Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ActionButton from "../action-button";

export function AddBucketItemDialog({ coupleId }: { coupleId: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <ActionButton>
                    <Plus className="size-4" />{" "}
                    <span className="hidden sm:block">Přidat sen</span>
                </ActionButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Nový sen</DialogTitle>
                </DialogHeader>

                <form
                    action={async (formData) => {
                        await createBucketItem(formData);
                        setIsOpen(false);
                    }}
                    className="gap-4 grid py-4"
                >
                    <input type="hidden" name="coupleId" value={coupleId} />

                    <div className="gap-2 grid">
                        <Label htmlFor="title">Co chcete zažít?</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Např. Cesta kolem světa"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="gap-2 grid">
                        <Label htmlFor="status">Stav</Label>
                        <Select name="status" defaultValue="planned">
                            <SelectTrigger>
                                <SelectValue placeholder="Vyber stav" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="planned">
                                    Plánujeme 📅
                                </SelectItem>
                                <SelectItem value="in_progress">
                                    Pracujeme na tom 🚧
                                </SelectItem>
                                <SelectItem value="completed">
                                    Splněno ✅
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ActionButton type="submit">Přidat na seznam</ActionButton>
                </form>
            </DialogContent>
        </Dialog>
    );
}
