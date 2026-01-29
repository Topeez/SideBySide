import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import InviteButton from "@/components/dashboard/invite-button";
import { LoveNoteCard } from "@/components/dashboard/love-note-card";
import { TodoList } from "@/components/dashboard/todo-list";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { ClosestEvent } from "@/components/dashboard/closest-event";
import { CoupleProfileWidget } from "@/components/dashboard/couple-profile-widget";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

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
            .maybeSingle();
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
            <DashboardHeader />

            {/* --- BENTO GRID --- */}
            <div className="gap-4 grid grid-cols-12">
                {couple ? (
                    <ClosestEvent
                        nextEvent={nextEvent}
                        hasCouple={!!couple}
                        coupleId={couple?.id}
                    />
                ) : (
                    <Card className="col-span-12 md:col-span-8 bg-primary/15 border-primary h-full">
                        <CardContent>
                            <div className="mb-2 font-bold text-foreground text-2xl">
                                Naplánujte si něco hezkého se svou polovičkou.
                            </div>
                            <p className="mb-6 text-muted-foreground">
                                Ale nejprv si ji/ho musíš přidat!
                            </p>
                            <div className="flex items-center gap-2 scale-90 origin-left">
                                <InviteButton
                                    userId={user.id}
                                    className="bg-primary hover:bg-primary-foreground"
                                />
                                <span className="text-muted-foreground">
                                    Pozvi svou polovičku
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Love Note */}
                {couple ? (
                    <LoveNoteCard
                        initialNote={couple.love_note}
                        coupleId={couple.id}
                        authorId={couple.love_note_author_id}
                        currentUserId={user.id}
                    />
                ) : (
                    <Card className="col-span-12 md:col-span-3 lg:col-span-4 bg-secondary/15 border-secondary border-dashed">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 font-medium text-secondary text-sm">
                                <Heart className="fill-secondary size-4" />
                                Love Note
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-center h-24">
                            <p className="mb-3 text-muted-foreground text-xs">
                                Tady si budete psát vzkazy.
                            </p>
                            <div className="flex items-center gap-2 scale-90 origin-left">
                                <InviteButton userId={user.id} />
                                <span className="text-muted-foreground">
                                    Pozvi svou polovičku
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {couple ? (
                    <TodoList initialTodos={todos} coupleId={couple.id} />
                ) : (
                    <Card className="col-span-12 md:col-span-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShoppingBag className="w-4 h-4" /> Úkoly
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="py-6 text-muted-foreground text-sm text-center">
                                Zatím jsi na to sám/sama.
                            </div>
                        </CardContent>
                    </Card>
                )}

                {couple ? (
                    <>
                        <CalendarWidget
                            events={events}
                            coupleId={couple.id}
                            userProfile={userProfile}
                            partnerProfile={partnerProfile}
                        />

                        <CoupleProfileWidget
                            userProfile={userProfile}
                            partnerProfile={partnerProfile}
                            relationshipStart={couple?.relationship_start}
                        />
                    </>
                ) : (
                    <Card className="col-span-12 md:col-span-4">
                        <CardHeader>
                            <CardTitle>Kalendář</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center rounded-md h-48 text-muted-foreground">
                            (Kalendář se aktivuje po spárování)
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
