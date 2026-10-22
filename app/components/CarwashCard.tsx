// Shows one carwash as a card: name, address, phone and its services.

// The shape of one service, as it comes from the "services" table.
export type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

// The shape of one carwash, with its list of services attached.
export type Carwash = {
  id: string;
  name: string;
  address: string;
  phone: string;
  services: Service[];
};

export default function CarwashCard({ carwash }: { carwash: Carwash }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Name */}
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {carwash.name}
      </h2>

      {/* Address */}
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {carwash.address}
      </p>

      {/* Phone: on a phone, tapping it starts a call */}
      <a
        href={`tel:${carwash.phone}`}
        className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        📞 {carwash.phone}
      </a>

      {/* Services with prices */}
      <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Services
      </h3>

      {carwash.services.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">No services listed yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800">
          {carwash.services.map((service) => (
            <li key={service.id} className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="text-zinc-900 dark:text-zinc-100">{service.name}</p>
                <p className="text-xs text-zinc-500">{service.duration_minutes} min</p>
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                R{service.price.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
