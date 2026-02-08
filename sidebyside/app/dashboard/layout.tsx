import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorProvider } from "@/components/theme-color-provider";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/server";
import { DashboardLayoutProvider } from "@/components/layout-provider";
import { isValidLayout, DashboardLayoutType } from "../actions/profile";

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
    let initialLayout: DashboardLayoutType = "default";

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("theme, dashboard_layout")
            .eq("id", user.id)
            .single();

        if (profile) {
            if (profile.theme) initialTheme = profile.theme;
            if (await isValidLayout(profile.dashboard_layout)) {
                initialLayout = profile.dashboard_layout;
            }
        }
    }

    return (
        <section>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <ThemeColorProvider initialTheme={initialTheme}>
                    <Toaster />
                    <DashboardLayoutProvider initialLayout={initialLayout}>
                        {children}
                    </DashboardLayoutProvider>
                </ThemeColorProvider>
            </ThemeProvider>
        </section>
    );
}
