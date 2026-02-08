"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ProfileData } from "@/types/profile";
import { useCallback, useEffect } from "react";
export function UserNav({
    id,
    email,
    avatar_url,
    full_name,
    nickname,
    couple_id,
}: ProfileData) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = useCallback(async () => {
        await supabase.auth.signOut();
        router.push("/");
    }, [router, supabase.auth]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.altKey && e.code === "KeyP") {
                e.preventDefault();
                router.push(`/dashboard/profile/${id}`);
            }
            if (e.altKey && e.code === "KeyS") {
                e.preventDefault();
                router.push("/dashboard/settings");
            }
            if (e.altKey && e.code === "KeyC") {
                e.preventDefault();
                router.push("/dashboard/couple");
            }
            if (e.altKey && e.code === "KeyQ") {
                e.preventDefault();
                handleSignOut();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [id, router, handleSignOut]);

    const initials = full_name
        ? full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "JA";

    const fullAvatarUrl = avatar_url?.startsWith("http")
        ? avatar_url
        : avatar_url
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatar_url}`
          : undefined;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative shadow-md rounded-full size-10 cursor-pointer"
                >
                    <Avatar className="border border-muted size-10">
                        {/* Zobrazíme Image jen pokud máme URL */}
                        {fullAvatarUrl && (
                            <AvatarImage
                                src={fullAvatarUrl}
                                alt={nickname || full_name}
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                        )}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="font-medium text-sm leading-none">
                            Můj Profil
                        </p>
                        <p className="text-muted-foreground text-xs leading-none">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link
                        href={`/dashboard/profile/${id}`}
                        className={` ${couple_id ? "cursor-pointer" : "cursor-disabled"}`}
                    >
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 size-4" />
                            <span>O mně</span>
                            <DropdownMenuShortcut>⌥P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>

                    <Link href="/dashboard/settings">
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 size-4" />
                            <span>Nastavení</span>
                            <DropdownMenuShortcut>⌥S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/couple">
                        <DropdownMenuItem className="cursor-pointer">
                            <Heart className="mr-2 size-4 text-destructive" />
                            <span>Náš vztah</span>
                            <DropdownMenuShortcut>⌥C</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive cursor-pointer"
                >
                    <LogOut className="mr-2 size-4 text-destructive" />
                    <span>Odhlásit se</span>
                    <DropdownMenuShortcut>⌥Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
