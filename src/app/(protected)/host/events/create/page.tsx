/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import EventForm from "@/components/modules/Forms/EventForm";
import { createEvent } from "@/actions/event";
import { IHostCreate } from "@/types";


export default function CreateEventPage() {
  const [hosts, setHosts] = useState<IHostCreate[]>([]);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/host`);
        const json = await res.json();

        if (!res.ok || !json.success) throw new Error(json.message);

        setHosts(json.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load hosts");
      }
    };

    fetchHosts();
  }, []);

  const handleCreateEvent = async (formData: FormData) => {
    try {
      const data = JSON.parse(formData.get("data") as string);
      const file = formData.get("file") as File | null;

      await createEvent(data, file || undefined);

      toast.success("Event created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create event");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Create Event</h1>

      <EventForm hosts={hosts} onSubmit={handleCreateEvent} />
    </div>
  );
}
