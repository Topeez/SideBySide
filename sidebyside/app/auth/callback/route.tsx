import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const next = searchParams.get("next") ?? "/dashboard";

    if (token_hash && type) {
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as "email_change" | "signup" | "recovery",
        });

        if (!error) {
            if (type === "email_change") {
                return NextResponse.redirect(
                    `${origin}/dashboard/settings?tab=account&email_changed=true`
                );
            }
            return NextResponse.redirect(`${origin}${next}`);
        }

        return NextResponse.redirect(
            `${origin}/dashboard/settings?tab=account&error=invalid_token`
        );
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}/dashboard`);
        }
    }

    return NextResponse.redirect(`${origin}${next}`);
}
