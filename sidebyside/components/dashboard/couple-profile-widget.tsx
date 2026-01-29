"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings2, Heart } from "lucide-react";
import Link from "next/link";
import { ProfileData } from "@/types/profile";
import { differenceInDays } from "date-fns";

interface CoupleProfileWidgetProps {
    userProfile?: ProfileData | null;
    partnerProfile?: ProfileData | null;
    relationshipStart?: string | null;
}

export function CoupleProfileWidget({
    userProfile,
    partnerProfile,
    relationshipStart,
}: CoupleProfileWidgetProps) {
    const daysTogether = relationshipStart
        ? differenceInDays(new Date(), new Date(relationshipStart))
        : null;

    return (
        <Card className="relative inset-shadow-muted inset-shadow-xs flex flex-col justify-between col-span-12 lg:col-span-4 shadow-lg border-none h-full overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg">My dva</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
                <div className="flex justify-between items-center gap-4">
                    {/* JÁ */}
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="border-2 border-primary w-16 h-16">
                            <AvatarImage
                                src={userProfile?.avatar_url}
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <AvatarFallback>JÁ</AvatarFallback>
                        </Avatar>
                    </div>

                    {/* SPOJENÍ */}
                    <div className="relative flex justify-center items-center min-w-32 h-32">
                        {/* POZADÍ - Velké srdce */}
                        {/* opacity-10 zajistí, že bude jen jemně vidět a text přes něj bude čitelný */}
                        <Heart
                            className="absolute text-red-500"
                            size={200}
                            strokeWidth={1}
                        />

                        {daysTogether !== null ? (
                            <div className="z-10 relative flex flex-col justify-center items-center pb-2 animate-in duration-500 fade-in zoom-in">
                                <span className="drop-shadow-sm font-bold tabular-nums text-3xl">
                                    {daysTogether}
                                </span>
                                <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
                                    Dní
                                </span>
                            </div>
                        ) : (
                            // Fallback (čára), pokud datum není nastaveno
                            <div className="absolute px-2 w-full">
                                <div className="bg-border/50 w-full h-px"></div>
                                <Heart className="top-1/2 left-1/2 absolute fill-red-500 w-4 h-4 text-red-500 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                        )}
                    </div>

                    {/* PARTNER */}
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="border-2 border-muted w-16 h-16">
                            <AvatarImage
                                src={partnerProfile?.avatar_url}
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <AvatarFallback>TY</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-muted-foreground text-sm">
                            {partnerProfile?.nickname ||
                                partnerProfile?.full_name}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    <Link href={`/dashboard/profile/${userProfile?.id}`}>
                        <Button variant="outline" className="gap-2 w-full">
                            <Settings2 className="size-4" />
                            Upravit profil
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
