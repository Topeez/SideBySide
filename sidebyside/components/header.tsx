import { Heart, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import LoginButton from "./login-button";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";

export default async function Header() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <header className="top-0 right-0 left-0 z-999 fixed bg-muted/5 shadow-xs backdrop-blur-lg">
            <nav className="flex justify-between items-center py-4 w-full cs-container">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-foreground text-xl"
                >
                    <Heart
                        className="size-6 text-secondary"
                        fill="currentColor"
                    />{" "}
                    SideBySide
                </Link>

                <div className="flex items-center gap-3">
                    {user ? (
                        <Link href="/dashboard">
                            <Button className="gap-2 bg-primary hover:bg-primary-foreground shadow-md text-background cursor-pointer">
                                <LayoutDashboard className="size-4" />
                                Přejít do aplikace
                            </Button>
                        </Link>
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </nav>
        </header>
    );
}
