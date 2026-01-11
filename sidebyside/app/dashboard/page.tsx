import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, ShoppingBag, Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import InviteButton from "@/components/dashboard/invite-button";
import { LoveNoteCard } from "@/components/dashboard/love-note-card";

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

    const userName = user.user_metadata.name
        ? user.user_metadata.name
        : "Návštěvníku";

    const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

    if (!couple)
        return (
            <div>
                Musíš se nejdřív spárovat! <InviteButton userId={user.id} />
            </div>
        );

    return (
        <div className="space-y-6 p-4 md:p-8 cs-container">
            {/* 1. Header sekce */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-bold text-stone-800 text-2xl">
                        Ahoj, {userName}! 👋
                    </h1>
                    <p className="text-stone-500">Co spolu dnes podniknete?</p>
                </div>
                <div className="flex -space-x-2">
                    {/* Avataři (zatím placeholdery) */}
                    <div className="flex justify-center items-center bg-stone-200 border-2 border-white rounded-full w-10 h-10 text-xs">
                        JA
                    </div>
                    <InviteButton userId={user.id} />
                </div>
            </header>

            {/* 2. Bento Grid */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                {/* Hlavní karta - Next Event (zabírá 2 sloupce) */}
                <Card className="md:col-span-2 bg-[#8FBC8F]/10 border-[#8FBC8F]/30">
                    <CardHeader className="flex flex-row justify-between items-center pb-2">
                        <CardTitle className="font-medium text-[#2F4F2F] text-lg">
                            Nejbližší plán
                        </CardTitle>
                        <CalendarDays className="w-5 h-5 text-[#8FBC8F]" />
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2 font-bold text-stone-800 text-3xl">
                            Víkend v Praze 🏰
                        </div>
                        <p className="mb-6 text-stone-600">
                            Sobota, 14:00 • Staromák
                        </p>
                        <Button className="bg-[#8FBC8F] hover:bg-[#7DA87D] text-white">
                            <Plus className="mr-2 w-4 h-4" /> Přidat další
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Note / Mood (1 sloupec) */}
                <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                    {/* Předáme data do komponenty */}
                    <LoveNoteCard
                        initialNote={couple.love_note}
                        coupleId={couple.id}
                        authorId={couple.love_note_author_id}
                        currentUserId={user.id}
                    />
                </div>

                {/* Společný Task list (1 sloupec) */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ShoppingBag className="w-4 h-4" /> Společné úkoly
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {[
                                "Koupit lístky do kina",
                                "Vybrat dárky",
                                "Zaplatit netflix",
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-2 text-stone-600 text-sm"
                                >
                                    <div className="border border-stone-300 rounded-full w-4 h-4" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Kalendář náhled (2 sloupce) */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Tento měsíc</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center bg-stone-50 rounded-md h-48 text-stone-400">
                        (Tady přijde `react-day-picker` nebo `FullCalendar`)
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
