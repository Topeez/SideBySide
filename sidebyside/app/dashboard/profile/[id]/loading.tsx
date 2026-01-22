import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

export default function ProfileLoading() {
    return (
        <div className="space-y-4 py-8 cs-container">
            <div className="flex md:flex-row flex-col justify-between items-center gap-4 mb-6">
                <div className="flex flex-col items-center md:items-start">
                    <Skeleton className="rounded-md w-32 h-8" />
                    <Skeleton className="mt-2 rounded-md w-72 h-6" />
                </div>

                <div className="flex gap-4">
                    <Skeleton className="rounded-full w-16 h-8" />
                    <Skeleton className="rounded-full md:w-32 md:h-8 size-8" />
                </div>
            </div>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(120px,auto)]">
                <Card className="flex flex-col justify-center items-center md:col-span-2 md:row-span-2 p-6 h-full">
                    <div className="flex flex-col justify-center items-center w-full">
                        <Skeleton className="mb-6 rounded-full size-32" />
                        <Skeleton className="mb-4 rounded-md w-3/4 h-6" />
                        <Skeleton className="mb-6 rounded-md w-1/2 h-5" />
                        <Skeleton className="rounded-md w-full h-5" />
                        <Skeleton className="mt-4 rounded-md w-full h-5" />
                    </div>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <Skeleton className="rounded-md w-1/3 h-4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="rounded-md w-18 h-5" />
                        <Skeleton className="rounded-md w-full h-5" />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 md:row-span-2 h-full">
                    <CardHeader>
                        <Skeleton className="rounded-md w-1/3 h-4" />
                    </CardHeader>
                    <CardContent className="gap-4 grid grid-cols-2">
                        <Skeleton className="rounded-md w-full h-16" />
                        <Skeleton className="rounded-md w-full h-16" />
                        <Skeleton className="rounded-md w-full h-16" />
                        <Skeleton className="rounded-md w-full h-16" />
                    </CardContent>
                </Card>

                <Card className="flex flex-col justify-center items-center md:col-span-1 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="rounded-md w-32 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="rounded-full w-8 h-8" />
                        <Skeleton className="rounded-md w-16 h-5" />
                    </div>
                </Card>

                <Card className="flex flex-col justify-center items-center md:col-span-1 p-4"></Card>
            </div>
        </div>
    );
}
