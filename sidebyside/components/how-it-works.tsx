import { UserPlus, Link2, Palette, CalendarHeart, Heart } from "lucide-react";

const steps = [
    {
        title: "Vytvořte si účet",
        description:
            "Zaregistrujte se během pár vteřin pomocí Google účtu. Vše je zdarma a bezpečné.",
        icon: UserPlus,
    },
    {
        title: "Pozvěte svou polovičku",
        description:
            "Získáte unikátní párovací kód. Pošlete ho partnerovi/partnerce a jakmile ho zadá, vaše světy se propojí.",
        icon: Link2,
    },
    {
        title: "Přizpůsobte si profil",
        description:
            "Nahrajte společnou fotku na pozadí, vyplňte detaily jako velikosti oblečení (pro dárky!) nebo jazyk lásky.",
        icon: Palette,
    },
    {
        title: "Nastavte výročí",
        description:
            "Zadejte datum začátku vztahu. Aplikace vypočítá váš společný 'Level' a začne odpočítávat dny do dalšího výročí.",
        icon: CalendarHeart,
    },
    {
        title: "Plánujte a sdílejte",
        description:
            "Začněte plnit společný kalendář, přidávat sny do Bucket Listu nebo si jen pošlete zamilovaný vzkaz přes Love Notes.",
        icon: Heart,
    },
];

export default function HowItWorks() {
    return (
        <div className="mx-auto px-6 py-12 md:py-24 max-w-2xl">
            <div className="mb-12 text-center">
                <h2 className="font-bold text-3xl md:text-4xl tracking-tight">
                    Jak začít se SideBySide?
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                    Pět jednoduchých kroků k lepší organizaci vašeho vztahu.
                </p>
            </div>

            <div className="relative ml-4 md:ml-0">
                {/* Timeline line */}
                <div className="left-4 md:left-8 absolute inset-y-0 border-primary/20 border-l-2" />

                {steps.map(({ title, description, icon: Icon }, index) => (
                    <div className="relative pb-12 last:pb-0 pl-16" key={index}>
                        {/* Timeline Icon */}
                        <div className="top-0 left-4 md:left-8 z-10 absolute flex justify-center items-center bg-primary shadow-sm border-4 border-background rounded-full size-10 md:size-12 text-primary-foreground -translate-x-1/2">
                            <Icon className="size-5 md:size-6 text-button-text" />
                        </div>

                        {/* Content */}
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center gap-3">
                                <span className="opacity-70 font-bold text-primary text-sm uppercase tracking-wider">
                                    Krok {index + 1}
                                </span>
                            </div>
                            <h3 className="font-bold text-foreground text-2xl tracking-tight">
                                {title}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
