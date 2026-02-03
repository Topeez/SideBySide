"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { Heart, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCoverPhoto } from "@/app/actions/couple";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CoupleHeroProps {
    couple: {
        id: string;
        cover_url?: string | null;
        relationship_start: string;
    };
    user1: {
        nickname: string;
        avatar_url?: string | null;
    };
    user2: {
        nickname: string;
        avatar_url?: string | null;
    };
}

export default function CoupleHero({ couple, user1, user2 }: CoupleHeroProps) {
    const startDate = new Date(couple.relationship_start);
    const today = new Date();
    const daysTogether = differenceInDays(today, startDate);

    const u1Init = user1.nickname[0] || "A";
    const u2Init = user2.nickname[0] || "B";

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Obrázek je příliš velký (max 5MB).");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("cover", file);

        try {
            await updateCoverPhoto(couple.id, formData);
            toast.success("Pozadí aktualizováno!");
        } catch (error) {
            console.error(error);
            toast.error("Nepodařilo se nahrát obrázek.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    const bgStyle = couple.cover_url
        ? {
              backgroundImage: `url(${couple.cover_url})`,
              borderRadius: "calc(var(--radius) + 12px)",
          }
        : { background: "linear-gradient(to right, #ec4899, #8b5cf6)" };

    return (
        <div className="group relative col-span-12 shadow-xl mb-8 rounded-3xl w-full overflow-hidden">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            {/* 1. Pozadí (Cover Image) */}
            <div
                className="absolute inset-0 bg-cover bg-center lg:bg-top-[center] rounded-3xl transition-transform duration-700"
                style={bgStyle}
            >
                {/* Overlay pro ztmavení, aby byl text čitelný */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-3xl" />
            </div>

            {/* Tlačítko pro změnu coveru (jen ikonka v rohu) */}
            <Button
                variant="ghost"
                size="icon"
                className="top-4 right-4 z-20 absolute hover:bg-muted/30 text-foreground/70 hover:text-white cursor-pointer"
                onClick={handleCameraClick}
                disabled={isUploading}
            >
                {isUploading ? (
                    <Loader2 className="size-5 animate-spin" />
                ) : (
                    <Camera className="size-5" />
                )}
            </Button>

            {/* 2. Obsah */}
            <div className="z-10 relative flex flex-col justify-center items-center px-4 py-16 text-white text-center">
                {/* Avatary (překrývající se) */}
                <div className="flex justify-center items-center -space-x-4 mb-6">
                    <Avatar className="shadow-lg border-4 border-background/50 size-20">
                        <AvatarImage src={user1.avatar_url || ""} />
                        <AvatarFallback className="bg-white/10 backdrop-blur-md text-white text-xl">
                            {u1Init}
                        </AvatarFallback>
                    </Avatar>

                    {/* Srdíčko mezi nimi */}
                    <div className="z-10 flex justify-center items-center bg-linear-to-br from-red-500 to-pink-600 shadow-lg -mt-8 p-2 border-4 border-background/50 rounded-full size-12">
                        <Heart className="fill-white size-5 text-white animate-pulse" />
                    </div>

                    <Avatar className="shadow-lg border-4 border-background/50 size-20">
                        <AvatarImage src={user2.avatar_url || ""} />
                        <AvatarFallback className="bg-white/10 backdrop-blur-md text-white text-xl">
                            {u2Init}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Texty */}
                <h1 className="drop-shadow-md mb-2 font-bold text-3xl md:text-5xl tracking-tight">
                    {user1.nickname.split(" ")[0]}{" "}
                    <span className="font-light text-white/60">&</span>{" "}
                    {user2.nickname.split(" ")[0]}
                </h1>

                <div className="flex items-center gap-3 mb-8">
                    <Badge
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1 border-none text-white text-sm"
                    >
                        Spolu {daysTogether} dní
                    </Badge>
                    <Badge
                        variant="outline"
                        className="px-3 py-1 border-white/40 text-white text-sm"
                    >
                        Od {new Date(startDate).toLocaleDateString("cs-CZ")}
                    </Badge>
                </div>
            </div>
        </div>
    );
}
