// Loads all carwashes (with their services) from Supabase
// and shows one card for each.
// This is a server component: it runs on the server, not in the browser.

import { supabase } from "@/lib/supabase";
import CarwashCard, { type Carwash } from "./CarwashCard";

export default async function CarwashList() {
  // Ask Supabase for every carwash, plus the services linked to it.
  // Carwashes are sorted by name, and each carwash's services by price.
  const { data, error } = await supabase
    .from("carwashes")
    .select("id, name, address, phone, services(id, name, price, duration_minutes)")
    .order("name")
    .order("price", { referencedTable: "services" });

  // Something went wrong (for example, no internet connection).
  if (error) {
    console.error("Could not load carwashes:", error.message);
    return (
      <p className="text-red-600">
        Sorry, we could not load the carwashes. Please try again later.
      </p>
    );
  }

  const carwashes = data as Carwash[];

  // The table is empty.
  if (carwashes.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">No carwashes found yet.</p>;
  }

  // One column on phones, two columns on bigger screens.
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {carwashes.map((carwash) => (
        <CarwashCard key={carwash.id} carwash={carwash} />
      ))}
    </div>
  );
}
