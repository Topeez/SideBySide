"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex items-center bg-background px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 min-h-screen">
            <div className="space-y-6 w-full text-center">
                <div className="space-y-3">
                    <h2
                        aria-label="Chyba 404"
                        className="font-bold text-secondary text-4xl sm:text-7xl tracking-wide"
                    >
                        404
                    </h2>
                    <p className="text-primary text-xl">
                        Nemohli jsme najít stránku, kterou jsi hledal...
                    </p>
                </div>
                <div className="flex justify-center items-center gap-8">
                    <Button
                        aria-label="Přejít na domovskou stránku"
                        onClick={() => router.push("/")}
                        className="bg-background hover:bg-primary hover:shadow-xl px-8 py-6 border border-primary rounded-4xl font-bold text-foreground hover:text-background text-xl transition-all duration-300 cursor-pointer"
                    >
                        Domů
                    </Button>
                    <Button
                        aria-label="Přejít zpět"
                        onClick={() => router.back()}
                        className="bg-background hover:bg-primary hover:shadow-xl px-8 py-6 border border-primary rounded-4xl font-bold text-foreground hover:text-background text-xl transition-all duration-300 cursor-pointer"
                    >
                        Jít zpět
                    </Button>
                </div>
            </div>
        </div>
    );
}
