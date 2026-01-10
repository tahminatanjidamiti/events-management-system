"use client";

import { submitReview } from "@/actions/social";
import { IReviewPayload } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export default function ReviewForm({
  events,
}: {
  events: { id: string; title: string }[];
}) {
  const [eventId, setEventId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    if (!eventId) return toast.error("Select event");

    const payload: IReviewPayload = {
      eventId,
      rating,
      comment: comment || undefined,
    };

    try {
      await submitReview(payload);
      toast.success("Review submitted");
      setComment("");
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="space-y-3 max-w-md">
      <select
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select event</option>
        {events.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded w-full"
      />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment"
        className="border p-2 rounded w-full"
      />

      <button
        onClick={submit}
        className="px-4 py-2 bg-yellow-700 text-white hover:text:black border-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
}