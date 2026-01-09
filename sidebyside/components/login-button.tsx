"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return <Button onClick={handleLogin}>Log in with Google</Button>;
}
