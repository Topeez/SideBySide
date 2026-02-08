import { ArrowUpRight, CirclePlay, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getReleases } from "@/lib/github";
import Squares from "@/components/Squares";
import ActionButton from "./action-button";
import LoginButton from "./login-button";
import { createClient } from "@/utils/supabase/server";

export default async function Hero() {
    const releases = await getReleases();
    const latestRelease = releases.length > 0 ? releases[0] : null;
    const versionLabel = latestRelease?.tag_name || "Nová verze";

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        // Nastavíme relativní pozici pro kontejner
        <div className="relative flex justify-center items-center bg-background px-6 w-full min-h-screen overflow-hidden transform-3d">
            {/* POZADÍ */}
            <div className="absolute inset-0 size-full">
                <Squares
                    direction="diagonal"
                    speed={0.2}
                    squareSize={40}
                    borderColor="--muted" /* gray-200 - velmi jemná */
                    hoverFillColor="#fce7f3" /* pink-100 - efekt při najetí myší */
                />
            </div>

            {/* OBSAH - musí mít z-index, aby byl nad pozadím */}
            <div className="z-10 relative max-w-3xl text-center">
                <Badge
                    asChild
                    className="backdrop-blur-[10px] py-1 border-border rounded-full cursor-pointer" // Přidán blur pro lepší čitelnost
                    variant="outline"
                >
                    <Link href="/changelog">
                        Právě vyšla{" "}
                        <span className="mx-1 font-bold">{versionLabel}</span>
                        <ArrowUpRight className="ml-1 size-4" />
                    </Link>
                </Badge>

                <h1 className="bg-clip-text bg-linear-to-b from-foreground mt-6 p-2 font-semibold text-transparent text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] tracking-tighter to-accent-foreground">
                    SideBySide
                </h1>
                <p className="backdrop-blur-xs mt-6 p-8 rounded-3xl font-sans text-foreground md:text-xl">
                    Plánujte společně, žijte lépe. Aplikace pro páry, která
                    sjednocuje sdílený kalendář, plány a vzpomínky na jedno
                    místo.
                </p>
                <div className="flex justify-center items-center gap-4 mt-12">
                    {user ? (
                        <Link href="/dashboard">
                            <ActionButton className="gap-2 bg-primary-foreground dark:bg-primary p-6! rounded-full text-lg cursor-pointer">
                                <LayoutDashboard className="size-4" />
                                Přejít do aplikace
                            </ActionButton>
                        </Link>
                    ) : (
                        <LoginButton>
                            Začít zdarma <ArrowUpRight className="size-5" />
                        </LoginButton>
                    )}
                    <ActionButton
                        className="bg-white/50 shadow-none backdrop-blur-sm p-6! border-background rounded-full text-foreground text-lg"
                        variant="outline"
                        size="lg"
                    >
                        <Link
                            href="/changelog"
                            className="flex items-center gap-2"
                        >
                            <CirclePlay className="size-5" /> Co je nového
                        </Link>
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}
