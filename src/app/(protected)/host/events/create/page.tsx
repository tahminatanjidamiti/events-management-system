/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { toast } from "sonner";
import EventForm from "@/components/modules/Forms/EventForm";
import { createEvent } from "@/actions/event";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleCreateEvent = async (formData: FormData) => {
    try {
      setSubmitting(true);
      await createEvent(formData);
      toast.success("Event created successfully!");
      router.push("/host/my-events");
    } catch (error: any) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-1 md:p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-4">Create Event</h1>
      <EventForm onSubmit={handleCreateEvent} submitting={submitting} />
    </div>
  );
}