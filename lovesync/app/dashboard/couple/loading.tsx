import { Skeleton } from "@/components/ui/skeleton";

export default function CoupleLoading() {
    return (
        <div className="gap-4 py-4 cs-container">
            <div className="flex justify-between items-center mb-4 w-full">
                <Skeleton className="rounded-md w-48 h-8" />
                <div className="flex items-center gap-2">
                    <Skeleton className="rounded-3xl w-16 h-8" />
                    <Skeleton className="rounded-full size-8" />
                </div>
            </div>
            <Skeleton className="rounded-3xl w-full h-80" />
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-12 mt-12">
                <Skeleton className="lg:col-span-5 rounded-3xl h-40" />
                <Skeleton className="lg:col-span-7 rounded-3xl h-40" />
            </div>
        </div>
    );
}
