import { createClient } from "@/utils/supabase/server";
import CoupleHero from "@/components/couple/couple-hero";
import { CoupleTimeline } from "@/components/couple/timeline";
import { BucketList } from "@/components/couple/bucket-list";
import { AddMilestoneDialog } from "@/components/couple/add-milestone-dialog";
import { AddBucketItemDialog } from "@/components/couple/add-bucket-item-dialog";
import { ThemeToggleWrapper } from "@/components/theme-switcher-wrapper";
import { UserNav } from "@/components/dashboard/user-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import InviteButton from "@/components/dashboard/invite-button";
import { Card, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { ToastNotifier } from "@/components/toast-notifier";

export default async function CouplePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Najdeme pár, kde jsem buď user1 nebo user2
    const { data: couple, error } = await supabase
        .from("couples")
        .select(
            `
            *,
            user1:user1_id (nickname, avatar_url),
            user2:user2_id (nickname, avatar_url)
        `,
        )
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .single();

    if (error || !couple) {
        return (
            <div className="flex justify-center items-center h-screen cs-container">
                <ToastNotifier
                    message="Nemůžeme najít tvůj pár."
                    type="error"
                />

                <Card className="p-6">
                    <CardHeader className="font-bold text-xl">
                        Jejda, nemůžeme najít tvůj pár.
                    </CardHeader>
                    <div className="flex flex-col items-center gap-4 mt-4">
                        <p className="text-muted-foreground">
                            Abyste mohli vidět tuto stránku, musíte být
                            spárovaní.
                        </p>
                        <div className="flex items-center gap-2 p-2 border rounded-lg">
                            <span className="text-sm">
                                Pozvi svou polovičku:
                            </span>
                            <InviteButton userId={user?.id || ""} />
                        </div>
                        <Link href="/dashboard">
                            <Button variant="outline">Zpět na Dashboard</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    const user1Data = Array.isArray(couple.user1)
        ? couple.user1[0]
        : couple.user1;
    const user2Data = Array.isArray(couple.user2)
        ? couple.user2[0]
        : couple.user2;

    const { data: milestones } = await supabase
        .from("milestones")
        .select("*")
        .eq("couple_id", couple.id)
        .order("date", { ascending: true });

    // 4. Načtení Bucket Listu
    const { data: bucketList } = await supabase
        .from("bucket_list_items")
        .select("*")
        .eq("couple_id", couple.id)
        .order("status", { ascending: false })
        .order("created_at", { ascending: false });

    return (
        <div className="gap-4 py-8 cs-container">
            <div className="flex justify-between items-center mb-8 w-full">
                <span className="font-bold text-2xl sm:text-3xl">Vztah</span>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" aria-label="dashboard link">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="dashboard link button"
                            className="relative bg-accent shadow-md border border-muted rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <LayoutDashboard />
                        </Button>
                    </Link>
                    <ThemeToggleWrapper />
                    <UserNav
                        id={user?.id || ""}
                        email={user?.email || ""}
                        avatar_url={user?.user_metadata.avatar_url}
                        full_name={user?.user_metadata.full_name || ""}
                    />
                </div>
            </div>
            {/* HERO SECTION */}
            <CoupleHero couple={couple} user1={user1Data} user2={user2Data} />
            {/* GRID LAYOUT */}
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-12 mt-12">
                <div className="space-y-6 lg:col-span-5">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-2xl tracking-tight">
                            Naše cesta
                        </h2>
                        <AddMilestoneDialog coupleId={couple.id} />
                    </div>

                    <CoupleTimeline items={milestones || []} />
                </div>

                <div className="space-y-6 lg:col-span-7">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-2xl tracking-tight">
                            Bucket List
                        </h2>
                        <AddBucketItemDialog coupleId={couple.id} />
                    </div>

                    <BucketList items={bucketList || []} />
                </div>
            </div>
        </div>
    );
}
