export default function PrivacyPolicy() {
    return (
        <div className="mx-auto px-4 py-12 max-w-3xl text-foreground container">
            <h1 className="mb-6 font-bold text-3xl">
                Zásady ochrany osobních údajů (Privacy Policy)
            </h1>
            <p className="mb-4 text-muted-foreground">
                Poslední aktualizace: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-6">
                <section>
                    <h2 className="mb-2 font-semibold text-xl">1. Úvod</h2>
                    <p>
                        Aplikace <strong>SideBySide</strong> (dále jen
                        &quot;Aplikace) je vyvíjena jako studentský/osobní
                        projekt. Respektujeme vaše soukromí a zavazujeme se
                        chránit veškeré osobní údaje, které s námi sdílíte.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        2. Jaké údaje shromažďujeme
                    </h2>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>
                            <strong>Google Účet:</strong> Při přihlášení přes
                            Google získáváme váš e-mail, jméno a profilovou
                            fotku (avatar).
                        </li>
                        <li>
                            <strong>Uživatelský obsah:</strong> Data, která do
                            aplikace sami vložíte (datum začátku vztahu,
                            společné fotografie, poznámky &quot;Love
                            Notes&quot;, události v kalendáři).
                        </li>
                        <li>
                            <strong>Technická data:</strong> Cookies nezbytné
                            pro udržení přihlášení (session).
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        3. Jak údaje využíváme
                    </h2>
                    <p>
                        Vaše údaje používáme výhradně pro zajištění funkčnosti
                        aplikace:
                    </p>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>
                            K vytvoření a správě vašeho uživatelského profilu.
                        </li>
                        <li>K propojení s vaším partnerem v rámci aplikace.</li>
                        <li>
                            K ukládání vašich vzpomínek a plánování v kalendáři.
                        </li>
                        <li>
                            <strong>
                                Nikdy neprodáváme vaše data třetím stranám ani
                                je nevyužíváme k marketingu.
                            </strong>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        4. Služby třetích stran
                    </h2>
                    <p>
                        Pro provoz aplikace využíváme ověřené služby třetích
                        stran:
                    </p>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>
                            <strong>Supabase:</strong> Poskytovatel databáze a
                            autentizace. Data jsou uložena na jejich
                            zabezpečených serverech.
                        </li>
                        <li>
                            <strong>Google OAuth:</strong> Pro bezpečné
                            přihlášení.
                        </li>
                        <li>
                            <strong>Vercel:</strong> Pro hosting webové
                            aplikace.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">
                        5. Práva uživatele
                    </h2>
                    <p>Máte právo kdykoliv požádat o:</p>
                    <ul className="space-y-1 pl-5 list-disc">
                        <li>Výpis všech údajů, které o vás evidujeme.</li>
                        <li>
                            Úplné smazání vašeho účtu a všech souvisejících dat
                            (fotky, poznámky).
                        </li>
                    </ul>
                    <p className="mt-2">
                        Pro smazání účtu nás kontaktujte na níže uvedeném emailu
                        nebo využijte funkci v nastavení profilu (pokud je
                        dostupná).
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 font-semibold text-xl">6. Kontakt</h2>
                    <p>
                        Pokud máte jakékoliv dotazy ohledně ochrany soukromí,
                        kontaktujte vývojáře na emailu: <br />
                        <a
                            href="mailto:tvuj-email@example.com"
                            className="text-primary hover:underline"
                        >
                            tvuj-email@example.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
