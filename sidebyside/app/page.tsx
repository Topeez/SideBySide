import Link from "next/link";
import { ReactNode } from "react";
import { Calendar, Share2, CheckCircle2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LandingPage() {
    return (
        <>
            <Header />
            <div className="flex flex-col bg-background min-h-screen">
                {" "}
                {/* Off-white pozadí */}
                <main className="flex-1">
                    {/* HERO SECTION */}
                    <section className="px-4 py-20 md:py-44 w-full text-center">
                        <div className="space-y-6 mx-auto max-w-3xl container">
                            <h1 className="font-extrabold text-stone-900 text-4xl sm:text-5xl md:text-6xl tracking-tight">
                                Konečně na{" "}
                                <span className="text-secondary">
                                    stejné vlně
                                </span>
                            </h1>
                            <p className="mx-auto max-w-175 text-stone-500 md:text-xl">
                                Plánujte rande, výlety a povinnosti společně.
                                Bez zmatků, bez &quot;já jsem ti to
                                říkal/a&quot;, a na jednom místě.
                            </p>
                            <div className="flex justify-center gap-4 pt-4">
                                <Link
                                    href="/register"
                                    className="bg-secondary hover:bg-[#d06b4e] shadow-lg px-8 py-3 rounded-full font-medium text-white text-lg transition-all hover:-translate-y-1"
                                >
                                    Vytvořit společný plán
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* FEATURES GRID */}
                    <section className="mx-auto px-4 py-16 max-w-5xl container">
                        <div className="gap-8 grid md:grid-cols-3">
                            <FeatureCard
                                icon={
                                    <Calendar className="w-10 h-10 text-primary" />
                                }
                                title="Společný kalendář"
                                desc="Propoj si svůj Google Calendar a vidíš, kdy má partner čas. Už žádné dvojité bookingy."
                            />
                            <FeatureCard
                                icon={
                                    <Share2 className="w-10 h-10 text-primary" />
                                }
                                title="Sdílené nápady"
                                desc="Všechny nápady na dárky, filmy a výlety na jednom místě. Přidej teď, rozhodněte se později."
                            />
                            <FeatureCard
                                icon={
                                    <CheckCircle2 className="w-10 h-10 text-primary" />
                                }
                                title="Žádné zapomínání"
                                desc="Notifikace na výročí a společné úkoly. Myšlení na detaily nech na nás."
                            />
                        </div>
                    </section>

                    {/* HOW IT WORKS (Zjednodušené) */}
                    <section className="bg-white py-16 border-stone-100 border-y">
                        <div className="mx-auto px-4 max-w-2xl text-center container">
                            <h2 className="mb-8 font-bold text-stone-800 text-2xl">
                                Jak to funguje?
                            </h2>
                            <div className="space-y-4 text-left md:text-center">
                                <Step
                                    number="1"
                                    text="Založíš si účet (stačí jeden z vás)."
                                />
                                <Step
                                    number="2"
                                    text="Pošleš zvací odkaz své polovičce."
                                />
                                <Step
                                    number="3"
                                    text="Propojíte kalendáře a začnete plánovat."
                                />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
}

function FeatureCard({
    icon,
    title,
    desc,
}: {
    icon: ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex flex-col items-center bg-white shadow-sm hover:shadow-md p-6 border border-stone-100 rounded-2xl text-center transition-shadow">
            <div className="bg-stone-50 mb-4 p-3 rounded-full">{icon}</div>
            <h3 className="mb-2 font-bold text-stone-800 text-xl">{title}</h3>
            <p className="text-stone-500">{desc}</p>
        </div>
    );
}

function Step({ number, text }: { number: string; text: string }) {
    return (
        <div className="flex md:justify-center items-center gap-4 p-2">
            <span className="flex justify-center items-center bg-[#E27D60]/20 rounded-full w-8 h-8 font-bold text-[#E27D60]">
                {number}
            </span>
            <span className="font-medium text-stone-700">{text}</span>
        </div>
    );
}
