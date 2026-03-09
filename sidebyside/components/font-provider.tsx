"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type FontFamily = "geist" | "inter" | "nunito" | "playfair";

const FontContext = createContext<{
    font: FontFamily;
    setFont: (f: FontFamily) => void;
}>({ font: "geist", setFont: () => {} });

export function FontProvider({
    children,
    initialFont,
}: {
    children: React.ReactNode;
    initialFont: FontFamily;
}) {
    const [font, setFontState] = useState<FontFamily>(initialFont);

    const setFont = (f: FontFamily) => {
    setFontState(f);
    document.documentElement.setAttribute("data-font", f);
      console.log("data-font set to:", f, document.documentElement.getAttribute("data-font"));
    };

    useEffect(() => {
        if (font !== "geist") { // geist = výchozí, nemusíme nastavovat
            document.documentElement.setAttribute("data-font", font);
        }
        console.log("FontProvider init:", font);
    }, [font]);

    return (
        <FontContext.Provider value={{ font, setFont }}>
            {children}
        </FontContext.Provider>
    );
}

export const useFont = () => useContext(FontContext);
