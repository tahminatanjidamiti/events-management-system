"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IEventCreate } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEventById } from "@/services/EventServices";
import { toast } from "sonner";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<IEventCreate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await getEventById(id as string);

        if (!res?.data) throw new Error("Event not found");

        setEvent(res.data as IEventCreate);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading event...</p>;
  }

  if (!event) {
    return <p className="text-center mt-10">Event not found</p>;
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="shadow-md">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-semibold">{event.title}</h1>

          <p className="text-sm text-gray-600">
            Type: {event.eventType || "N/A"}
          </p>

          <p>{event.description}</p>

          <p className="text-sm">
            Location: {event.location.formattedAddress}
          </p>

          <p className="text-sm">
            Fee: {event.joiningFee ? `৳${event.joiningFee}` : "Free"}
          </p>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => router.push(`/events/edit/${id}`)}>
              Edit Event
            </Button>
            <Button variant="outline">Join Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}