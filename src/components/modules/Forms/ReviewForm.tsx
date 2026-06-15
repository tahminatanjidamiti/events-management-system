/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { submitReview, getSavedEvents } from "@/actions/social";
import { IReviewPayload } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type SavedEventOption = {
  id: string;
  title: string;
};

// ✅ no props at all — self-fetches saved events
export default function ReviewForm() {
  const [savedEventOptions, setSavedEventOptions] = useState<SavedEventOption[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventId, setEventId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  getSavedEvents()
    .then((res) => {
      // ✅ res.data is now always the array
      const options: SavedEventOption[] = res.data.map((se: any) => ({
        id: se.event?.id ?? se.eventId,
        title: se.event?.title ?? "Untitled Event",
      }));
      setSavedEventOptions(options);
    })
    .catch(() => toast.error("Failed to load your saved events"))
    .finally(() => setLoadingEvents(false));
}, []);

  const submit = async () => {
    if (!eventId) return toast.error("Please select an event");
    if (rating < 1 || rating > 5) return toast.error("Rating must be between 1 and 5");

    const payload: IReviewPayload = {
      eventId,
      rating,
      comment: comment.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await submitReview(payload);
      toast.success("Review submitted!");
      setEventId("");
      setRating(5);
      setComment("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 max-w-md">
      <select
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        disabled={loadingEvents}
        className="border p-4 rounded w-full disabled:opacity-50"
      >
        <option value="">
          {loadingEvents ? "Loading your events..." : "Select a saved event"}
        </option>
        {savedEventOptions.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>

      {!loadingEvents && savedEventOptions.length === 0 && (
        <p className="text-sm text-gray-500">
          You have no saved events to review yet.
        </p>
      )}

      <div className="space-y-1">
        <label className="text-sm text-gray-600">
          Rating: <span className="font-semibold">{rating} / 5</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-2xl select-none ${star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment..."
        rows={3}
        className="border p-2 rounded w-full resize-none"
      />

      <button
        onClick={submit}
        disabled={submitting || loadingEvents}
        className="px-4 py-2 bg-yellow-700 text-white border-2 rounded
                   hover:bg-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors w-full"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}