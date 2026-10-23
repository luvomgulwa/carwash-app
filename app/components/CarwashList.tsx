// Loads all carwashes (with their services) from Supabase,
// then shows a map with their pins and one card for each carwash.
// This is a server component: it runs on the server, not in the browser.

import { connection } from "next/server";
import { supabase } from "@/lib/supabase";
import CarwashCard, { type Carwash } from "./CarwashCard";
import MapLoader from "./MapLoader";
import type { MapCarwash } from "./CarwashMap";

// A carwash plus its location. The location can be empty in the database.
type CarwashWithLocation = Carwash & {
  latitude: number | null;
  longitude: number | null;
};

export default async function CarwashList() {
  // Wait for a real visitor before loading data, so the list is always fresh.
  await connection();

  // Ask Supabase for every carwash, plus the services linked to it.
  // Carwashes are sorted by name, and each carwash's services by price.
  const { data, error } = await supabase
    .from("carwashes")
    .select(
      "id, name, address, phone, latitude, longitude, services(id, name, price, duration_minutes)"
    )
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

  const carwashes = data as CarwashWithLocation[];

  // The table is empty.
  if (carwashes.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">No carwashes found yet.</p>;
  }

  // Only carwashes with a saved location can be shown on the map.
  const carwashesOnMap = carwashes.filter(
    (carwash) => carwash.latitude !== null && carwash.longitude !== null
  ) as MapCarwash[];

  return (
    <div className="flex flex-col gap-6">
      {/* The map, above the cards */}
      {carwashesOnMap.length > 0 && <MapLoader carwashes={carwashesOnMap} />}

      {/* The cards: one column on phones, two columns on bigger screens */}
      <div className="grid gap-4 sm:grid-cols-2">
        {carwashes.map((carwash) => (
          <CarwashCard key={carwash.id} carwash={carwash} />
        ))}
      </div>
    </div>
  );
}
