import { Heart } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="top-0 right-0 left-0 z-999 fixed shadow-sm">
            <nav className="flex justify-between items-center py-4 w-full cs-container">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-stone-800 text-xl"
                >
                    <Heart
                        className="w-6 h-6 text-secondary"
                        fill="currentColor"
                    />{" "}
                    SideBySide
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="font-medium text-stone-600 hover:text-stone-900 text-sm"
                    >
                        Přihlásit
                    </Link>
                    <Link
                        href="/register"
                        className="bg-[#8FBC8F] hover:bg-[#7da87d] px-4 py-2 rounded-full font-medium text-white text-sm transition-colors"
                    >
                        Začít zdarma
                    </Link>
                </div>
            </nav>
        </header>
    );
}
