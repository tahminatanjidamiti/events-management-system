import Link from "next/link";
import Image from "next/image";
import { IEventCreate } from "@/types";

export default function EventCard({ event }: { event: IEventCreate }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block group transform hover:-translate-y-1 transition-transform duration-300 h-full"
    >
      <div className="bg-linear-to-l from-gray-700 from-5% via-amber-400 to-gray-700 dark:bg-linear-to-l dark:from-gray-900 dark:from-5% dark:via-gray-950 dark:to-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-slate-700/70">

        {event.image ? (
          <div className="relative h-60 w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-56 w-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        <div className="p-6 flex flex-col grow">
          <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
            {event.title}
          </h3>

          <p className="mb-4 line-clamp-1 text-gray-200">
            {event.description}
          </p>

          <p>🧑‍💻 <span className="font-medium">Host:</span> {event?.host?.fullName}</p>
          <p>📌 <span className="font-medium">Type:</span> {event.eventType ?? "General"}</p>

          <p>
            📍 <span className="font-medium">Location:</span>{" "}
            {event.location?.formattedAddress}
          </p>

          <p>
            📅 <span className="font-medium">Date:</span>{" "}
            {new Date(event.startDate).toLocaleDateString()}
          </p>

          <p>
            👥 <span className="font-medium">Participants:</span>{" "}
            {event.minParticipants ?? 0} – {event.maxParticipants ?? "∞"}
          </p>

          <p>
            💰 <span className="font-medium">Fee:</span>{" "}
            {event.joiningFee && event.joiningFee > 0
              ? `৳${event.joiningFee}`
              : "Free"}
          </p>

          <p>
            🧾 <span className="font-medium">Status:</span>{" "}
            {event.status ?? "Active"}
          </p>
          {event?.host?.avgRating && (<p>⭐ <span className="font-medium">Host:</span> {event?.host?.avgRating}</p>)}
          {event?.host?.reviewCount && (<p>🔄️ <span className="font-medium">Host:</span> {event?.host?.reviewCount}</p>)}

          <div className="text-right mt-4">
            <span className="text-amber-500 hover:underline">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}