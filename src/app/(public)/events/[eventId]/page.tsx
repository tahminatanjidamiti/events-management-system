import EventDetailsCard from "@/components/modules/Events/EventDetailsCard";
import { getAllEvents, getEventById } from "@/services/EventServices";
import { IEventCreate } from "@/types";

export const generateStaticParams = async () => {
  const { events } = await getAllEvents();

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

  return (
    <div className="py-30 px-4 max-w-7xl mx-auto">
      <EventDetailsCard event={event} />
    </div>
  );
};

export default EventDetailsPage;