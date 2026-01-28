import { createClient } from "@/utils/supabase/server";
import { UserNav } from "./user-nav";
import { ThemeToggleWrapper } from "../theme-switcher-wrapper";
import Link from "next/link";
import { House } from "lucide-react";
import { NotificationsBell } from "./notifications-bell";

export async function DashboardHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const userName = user?.user_metadata.name || "Návštěvníku";

    const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .single();

    return (
        <header className="flex justify-between items-center bg-background shadow-sm mb-8 px-6 border border-b rounded-lg h-16">
            <div>
                <h1 className="font-bold text-foreground text-md sm:text-2xl">
                    Ahoj, {userName}! 👋
                </h1>
                <p className="hidden sm:block text-muted-foreground text-xs md:text-sm">
                    {couple
                        ? "Co spolu dnes podniknete?"
                        : "Vítej ve své osobní zóně."}
                </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                <Link href="/" className="p-2 border border-muted rounded-full">
                    <House
                        size={18}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    />
                </Link>
                <ThemeToggleWrapper />
                <NotificationsBell userId={user.id} />
                <UserNav
                    user_id={user?.id || ""}
                    email={user?.email || ""}
                    avatar_url={user?.user_metadata.avatar_url}
                    full_name={""}
                />
            </div>
        </header>
    );
}
