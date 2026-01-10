"use client";

import { ISaveEventPayload } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export default function SaveEventForm({
  events,
}: {
  events: { id: string; title: string }[];
}) {
  const [eventId, setEventId] = useState("");

  const submit = async () => {
    if (!eventId) return toast.error("Select an event");

    const payload: ISaveEventPayload = { eventId };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("Event saved");
    } catch {
      toast.error("Failed to save event");
    }
  };

  return (
    <div className="flex gap-3">
      <select
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select event</option>
        {events.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>

      <button
        onClick={submit}
        className="px-4 py-2 border-2 bg-yellow-700 text-white hover:text:black rounded"
      >
        Save
      </button>
    </div>
  );
}