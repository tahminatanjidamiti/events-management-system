import { getAllEvents } from "@/services/EventServices";
import { IEventCreate } from "@/types";
import Link from "next/link";
import EventCard from "../Events/EventCard";


export default async function FeaturedEvents() {
    const { events } = await getAllEvents({
        next: { tags: ["EVENTS"] },
    });
    return (
        <div>
            <h2 className="text-center my-10 text-4xl">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-1 gap-3 max-w-6xl mx-auto my-5 items-stretch">
                {events.slice(0, 3).map((event: IEventCreate) => (<EventCard key={event?.id} event={event} />))}
            </div>
          <div className="my-5 flex flex-col items-center justify-center sm:flex-row gap-4">
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-4 font-medium rounded-xl border border-amber-500 bg-linear-to-r from-gray-700 from-5% via-amber-500 to-gray-700 hover:text-white dark:hover:text-black transition"
            >
              Explore Events
            </Link>
          </div>
        </div>
    )
}
