import { useEffect, useState } from "react";
import { IEventCreate } from "@/types";
import Skeleton from "@/components/ui/Skeleton";
import { getMyEvents } from "@/services/EventServices";

export default function HostMyEvents() {
  const [events, setEvents] = useState<IEventCreate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEvents()
      .then((res) => {
        setEvents(res.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-8 w-full m-4" />;

  if (!events.length)
    return <p className="text-center">You have no events yet.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Events</h1>
      {events.map((event) => (
        <div key={event.id} className="border p-3 rounded">
          {event.title}
        </div>
      ))}
    </div>
  );
}