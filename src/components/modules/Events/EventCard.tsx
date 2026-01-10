import Link from "next/link";
import Image from "next/image";
import { IEventCreate } from "@/types";

export default function EventCard({ event }: { event: IEventCreate }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block group transform hover:-translate-y-1 transition-transform duration-300 h-full"
    >
      <div className="bg-linear-to-l from-gray-600 from-5% via-grey-400 to-gray-800 dark:bg-linear-to-l dark:from-gray-800 dark:from-5% dark:via-gray-950 dark:to-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-slate-700/70">

        {event.image ? (
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-fill group-hover:scale-105 transition-transform duration-300"
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

          <p className="mb-4 line-clamp-3 text-gray-200">
            {event.description}
          </p>

          <div className="flex items-center justify-between mt-auto text-sm text-gray-300">
            <span>
              {new Date(event.startDate).toLocaleDateString()}
            </span>
            <span>
              {event.joiningFee ? `৳${event.joiningFee}` : "Free"}
            </span>
          </div>

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