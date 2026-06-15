/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IEventCreate } from "@/types";
import { toast } from "sonner";
import { updateEvent } from "@/actions/event";
import EventForm from "@/components/modules/Forms/EventForm";
import { getEventById } from "@/services/EventServices";
import Skeleton from "@/components/ui/Skeleton";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<IEventCreate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const eventRes = await getEventById(id);
        const eventData = eventRes as IEventCreate;

        if (!eventData) throw new Error("No event data returned");
        setEvent(eventData);
      } catch (error: any) {
        toast.error(error.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateEvent = async (formData: FormData) => {
    try {
      if (!id) return;
      setSubmitting(true);
      await updateEvent(id, formData);
      toast.success("Event updated successfully!");
      router.push("/host/events");
    } catch (error: any) {
      toast.error(error.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return
  <div className="w-8/12 mx-auto mt-10 space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
  </div>;
  if (!event) return <p className="text-center mt-10">Event not found</p>;

  return (
    <div className="container mx-auto p-1 md:p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Event</h1>
      <EventForm
        event={event}
        onSubmit={handleUpdateEvent}
        submitting={submitting}
      />
    </div>
  );
}