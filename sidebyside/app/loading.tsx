import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center w-full h-[calc(100vh-4rem)]">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">Načítám...</p>
            </div>
        </div>
    );
}
