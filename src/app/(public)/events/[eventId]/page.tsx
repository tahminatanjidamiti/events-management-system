import EventDetailsCard from "@/components/modules/Events/EventDetailsCard";
import { getEventById } from "@/services/EventServices";
import { IEventCreate } from "@/types";


export const generateStaticParams = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event`);
  const { data: events } = await res.json();

  return events.slice(0, 9).map((event: IEventCreate) => ({
    eventId: String(event.id),
  }));
};
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) => {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  return {
    title: event?.title,
    description: event?.description,
  };
};

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) => {
  const { eventId } = await params;
  const event = await getEventById(eventId);
   if (!event) return <div>Event not found</div>;

  return (
    <div className="py-30 px-4 max-w-7xl mx-auto">
      <EventDetailsCard event={event} />
    </div>
  );
};

export default EventDetailsPage;