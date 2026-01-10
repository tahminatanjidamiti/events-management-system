"use client";

import Image from "next/image";
import { IEventCreate } from "@/types";
import { useState } from "react";
import { joinEvent } from "@/services/event.service";
import { createPaymentSession } from "@/services/payment.service";
import { toast } from "sonner";

export default function EventDetailsCard({ event }: { event: IEventCreate }) {
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <div className="py-20 text-center text-gray-500">
        Event not found.
      </div>
    );
  }

  const handleJoin = async () => {
    setLoading(true);

    try {
      if (!event.joiningFee || event.joiningFee <= 0) {
       
        await joinEvent(event.id!);
        toast.success("You have successfully joined the event!");
      } else {
        
        const session = await createPaymentSession(event.id!);
        if (session.url) {
          window.location.href = session.url; 
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
    <main className="relative max-w-4xl mx-auto py-6 px-4 bg-[url('https://i.ibb.co.com/PswVd4JW/digital-techno-background-with-connecting-lines-dots.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-white">
        <h1 className="text-5xl font-bold mb-6">{event.title}</h1>

        <div className="mb-6 text-gray-200">
          <p>
            📅 {new Date(event.startDate).toLocaleDateString()} –{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
          <p>📍 {event.location?.formattedAddress}</p>
          <p>💰 {event.joiningFee ? `৳${event.joiningFee}` : "Free"}</p>
        </div>

        {event.image && (
          <div className="relative h-80 w-full overflow-hidden mb-6">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="100vw"
              priority
              className="rounded-lg object-contain shadow-md"
            />
          </div>
        )}

        <article className="prose prose-lg max-w-none text-white mb-6">
          <p>{event.description}</p>
        </article>

        <button
          onClick={handleJoin}
          disabled={loading}
          className="bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? "Processing..." : "JOIN HERE"}
        </button>
      </div>
    </main>
  );
}