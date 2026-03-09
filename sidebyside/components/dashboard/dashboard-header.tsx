import { createClient } from "@/utils/supabase/server";
import { UserNav } from "./user-nav";
import { ThemeToggleWrapper } from "../theme-switcher-wrapper";
import { House } from "lucide-react";
import { NotificationsBell } from "./notifications/notifications-bell";
import { MoodCheckIn } from "./mood-check-in";
import { MoodCheckInProps } from "@/types/mood";

export async function DashboardHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const userName = user?.user_metadata.name || "Návštěvníku";

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

    if (!profile)
        return (
            <div className="flex justify-center items-center text-xl cs-container">
                Profil nenalezen.
            </div>
        );

    const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .maybeSingle();

    let moodProps: MoodCheckInProps | null = null;

    if (couple) {
        const partnerId =
            couple.user1_id === user.id ? couple.user2_id : couple.user1_id;

        const [{ data: myData }, { data: partnerData }] = await Promise.all([
            supabase.from("profiles").select("nickname, avatar_url").eq("id", user.id).single(),
            supabase.from("profiles").select("nickname, avatar_url").eq("id", partnerId).single(),
        ]);

        const isUser1 = couple.user1_id === user.id;
        moodProps = {
            myMood: (isUser1 ? couple.user1_mood : couple.user2_mood) ?? null,
            myMoodUpdatedAt: (isUser1 ? couple.user1_mood_updated_at : couple.user2_mood_updated_at) ?? null,
            partnerMood: (isUser1 ? couple.user2_mood : couple.user1_mood) ?? null,
            partnerMoodUpdatedAt: (isUser1 ? couple.user2_mood_updated_at : couple.user1_mood_updated_at) ?? null,
            myNickname: myData?.nickname ?? "Já",
            partnerNickname: partnerData?.nickname ?? "Partner",
            myAvatar: myData?.avatar_url,
            partnerAvatar: partnerData?.avatar_url,
        };
    }

    return (
        <header className="flex justify-between items-center mb-8 px-6 rounded-lg h-16">
            <div>
                <h1 className="font-bold text-foreground text-md sm:text-2xl">
                    Ahoj, {userName}!
                </h1>
                <p className="hidden sm:block text-muted-foreground text-xs md:text-sm">
                    {couple
                        ? "Co spolu dnes podniknete?"
                        : "Vítej ve své osobní zóně."}
                </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
                      href="/"
                      aria-label="back to home link"
                      className="hidden sm:flex bg-accent hover:bg-accent dark:hover:bg-accent/50 shadow-md p-2 border border-muted rounded-full text-muted-foreground transition-colors hover:text-accent-foreground cursor-pointer"
                    >
                      <House size={18} />
                    </a>

                    <div className="hidden sm:flex">
                        <ThemeToggleWrapper />
                    </div>
                    {moodProps && (
                        <>
                            <div className="sm:hidden flex">
                                <MoodCheckIn {...moodProps} compact />
                            </div>
                            <div className="hidden sm:flex">
                                <MoodCheckIn {...moodProps} />
                            </div>
                        </>
                    )}
                <NotificationsBell userId={user.id} />
                <UserNav
                    id={user?.id || ""}
                    email={user?.email || ""}
                    avatar_url={profile?.avatar_url}
                    full_name={""}
                    couple_id={couple?.id}
                />
            </div>
            
        </header>
    );
}
