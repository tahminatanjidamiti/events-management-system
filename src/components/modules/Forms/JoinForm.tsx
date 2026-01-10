"use client";

import { useState } from "react";
import { IEventCreate } from "@/types";
import { joinEvent } from "@/services/event.service";
import { createPaymentSession } from "@/services/payment.service";
import { toast } from "sonner";

type JoinFormProps = {
  event: IEventCreate;
};

export default function JoinForm({ event }: JoinFormProps) {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);

    try {
      if (!event.joiningFee || event.joiningFee <= 0) {
        // Free event → just join
        await joinEvent(event.id!);
        toast.success("You have successfully joined the event!");
      } else {
        // Paid event → create Stripe session
        const session = await createPaymentSession(event.id!);
        if (session.url) {
          window.location.href = session.url; // redirect to Stripe checkout
        } else {
          throw new Error("Stripe session not created");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to join event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>
      <p className="text-gray-600 mb-6">{event.description}</p>
      <p className="mb-4">
        <strong>Date:</strong>{" "}
        {new Date(event.startDate).toLocaleDateString()} -{" "}
        {new Date(event.endDate).toLocaleDateString()}
      </p>
      <p className="mb-6">
        <strong>Fee:</strong>{" "}
        {event.joiningFee ? `৳${event.joiningFee}` : "Free"}
      </p>
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600 disabled:opacity-50"
      >
        {loading ? "Processing..." : "JOIN HERE"}
      </button>
    </div>
  );
}