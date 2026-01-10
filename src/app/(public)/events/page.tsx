import EventCard from "@/components/modules/Events/EventCard";
import { getAllEvents } from "@/services/EventServices";
import { IEventCreate } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Events | Events Platform",
  description: "Browse all upcoming events and experiences.",
};

export default async function AllEventsPage() {
  const { events } = await getAllEvents({
    cache: "no-store",
  });

  return (
    <div>
      <h2 className="pt-6 text-center my-5 text-4xl">
        All Events
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto my-5 items-stretch">
        {events.map((event: IEventCreate) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}