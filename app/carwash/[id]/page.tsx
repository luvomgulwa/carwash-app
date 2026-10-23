// The detail page for one carwash, at /carwash/<id>.
// This is a server component: it loads the data on the server.

import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MapLoader from "@/app/components/MapLoader";
import type { Carwash } from "@/app/components/CarwashCard";

// A carwash with its services and its location.
type CarwashDetails = Carwash & {
  latitude: number | null;
  longitude: number | null;
};

export default async function CarwashPage({ params }: PageProps<"/carwash/[id]">) {
  // Read the id from the web address, for example /carwash/abc-123.
  const { id } = await params;

  // Ask Supabase for this one carwash and its services (cheapest first).
  const { data, error } = await supabase
    .from("carwashes")
    .select(
      "id, name, address, phone, latitude, longitude, services(id, name, price, duration_minutes)"
    )
    .eq("id", id)
    .order("price", { referencedTable: "services" })
    .maybeSingle(); // gives back one carwash, or null if none matches

  // "22P02" means the id isn't in the right format (for example /carwash/hello).
  if (error?.code === "22P02") {
    notFound();
  }

  // Any other problem (for example, no internet): show Next.js's error page.
  if (error) {
    throw new Error("Could not load the carwash: " + error.message);
  }

  // No carwash has this id: show Next.js's "not found" page.
  if (!data) {
    notFound();
  }

  const carwash = data as CarwashDetails;
  const hasLocation = carwash.latitude !== null && carwash.longitude !== null;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      {/* Link back to the homepage */}
      <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← All carwashes
      </Link>

      {/* Name, address and phone */}
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {carwash.name}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{carwash.address}</p>
      <a
        href={`tel:${carwash.phone}`}
        className="mt-2 inline-block font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        📞 {carwash.phone}
      </a>

      {/* A small map with one pin */}
      {hasLocation && (
        <div className="mt-6">
          <MapLoader
            carwashes={[
              {
                id: carwash.id,
                name: carwash.name,
                phone: carwash.phone,
                latitude: carwash.latitude as number,
                longitude: carwash.longitude as number,
              },
            ]}
            heightClass="h-48 sm:h-64"
          />
        </div>
      )}

      {/* The services, each with a "Book now" button */}
      <h2 className="mt-8 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Services</h2>

      {carwash.services.length === 0 ? (
        <p className="mt-2 text-zinc-500">No services listed yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {carwash.services.map((service) => (
            <li key={service.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{service.name}</p>
                <p className="text-sm text-zinc-500">{service.duration_minutes} min</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  R{service.price.toFixed(2)}
                </p>
                {/* The button doesn't do anything yet. Booking comes later. */}
                <button
                  type="button"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Book now
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
