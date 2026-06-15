"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IEventCreate } from "@/types";
import { deleteEvent, getMyEvents } from "@/actions/event";
import Skeleton from "@/components/ui/Skeleton";
import { Delete, Edit, View } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function EventsPage() {
  const [events, setEvents] = useState<IEventCreate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEvents()
      .then((res) => {
        const arr = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setEvents(arr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const eventDelete = async (eventId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This event will be permanently deleted!",
      icon: "warning",
      background: "#0f172a",
      color: "#f8fafc",
      showCancelButton: true,
      confirmButtonColor: "#b45309",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, delete",
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      try {
        const result = await deleteEvent(eventId);
        if (!result.success) throw new Error(result.message);
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        toast.success("Event deleted successfully");
      } catch {
        toast.error("Failed to delete event");
      }
    });
  };

  if (loading) return <div className="w-8/12 mx-auto mt-10 space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
  </div>;

  return (
    <div className="container mx-auto p-1 md:p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">My Events</h1>
        <Link
          href="/host/events/create"
          className="p-1 md:px-3 md:py-2 text-sm font-medium border border-amber-500 bg-linear-to-b from-gray-700 from-5% via-amber-500 to-gray-700 hover:text-white dark:hover:text-black transition text-center"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No events found.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-1 md:px-4 md:py-3 font-semibold">#</th>
                <th className="p-1 md:px-4 md:py-3 font-semibold">Title</th>
                <th className="p-1 md:px-4 md:py-3 font-semibold">Type</th>
                <th className="hidden md:table-cell px-4 py-3 font-semibold">Location</th>
                <th className="p-1 md:px-4 md:py-3 font-semibold">Fee</th>
                <th className="p-1 md:px-4 md:py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr
                  key={(event as IEventCreate).id ?? idx}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-1 md:px-4 md:py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="p-1 md:px-4 md:py-3 font-medium">{event.title}</td>
                  <td className="p-1 md:px-4 md:py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-muted text-muted-foreground">
                      {event.eventType || "N/A"}
                    </span>
                  </td>
                  <td className="hidden md:table-cell md:px-4 md:py-3 text-muted-foreground text-xs">
                    {event.location?.formattedAddress || "N/A"}
                  </td>
                  <td className="p-1 md:px-4 md:py-3 text-sm font-medium">
                    {event.joiningFee ? `৳${event.joiningFee}` : (
                      <span className="text-green-600 font-semibold">Free</span>
                    )}
                  </td>
                  <td className="p-1 md:px-4 md:py-3 flex flex-col space-y-1">
                    <Link
                      href={`/host/events/${(event as IEventCreate).id}`}
                      className=" text-green-700 items-center justify-center text-center mx-auto p-1 md:px-3 md:py-1.5 text-xs font-medium rounded-md border border-yellow-800 hover:bg-green-900/30 transition"
                    >
                      <View />
                    </Link>
                    <Link
                      href={`/host/events/edit/${(event as IEventCreate).id}`}
                      className="text-blue-500 items-center justify-center text-center mx-auto p-1 md:px-3 md:py-1.5 text-xs font-medium rounded-md border border-yellow-800 hover:bg-blue-900/30 transition"
                    >
                      <Edit />
                    </Link>
                    <button
                      onClick={() => eventDelete((event as IEventCreate).id!)}
                      className="text-yellow-500 items-center justify-center text-center mx-auto p-1 md:px-3 md:py-1.5 text-xs font-medium rounded-md border border-yellow-800 hover:bg-yellow-900/30 transition"
                    >
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}