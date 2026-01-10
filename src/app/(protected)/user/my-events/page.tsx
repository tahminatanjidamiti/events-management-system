import { useEffect, useState } from "react";
import { IEventCreate } from "@/types";
import Skeleton from "@/components/ui/Skeleton";
import { getMyEvents } from "@/services/EventServices";

export default function UserMyEvents() {
  const [events, setEvents] = useState<IEventCreate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEvents()
      .then((res) => setEvents(res.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-8 w-full m-4" />;
  if (!events.length)
    return <p className="text-center">You have not joined any events.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Joined Events</h1>
      {events.map((e) => (
        <div key={e.id} className="border p-3 rounded">
          {e.title}
        </div>
      ))}
    </div>
  );
}