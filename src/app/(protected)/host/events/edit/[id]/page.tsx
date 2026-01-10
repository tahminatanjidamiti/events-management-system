/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getHostById } from "@/services/HostServices";
import { IEventCreate, IHostCreate } from "@/types";
import { toast } from "sonner";
import { updateEvent } from "@/actions/event";
import EventForm from "@/components/modules/Forms/EventForm";
import { getEventById } from "@/services/EventServices";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<IEventCreate | null>(null);
  const [hosts, setHosts] = useState<IHostCreate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const eventRes = await getEventById(id);
        const eventData = eventRes.data as IEventCreate;

        setEvent(eventData);
        const host = await getHostById(eventData.hostId);
        setHosts([host]); 
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

      const data = JSON.parse(formData.get("data") as string);
      const file = formData.get("file") as File | null;

      await updateEvent(id, data, file || undefined);

      toast.success("Event updated successfully!");
      router.push("/events");
    } catch (error: any) {
      toast.error(error.message || "Failed to update event");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading event...</p>;
  if (!event) return <p className="text-center mt-10">Event not found</p>;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Event</h1>

      <EventForm
        event={event}
        hosts={hosts}
        onSubmit={handleUpdateEvent}
      />
    </div>
  );
}