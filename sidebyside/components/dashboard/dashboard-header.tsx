import { createClient } from "@/utils/supabase/server";
import { UserNav } from "./user-nav";
import { ThemeToggleWrapper } from "../theme-switcher-wrapper";

export async function DashboardHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const userName = user?.user_metadata.name || "Návštěvníku";

    const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .single();

    return (
        <header className="flex justify-between items-center bg-background shadow-sm mb-8 px-6 border border-b rounded-lg h-16">
            <div>
                <h1 className="font-bold text-foreground text-2xl">
                    Ahoj, {userName}! 👋
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm">
                    {couple
                        ? "Co spolu dnes podniknete?"
                        : "Vítej ve své osobní zóně."}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggleWrapper />
                <UserNav
                    avatar_url={user?.user_metadata.avatar_url}
                    fullname={""}
                />
            </div>
        </header>
    );
}
