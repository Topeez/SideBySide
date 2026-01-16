import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                {children}
                <Toaster />
            </ThemeProvider>
        </section>
    );
}
