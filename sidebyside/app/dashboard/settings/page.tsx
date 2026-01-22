import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile/profile-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordForm } from "@/components/settings/password-form";
import { Button } from "@/components/ui/button";
import { DeleteAccount } from "@/components/settings/delete-account";
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

    // Pokud profil neexistuje (divné, ale možné), můžeme zobrazit prázdný formulář nebo error
    if (!profile) return <div>Profil nenalezen.</div>;

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
            </div>

            <Separator />

            {/* Záložky */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-4 w-full lg:w-100">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="appearance">Vzhled</TabsTrigger>
                    <TabsTrigger value="notifications" disabled>
                        Notifikace
                    </TabsTrigger>
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

                        {/* Tady to jen vykreslíš */}
                        {/* Pozor: Zkontroluj, jestli DB vrací 'full_name', ale komponenta čeká 'fullname' */}
                        <ProfileForm profile={profile} />
                    </div>
                </TabsContent>

                <TabsContent value="appearance">
                    <div className="py-6 text-muted-foreground text-center">
                        Zatím prázdno... (Připravíme později)
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

                            {/* Tady vložíme komponentu */}
                            <DeleteAccount />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
