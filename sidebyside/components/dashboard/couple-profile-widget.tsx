"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings2, Heart } from "lucide-react";
import Link from "next/link";
import { ProfileData } from "@/types/profile";
import { differenceInDays } from "date-fns";
import ActionButton from "../action-button";

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
        <Card className="@container relative inset-shadow-muted inset-shadow-xs flex flex-col justify-between shadow-lg border-none h-full overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg">My dva</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
                <div className="flex flex-row xl:flex-row md:flex-col justify-between items-center gap-4">
                    {/* JÁ */}
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="border-2 border-primary w-16 h-16">
                            <AvatarImage
                                src={userProfile?.avatar_url}
                                className="object-cover"
                                referrerPolicy="no-referrer"
                                alt="your avatar image"
                            />
                            <AvatarFallback>JÁ</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="relative flex justify-center items-center min-w-28 sm:min-w-52 h-28 sm:h-52">
                        <Heart
                            className="absolute size-28 @min-[350px]:size-52 text-red-500 transition-all"
                            strokeWidth={1}
                        />

                        {daysTogether !== null ? (
                            <div className="z-10 relative flex flex-col justify-center items-center pb-2 animate-in duration-500 fade-in zoom-in">
                                <span className="drop-shadow-sm font-bold tabular-nums text-xl sm:text-4xl">
                                    {daysTogether}
                                </span>
                                <span className="font-semibold text-[9px] text-muted-foreground sm:text-xs uppercase tracking-widest">
                                    Dní
                                </span>
                            </div>
                        ) : (
                            <div className="absolute px-2 w-full">
                                <div className="bg-border/50 w-full h-px"></div>
                                <Heart className="top-1/2 left-1/2 absolute fill-red-500 size-4 text-red-500 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                        )}
                    </div>

                    {/* PARTNER */}
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            href={`/dashboard/profile/${partnerProfile?.id}`}
                            aria-label="partner profile link"
                        >
                            <Avatar className="border-2 border-muted size-16">
                                <AvatarImage
                                    src={partnerProfile?.avatar_url}
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                    alt="partner avatar image"
                                />
                                <AvatarFallback>TY</AvatarFallback>
                            </Avatar>
                        </Link>
                        <span className="font-medium text-muted-foreground text-sm">
                            {partnerProfile?.nickname ||
                                partnerProfile?.full_name}
                        </span>
                    </div>
                </div>
            </CardContent>
            <div className="mx-auto px-4 md:px-0 w-full max-w-lg">
                <Link href={`/dashboard/profile/${userProfile?.id}`}>
                    <ActionButton
                        variant="outline"
                        className="gap-2 w-full text-foregroud"
                    >
                        <Settings2 className="size-4" />
                        Upravit profil
                    </ActionButton>
                </Link>
            </div>
        </Card>
    );
}
