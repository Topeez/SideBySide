import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile/profile-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordForm } from "@/components/settings/password-form";
import { DeleteAccount } from "@/components/settings/delete-account";
import { RelationshipForm } from "@/components/settings/relationships-form";
import { ThemeToggleWrapper } from "@/components/theme-switcher-wrapper";
import { UserNav } from "@/components/dashboard/user-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { AppearanceForm } from "@/components/settings/appearance-form";
import { PushNotificationManager } from "@/components/push-notification-manager";
export default async function SettingsPage() {
    const supabase = await createClient();

    // 1. Auth check
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Načtení profilu
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
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
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .maybeSingle();

    return (
        <div className="space-y-8 py-10 max-w-4xl cs-container">
            {/* Hlavička */}
            <div className="flex justify-between items-center space-y-2">
                <div>
                    <h2 className="font-bold text-2xl tracking-tight">
                        Nastavení
                    </h2>
                    <p className="text-muted-foreground">
                        Spravuj svůj účet a preference.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" aria-label="link to dashboard">
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
                        avatar_url={user?.user_metadata.avatar_url || ""}
                        full_name={user?.user_metadata.full_name || ""}
                    />
                </div>
            </div>

            <Separator />

            {/* Záložky */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="relationship">Vztah</TabsTrigger>
                    <TabsTrigger value="appearance">Vzhled</TabsTrigger>
                    <TabsTrigger value="account">Účet</TabsTrigger>
                </TabsList>

                {/* Obsah - Profil */}
                <TabsContent
                    value="profile"
                    className="mt-6 p-6 border rounded-lg"
                >
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-lg">
                                Osobní údaje
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Toto uvidí tvůj partner.
                            </p>
                        </div>
                        <Separator />

                        <ProfileForm profile={profile} />
                    </div>
                </TabsContent>

                <TabsContent
                    value="relationship"
                    className="mt-6 p-6 border rounded-lg"
                >
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-lg">
                                Nastavení vztahu
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Společná data, která se zobrazují oběma.
                            </p>
                        </div>
                        <Separator />

                        {couple ? (
                            <>
                                <RelationshipForm
                                    coupleId={couple.id}
                                    initialDate={couple.relationship_start}
                                />
                            </>
                        ) : (
                            <div className="bg-yellow-500/20 p-4 border border-amber-400 rounded-md text-yellow-400 text-sm">
                                Zatím nemáš spárovaný účet s partnerem. Funkce
                                vztahu budou dostupné až po spárování.
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="appearance">
                    <div className="space-y-6 p-6 border rounded-lg">
                        <div>
                            <h3 className="font-medium text-lg">Vzhled</h3>
                            <p className="text-muted-foreground text-sm">
                                Přizpůsob si vzhled svého dashboardu.
                            </p>
                        </div>
                        <Separator />
                        <AppearanceForm />
                    </div>
                </TabsContent>
                <TabsContent value="account" className="space-y-6 mt-6">
                    {/* Sekce Email (jen pro čtení) */}
                    <div className="space-y-4 p-6 border rounded-lg">
                        <div>
                            <h3 className="font-medium text-lg">
                                Přihlašovací údaje
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Tvůj email pro přihlášení.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            {/* Email vytáhneš z user objektu nahoře v page.tsx */}
                            <Input
                                value={user.email}
                                disabled
                                className="bg-muted max-w-lg"
                            />
                        </div>
                    </div>

                    {/* Sekce Heslo */}
                    <div className="space-y-4 p-6 border rounded-lg">
                        <div>
                            <h3 className="font-medium text-lg">Změna hesla</h3>
                            <p className="text-muted-foreground text-sm">
                                Zvol si silné heslo pro ochranu svého účtu.
                            </p>
                        </div>

                        <PasswordForm />
                    </div>

                    <div className="space-y-4 p-6 border rounded-lg">
                        <PushNotificationManager />
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 dark:bg-red-950/10 p-6 border border-red-200 dark:border-red-900/50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-red-600 dark:text-red-400">
                                    Nebezpečná zóna
                                </h3>
                                <p className="text-red-600/80 dark:text-red-400/80 text-sm">
                                    Smazání účtu je nevratné.
                                </p>
                            </div>

                            <DeleteAccount />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
