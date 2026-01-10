/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReviewForm from "@/components/modules/Forms/ReviewForm";
import SaveEventForm from "@/components/modules/Forms/SaveEventForm";
import UpdateFriendForm from "@/components/modules/Forms/UpdateFriendForm";
import Skeleton from "@/components/ui/Skeleton";
import { getFriendRequests, getNotifications, getSavedEvents } from "@/services/SocialServices.ts";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserSocialPage() {
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [
          friendRes,
          savedRes,
          notificationRes,
        ] = await Promise.all([
          getFriendRequests(),
          getSavedEvents(),
          getNotifications(),
        ]);

        setFriendRequests(friendRes?.data ?? []);
        setSavedEvents(savedRes?.data ?? []);
        setNotifications(notificationRes?.data ?? []);
      } catch {
        toast.error("Failed to load social data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);
  if (loading) return <Skeleton className="h-96 w-full m-4" />;
  return (
    <div className="p-6 space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Friend Requests</h2>
        {friendRequests.length === 0 && <p>No requests</p>}

        {friendRequests.map((req) => (
          <div
            key={req.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <span>{req.sender?.fullName}</span>
            <UpdateFriendForm requestId={req.id} />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Saved Events</h2>
        <SaveEventForm events={savedEvents} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Submit Review</h2>
        <ReviewForm events={savedEvents} />
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {notifications.map((n) => (
          <div key={n.id} className="border p-3 rounded">
            {n.message}
          </div>
        ))}
      </section>
    </div>
  );
}