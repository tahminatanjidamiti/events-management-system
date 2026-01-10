"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IEventCreate } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { getAllEvents } from "@/services/EventServices";

export default function EventsPage() {
  const [events, setEvents] = useState<IEventCreate[]>([]);

  useEffect(() => {
  getAllEvents()
    .then((res) => {
      setEvents(res.events);
    })
    .catch(console.error);
}, []);
  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event, idx) => (
        <Link key={idx} href={`/events/${idx}`} className="hover:shadow-md">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm">{event.description}</p>
              <p className="text-xs mt-1">Location: {event.location.formattedAddress}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}