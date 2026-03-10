import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    console.log("Auth callback params:", Object.fromEntries(searchParams));
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const next = searchParams.get("next") ?? "/dashboard";

    if (type === "email_change") {
        const supabase = await createClient();
        await supabase.auth.refreshSession(); 
        return NextResponse.redirect(
            `${origin}/dashboard/settings?tab=account&email_changed=true`
        );
    }

    if (token_hash && type) {
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as "signup" | "recovery",
        });
        if (!error) return NextResponse.redirect(`${origin}${next}`);
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
