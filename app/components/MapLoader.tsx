"use client";
// Loads the map only in the browser.
// Leaflet doesn't work on the server, so we tell Next.js to skip it there (ssr: false).

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { MapCarwash } from "./CarwashMap";

// A grey box that fills the map's space while the map isn't ready.
function MapPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-zinc-200 text-zinc-500 dark:bg-zinc-800">
      Loading map…
    </div>
  );
}

const CarwashMap = dynamic(() => import("./CarwashMap"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

export default function MapLoader({
  carwashes,
  heightClass = "h-72 sm:h-96", // how tall the map is (Tailwind classes)
}: {
  carwashes: MapCarwash[];
  heightClass?: string;
}) {
  // Next.js keeps the page you just left hidden in the background, so going
  // back is instant. When a page is hidden, react-leaflet destroys its map, and
  // showing that same map again crashes. So we remove the map while its page
  // is hidden, and build a fresh one each time the page is shown.
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    // ESLint usually warns about this, but here it's on purpose:
    // this effect is how we find out the page has appeared.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsShown(true); // the page is on screen: show the map
    return () => setIsShown(false); // the page was hidden or closed: remove the map
  }, []);

  return (
    <div className={heightClass}>
      {isShown ? <CarwashMap carwashes={carwashes} /> : <MapPlaceholder />}
    </div>
  );
}
