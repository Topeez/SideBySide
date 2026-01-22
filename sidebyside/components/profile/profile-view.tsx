"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Edit,
    Gift,
    Heart,
    Palette,
    Ruler,
    Shirt,
    Footprints,
    Sparkles,
} from "lucide-react";
import { EditProfileDialog } from "./edit-profile-dialog";
import React, { useState } from "react";
import { ThemeToggleWrapper } from "../theme-switcher-wrapper";
import { Profile } from "@/types/profile";

// Typy (uprav podle své DB)

interface ProfileViewProps {
    profile: Profile;
    isEditable: boolean;
}

export function ProfileView({ profile, isEditable }: ProfileViewProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const initials = profile.full_name
        ? profile.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "JA";

    return (
        <div className="space-y-4 cs-container">
            {/* --- HLAVIČKA A AKCE --- */}
            <div className="flex md:flex-row flex-col justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="font-bold text-3xl md:text-left text-center tracking-tight">
                        {isEditable
                            ? "Můj Profil"
                            : `Profil ${profile.nickname || "partnera"}`}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditable
                            ? "Tady si nastav, co má tvůj partner vědět."
                            : "Tahák pro nákup dárků a plánování."}
                    </p>
                </div>

                {isEditable ? (
                    <div className="flex gap-4">
                        <ThemeToggleWrapper />
                        <Button
                            onClick={() => setIsEditDialogOpen(true)}
                            className="gap-2 bg-primary text-background cursor-pointer"
                        >
                            <Edit className="size-4" />
                            <span className="hidden md:block">
                                Upravit údaje
                            </span>
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="gap-2 hover:bg-primary/10 border-primary border-dashed text-primary"
                    >
                        <Gift className="w-4 h-4" /> Přidat nápad na dárek
                    </Button>
                )}
            </div>

            {/* --- BENTO GRID --- */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(120px,auto)]">
                {/* 1. KARTA IDENTITY (Velká) - col-span-2 */}
                <Card className="flex flex-col justify-center items-center md:col-span-2 md:row-span-2 bg-linear-to-br from-background to-muted/50 p-6 border-2 text-center">
                    <Avatar className="shadow-xl mb-4 border-4 border-background w-32 h-32">
                        <AvatarImage
                            src={profile.avatar_url || ""}
                            className="object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <AvatarFallback className="text-4xl">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="font-bold text-2xl">{profile.full_name}</h2>
                    <p className="mb-4 text-muted-foreground text-lg">
                        @{profile.nickname || "Přezdívka"}
                    </p>
                    {profile.bio && (
                        <div className="bg-background/80 shadow-sm p-3 border rounded-lg max-w-xs text-stone-600 text-sm italic">
                            &quot;{profile.bio}&quot;
                        </div>
                    )}
                </Card>

                {/* 2. LOVE LANGUAGE (Jazyk lásky) - col-span-2 */}
                <Card className="md:col-span-2 bg-pink-50/50 dark:bg-pink-950/10 border-pink-100 dark:border-pink-900">
                    <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                        <CardTitle className="font-medium text-pink-600 text-sm">
                            Jazyk lásky
                        </CardTitle>
                        <Heart
                            className="size-4 text-pink-500"
                            fill="currentColor"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl capitalize">
                            {profile.love_language || "Nezadáno"}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">
                            Jak nejraději přijímá lásku?
                        </p>
                    </CardContent>
                </Card>

                {/* 3. CHEAT SHEET (Velikosti) - col-span-2, row-span-2 (vysoká) */}
                <Card className="relative md:col-span-2 md:row-span-2 overflow-hidden">
                    <div className="top-0 right-0 absolute opacity-5 p-4">
                        <Ruler className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                            Velikostní tahák
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="gap-4 grid grid-cols-2">
                        <SizeItem
                            icon={<Shirt className="size-4" />}
                            label="Tričko / Top"
                            value={profile.clothing_size_top}
                        />
                        <SizeItem
                            icon={<Shirt className="size-4 rotate-180" />} // Kalhoty (hacknutá ikona)
                            label="Kalhoty"
                            value={profile.clothing_size_bottom}
                        />
                        <SizeItem
                            icon={<Footprints className="size-4" />}
                            label="Boty"
                            value={profile.shoe_size}
                        />
                        <SizeItem
                            icon={
                                <div className="border-2 border-current rounded-full size-4" />
                            }
                            label="Prstýnek"
                            value={profile.ring_size}
                            highlight
                        />
                    </CardContent>
                </Card>

                {/* 4. OBLÍBENÁ BARVA - col-span-1 */}
                <Card className="flex flex-col justify-center items-center md:col-span-1 p-4">
                    <div className="flex items-center gap-2 mb-2 font-medium text-muted-foreground text-sm">
                        <Palette className="w-4 h-4" /> Oblíbená barva
                    </div>
                    {profile.favorite_color ? (
                        <div className="flex items-center gap-2">
                            <div
                                className="shadow-sm border-2 rounded-full w-8 h-8"
                                style={{
                                    backgroundColor: profile.favorite_color,
                                }}
                            />
                            <span className="font-mono text-xs">
                                {profile.favorite_color}
                            </span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                    )}
                </Card>

                {/* 5. Placeholder pro další info - col-span-1 */}
                <Card className="flex flex-col justify-center items-center md:col-span-1 bg-muted/30 p-4 border-dashed">
                    <span className="text-muted-foreground text-xs">
                        Další detaily brzy...
                    </span>
                </Card>
            </div>

            {/* Dialog pro editaci */}
            <EditProfileDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                profile={profile}
            />
        </div>
    );
}

// Pomocná komponenta pro velikosti
function SizeItem({
    icon,
    label,
    value,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | null;
    highlight?: boolean;
}) {
    return (
        <div
            className={`flex flex-col p-3 rounded-lg border ${highlight ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900" : "bg-muted/30 border-transparent"}`}
        >
            <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                {icon}
                <span className="font-medium text-xs uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <div
                className={`text-xl font-bold ${!value && "text-muted-foreground/40 text-sm font-normal"}`}
            >
                {value || "Neznámo"}
            </div>
        </div>
    );
}
