"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface UseKeyboardNavigationProps {
    userId?: string;
}

export function useKeyboardNavigation({ userId }: UseKeyboardNavigationProps) {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleKeyDown = async (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            if (!e.altKey) return;

            switch (e.code) {
                case "KeyP":
                    if (userId) {
                        e.preventDefault();
                        router.push(`/dashboard/profile/${userId}`);
                    }
                    break;
                case "KeyS":
                    e.preventDefault();
                    router.push("/dashboard/settings");
                    break;
                case "KeyC":
                    e.preventDefault();
                    router.push("/dashboard/couple");
                    break;
                case "KeyQ":
                    e.preventDefault();
                    await supabase.auth.signOut();
                    router.push("/");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router, userId]);
}
