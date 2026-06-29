"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function EmailChangeNotice() {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes("Confirmation+link+accepted")) {
            toast.info("Zkontroluj také svůj starý email a potvrď změnu tam.", {
                duration: 8000,
                description: "Supabase vyžaduje potvrzení z obou emailových adres.",
            });
            window.history.replaceState(null, "", window.location.pathname);
        }
    }, []);

    return null;
}