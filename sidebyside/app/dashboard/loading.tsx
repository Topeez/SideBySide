import { Skeleton } from "@/components/ui/skeleton";
import { PageSkeleton } from "@/components/page-skeleton";

export default function DashboardLoading() {
    return (
        <PageSkeleton
            titleWidth="w-48"
            subtitleWidth="w-64"
            cards={[
                // 1. Closest Event (Velká karta)
                {
                    colSpan: "md:col-span-8",
                    height: "h-full",
                    hasHeader: true,
                    hasFooter: true,
                    contentLines: 2,
                },
                // 2. Love Note
                {
                    colSpan: "md:col-span-4",
                    height: "h-full",
                    hasHeader: true,
                    customContent: (
                        <div className="flex flex-col justify-center items-start h-full">
                            <Skeleton className="w-52 h-6" />
                        </div>
                    ),
                },
                // 3. Todo List
                {
                    colSpan: "md:col-span-6 lg:col-span-4",
                    height: "h-full",
                    hasHeader: true,
                    contentLines: 4,
                    hasFooter: true,
                },
                // 4. Kalendář (Složitý custom content)
                {
                    colSpan: "md:col-span-6 lg:col-span-4",
                    height: "h-full",
                    customContent: (
                        <>
                            <div className="flex justify-between items-center mb-4 px-2 w-full">
                                <Skeleton className="rounded-md size-8" />
                                <Skeleton className="rounded-md w-32 h-6" />
                                <Skeleton className="rounded-md size-8" />
                            </div>

                            {/* Dny v týdnu */}
                            <div className="gap-4 grid grid-cols-7 mb-4 w-full">
                                {[...Array(7)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="opacity-50 rounded-sm w-full h-6"
                                    />
                                ))}
                            </div>

                            {/* Dny - Mřížka 7x5 */}
                            <div className="gap-4 grid grid-cols-7 w-full">
                                {[...Array(35)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-center items-center h-8"
                                    >
                                        <Skeleton className="rounded-md size-8" />
                                    </div>
                                ))}
                            </div>
                        </>
                    ),
                },
                // 5. My Dva (Profil)
                {
                    colSpan: "lg:col-span-4",
                    height: "h-full",
                    hasHeader: true,
                    hasFooter: true,
                    customContent: (
                        // Flex container pro zarovnání do řady (Row)
                        // pt-8 nebo mt-auto posune obsah vizuálně níž, aby to vypadalo jako na screenu
                        <div className="flex justify-between items-center pt-8">
                            {/* 1. Levý avatar (Topeez) */}
                            <div className="flex flex-col items-center gap-2">
                                <Skeleton className="border-2 border-background rounded-full w-14 h-14" />
                                {/* Prázdný div pro symetrii (aby byla čára uprostřed), nebo skeleton pro jméno, pokud tam bude */}
                                <div className="w-16 h-3" />
                            </div>

                            {/* 2. Prostředek - Čára a srdce */}
                            <div className="relative flex flex-1 justify-center items-center px-2 pb-5">
                                {/* pb-5 kompenzuje výšku textu u avatarů, aby byla čára v rovině s kruhy */}
                                <Skeleton className="w-full h-0.5" />
                                <Skeleton className="absolute border-4 border-card rounded-full w-6 h-6" />
                                {/* border-card udělá kolem srdíčka "výřez" v čáře */}
                            </div>

                            {/* 3. Pravý avatar (Linda) + Jméno */}
                            <div className="flex flex-col items-center gap-2">
                                <Skeleton className="border-2 border-background rounded-full w-14 h-14" />
                                <Skeleton className="rounded-md w-24 h-3" />{" "}
                                {/* Jméno Linda Baráková */}
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
}
