"use client";

import { Button } from "@/components/ui/button";
import { Plus, Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InviteButton({
    userId,
    className,
}: {
    userId: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopyInvite = () => {
        const inviteLink = `${window.location.origin}/invite?code=${userId}`;

        navigator.clipboard.writeText(inviteLink);

        setCopied(true);

        toast.success("Odkaz zkopírován!", {
            description: "Pošli ho své polovičce a začněte plánovat.",
            duration: 3000,
            icon: <Copy className="size-4 text-primary" />,
        });

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            onClick={handleCopyInvite}
            className={cn(
                "z-0 hover:z-20 flex justify-center items-center bg-secondary hover:bg-[#cf866c] shadow-sm p-0 rounded-full w-10 h-10 text-white hover:scale-105 transition-all",
                className,
            )}
            title="Pozvat partnera"
        >
            {copied ? (
                <Check className="size-5" />
            ) : (
                <Plus className="size-5" />
            )}
        </Button>
    );
}
