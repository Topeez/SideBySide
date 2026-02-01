import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorProvider } from "@/components/theme-color-provider";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let initialTheme = "default";

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("theme")
            .eq("id", user.id)
            .single();

        if (profile?.theme) {
            initialTheme = profile.theme;
        }
    }

    return (
        <section>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <ThemeColorProvider initialTheme={initialTheme}>
                    {children}
                    <Toaster />
                </ThemeColorProvider>
            </ThemeProvider>
        </section>
    );
}
