"use client";
// Loads the map only in the browser.
// Leaflet doesn't work on the server, so we tell Next.js to skip it there (ssr: false).

import dynamic from "next/dynamic";
import type { MapCarwash } from "./CarwashMap";

const CarwashMap = dynamic(() => import("./CarwashMap"), {
  ssr: false,
  // A grey box the same size as the map, shown while the map loads.
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-zinc-200 text-zinc-500 sm:h-96 dark:bg-zinc-800">
      Loading map…
    </div>
  ),
});

export default function MapLoader({ carwashes }: { carwashes: MapCarwash[] }) {
  return <CarwashMap carwashes={carwashes} />;
}
