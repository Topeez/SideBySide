"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ToastNotifier({
    message,
    type = "error",
}: {
    message: string;
    type?: "error" | "success";
}) {
    useEffect(() => {
        if (type === "error") toast.error(message);
        else toast.success(message);
    }, [message, type]);

    return null;
}
