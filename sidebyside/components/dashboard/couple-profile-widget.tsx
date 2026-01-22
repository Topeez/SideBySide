"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings2, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { ProfileData } from "@/types/profile";

interface CoupleProfileWidgetProps {
    userProfile?: ProfileData | null;
    partnerProfile?: ProfileData | null;
}

export function CoupleProfileWidget({
    userProfile,
    partnerProfile,
}: CoupleProfileWidgetProps) {
    return (
        <Card className="relative flex flex-col justify-between col-span-12 lg:col-span-4 h-full overflow-hidden">
            <div className="top-0 right-0 absolute opacity-10 p-4">
                <HeartHandshake className="size-24" />
            </div>

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
                    <div className="-top-2.5 relative flex-1 bg-border h-px">
                        <div className="-top-2 left-1/2 absolute text-red-500 -translate-x-1/2">
                            ❤️
                        </div>
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
                    <Link href={`/dashboard/profile/${userProfile?.user_id}`}>
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
