"use client";

import { useEffect, useState } from "react";
import { IEventCreate } from "@/types";
import Skeleton from "@/components/ui/Skeleton";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { getAllEvents } from "@/services/EventServices";

export default function AdminManageEvents() {
  const [events, setEvents] = useState<IEventCreate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { events } = await getAllEvents({ cache: "no-store" });
      setEvents(events);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const deleteEvent = async (eventId: string) => {
    const confirm = await Swal.fire({
      title: "Delete Event?",
      text: "This will permanently delete the event.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${eventId}`, {
        method: "DELETE",
      });

      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete event");
    }
  };

  if (loading) return <Skeleton className="h-8 w-full m-4" />;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Manage Events</h1>
      {events.map((event) => (
        <div
          key={event.id}
          className="flex justify-between border p-3 rounded"
        >
          <div className="space-y-1">
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.startDate).toLocaleDateString()} -{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => deleteEvent(event.id!)}
            className="bg-red-500 text-white px-3 py-2 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}