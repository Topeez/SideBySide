"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginButton({ nextUrl }: { nextUrl?: string }) {
    const supabase = createClient();

    const handleLogin = async () => {
        const callbackUrl = `${window.location}/auth/callback${
            nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""
        }`;

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: callbackUrl,
            },
        });
    };

    return (
        <Button onClick={handleLogin} className="bg-stone-900 text-white">
            Přihlásit se přes Google
        </Button>
    );
}
