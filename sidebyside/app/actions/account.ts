"use server";

import { createClient } from "@supabase/supabase-js"; // Pozor: Importujeme přímo JS knihovnu pro admina
import { createClient as createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ActionResult } from "@/types/actions";

export async function deleteAccount(): Promise<ActionResult> {
  const supabase = await createServerClient();
  
  // 1. Získáme aktuálního uživatele (ověření, že je přihlášen)
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: "Uživatel není přihlášen." };
  }

  // 2. Inicializace Admin klienta (SERVICE_ROLE_KEY)
  // Tento klíč MUSÍ být v .env.local jako SUPABASE_SERVICE_ROLE_KEY
  // NIKDY ho nevystavuj na klienta!
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 3. Smazání uživatele z Auth tabulky
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id
  );

  if (deleteError) {
    console.error("Chyba při mazání účtu:", deleteError);
    return { success: false, error: "Nepodařilo se smazat účet." };
  }

  // 4. Odhlášení ze session (pro jistotu)
  await supabase.auth.signOut();

  // 5. Přesměrování (musí být mimo try/catch nebo až na konci)
  redirect("/login?deleted=true");
  return { success: true };
}
