import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    themeColor: "#E27D60",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: "SideBySide - Sdílený kalendář a plánování pro páry",
        template: "%s | SideBySide",
    },
    description:
        "Zjednodušte si společný život. SideBySide je aplikace pro páry, která nabízí sdílený kalendář, úkoly, nákupní seznamy a prostor pro vaše vzpomínky. Zaregistrujte se zdarma.",
    applicationName: "SideBySide",
    authors: [{ name: "Topeeez", url: "https://topeeez.cz" }],
    keywords: [
        "vztah",
        "pár",
        "plánování",
        "kalendář",
        "sdílené úkoly",
        "love note",
        "aplikace pro páry",
    ],
    metadataBase: new URL("https://side-by-side-nu.vercel.app"),

    openGraph: {
        type: "website",
        locale: "cs_CZ",
        url: "https://side-by-side-nu.vercel.app",
        title: "SideBySide - Sdílený kalendář, úkoly a plánování pro páry",
        description:
            "Zjednodušte si společný život. SideBySide je aplikace pro páry, která nabízí sdílený kalendář, úkoly, nákupní seznamy a prostor pro vaše vzpomínky. Zaregistrujte se zdarma.",
        siteName: "SideBySide",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "SideBySide Aplikace Náhled",
            },
        ],
    },

    // Twitter (X) Card
    twitter: {
        card: "summary_large_image",
        title: "SideBySide - Aplikace pro páry",
        description: "Plánujte společně, žijte lépe. Kalendář a úkoly pro dva.",
        images: ["/android-chrome-192x192.png"], // Stejný obrázek
    },

    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },

    // Pro roboty (Google)
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="cs" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
            >
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
