import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import InviteButton from "@/components/dashboard/invite-button";
import { LoveNoteCard } from "@/components/dashboard/love-note-card";
import { TodoList } from "@/components/dashboard/todo-list";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { ClosestEvent } from "@/components/dashboard/closest-event";
import { UserNav } from "@/components/dashboard/user-nav";
import { CoupleProfileWidget } from "@/components/dashboard/couple-profile-widget";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-stone-600">
                    Nepodařilo se načíst uživatele.
                </p>
            </div>
        );
    }

    const userName = user.user_metadata.name || "Návštěvníku";

    // 1. Načteme Pár
    const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

    // 2. Načteme Profily (NOVÉ) - potřebujeme je pro widget i kalendář
    let userProfile = null;
    let partnerProfile = null;

    // Můj profil
    const { data: myProfileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
    userProfile = myProfileData;

    // Partnerův profil (pokud existuje pár)
    if (couple) {
        const partnerId =
            couple.user1_id === user.id ? couple.user2_id : couple.user1_id;
        const { data: pData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", partnerId)
            .single();
        partnerProfile = pData;
    }

    // 3. Načteme Úkoly
    let todos = [];
    if (couple) {
        const { data } = await supabase
            .from("todos")
            .select("*")
            .eq("couple_id", couple.id)
            .order("created_at", { ascending: false });
        todos = data || [];
    }

    // 4. Načteme Události
    let events = [];
    let nextEvent = null;
    if (couple) {
        const now = new Date().toISOString();
        // Nejbližší akce
        const { data: nextEventData } = await supabase
            .from("events")
            .select("*")
            .eq("couple_id", couple.id)
            .gte("start_time", now)
            .order("start_time", { ascending: true })
            .limit(1)
            .single();
        nextEvent = nextEventData;

        // Všechny akce pro kalendář
        const { data: allEventsData } = await supabase
            .from("events")
            .select("*")
            .eq("couple_id", couple.id);
        events = allEventsData || [];
    }

    return (
        <div className="space-y-6 p-4 md:p-8 cs-container">
            {/* --- HEADER --- */}
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
                    <UserNav
                        avatar_url={user.user_metadata.avatar_url}
                        fullname={""}
                    />
                </div>
            </header>

            {/* --- BENTO GRID --- */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
                {/* 1. ŘÁDEK */}

                {/* Hlavní karta - Next Event */}
                <ClosestEvent
                    nextEvent={nextEvent}
                    hasCouple={!!couple}
                    coupleId={couple?.id}
                />

                {/* Love Note */}
                {couple ? (
                    <LoveNoteCard
                        initialNote={couple.love_note}
                        coupleId={couple.id}
                        authorId={couple.love_note_author_id}
                        currentUserId={user.id}
                    />
                ) : (
                    <Card className="md:col-span-1 bg-[#FFF5F0] border-[#FFDCC7] border-dashed">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 font-medium text-secondary text-sm">
                                <Heart className="fill-secondary size-4" />
                                Love Note
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-center h-24">
                            <p className="mb-3 text-stone-500 text-xs">
                                Tady si budete psát vzkazy.
                            </p>
                            <div className="scale-90 origin-left">
                                <InviteButton userId={user.id} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Úkoly */}
                {couple ? (
                    <TodoList initialTodos={todos} coupleId={couple.id} />
                ) : (
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShoppingBag className="w-4 h-4" /> Nákupy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="py-6 text-stone-400 text-sm text-center">
                                Zatím jsi na to sám/sama.
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 2. ŘÁDEK - Kalendář a Profil */}

                {couple ? (
                    <>
                        {/* Kalendář (má v sobě nastaveno md:col-span-2 ?) */}
                        {/* Pokud ne, musíme ho obalit nebo mu poslat className, ale CalendarWidget v minulém kroku měl Card s md:col-span-2 */}
                        <CalendarWidget
                            events={events}
                            coupleId={couple.id}
                            userProfile={userProfile}
                            partnerProfile={partnerProfile}
                        />

                        {/* Profil Widget (vyplní zbylé místo - col-span-1) */}
                        <CoupleProfileWidget
                            userProfile={userProfile}
                            partnerProfile={partnerProfile}
                        />
                    </>
                ) : (
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Kalendář</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center bg-stone-50 rounded-md h-48 text-stone-400">
                            (Kalendář se aktivuje po spárování)
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
