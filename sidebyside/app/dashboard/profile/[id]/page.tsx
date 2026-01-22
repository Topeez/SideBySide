// app/profile/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ProfileView } from "@/components/profile/profile-view"; // Tvá vizualizace

interface ProfilePageProps {
    params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const supabase = await createClient();
    const { id } = await params;

    // 1. Zjistíme, kdo se dívá (já)
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    console.log("Hledám profil ID:", id);

    // 2. Načteme data profilu podle ID v URL
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    console.log("Výsledek:", profile, error);

    if (error || !profile) {
        return notFound();
    }

    // 3. Logika oprávnění (vidím to já nebo můj partner?)
    const isMyProfile = user.id === id;

    if (!isMyProfile) {
        // ... ověření páru (viz předchozí odpovědi) ...
        const { data: couple } = await supabase
            .from("couples")
            .select("*")
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            .single();

        const isPartner =
            couple && (couple.user1_id === id || couple.user2_id === id);
        if (!isPartner) return <div>Nemáš přístup.</div>;
    }

    return (
        <div className="py-8">
            <ProfileView profile={profile} isEditable={isMyProfile} />
        </div>
    );
}
