// The homepage: a heading and the list of carwashes.

import { Suspense } from "react";
import CarwashList from "./components/CarwashList";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Carwash Finder
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Find a carwash near you and see what it offers.
      </p>

      <div className="mt-8">
        {/* Suspense shows the "Loading" text while the carwashes are being fetched */}
        <Suspense fallback={<p className="text-zinc-500">Loading carwashes…</p>}>
          <CarwashList />
        </Suspense>
      </div>
    </main>
  );
}
