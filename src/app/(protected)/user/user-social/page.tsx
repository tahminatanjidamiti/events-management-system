/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReviewForm from "@/components/modules/Forms/ReviewForm";
import UpdateFriendForm from "@/components/modules/Forms/UpdateFriendForm";
import Skeleton from "@/components/ui/Skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getFriendRequests,
  getNotifications,
  getSavedEvents,
  markNotificationRead,
} from "@/actions/social";
import { Bell, Calendar, Users, Star, MapPin, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function UserSocialPage() {
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReadFilter, setIsReadFilter] = useState<"" | "true" | "false">("");

  const filteredNotifications = notifications.filter((n) => {
    if (isReadFilter === "") return true;
    if (isReadFilter === "true") return n.isRead === true;
    if (isReadFilter === "false") return n.isRead === false;
    return true;
  });

  const load = async () => {
    try {
      setLoading(true);

      const [friendRes, savedRes, notificationRes] = await Promise.all([
        getFriendRequests(),
        getSavedEvents(),
        getNotifications(), // ✅ No params — fetch ALL once
      ]);

      setFriendRequests(friendRes.data);
      setSavedEvents(savedRes.data);
      setNotifications(notificationRes.data);
    } catch (err) {
      console.error("Social load error:", err);
      toast.error("Failed to load social data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleFriendRequestResolved = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // ✅ FIX 1: update status in state instead of removing — so ACCEPTED shows correctly
  const handleFriendRequestUpdated = (requestId: string, newStatus: string) => {
    if (newStatus === "REJECTED") {
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    } else {
      setFriendRequests((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, status: newStatus } : r)
      );
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  if (loading) return <div className="w-11/12 mx-auto mt-6"><Skeleton className="h-96 w-full m-4" /></div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-yellow-900 to-slate-900 dark:from-slate-950 dark:via-yellow-950 dark:to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 w-11/12 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-6">

        <div className="text-center py-6">
          <h1 className="text-4xl font-bold mt-5 text-transparent bg-clip-text bg-linear-to-r from-yellow-500 from-25% via-[#EC5A28] to-65% to-amber-500">
            Social Hub
          </h1>
          <p className="text-slate-400 mt-2">Your connections, events & notifications</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
              <Users className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Friend Requests</h2>
            {friendRequests.length > 0 && (
              <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                {friendRequests.length}
              </span>
            )}
          </div>

          {friendRequests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No incoming friend requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {friendRequests.map((req: any) => (
                <UpdateFriendForm
                  key={req.id}
                  requestId={req.id}
                  status={req.status}
                  requestorName={req.requestor?.fullName}
                  requestorPicture={req.requestor?.picture}
                  onSuccess={() => handleFriendRequestResolved(req.id)}
                  onStatusChange={(newStatus) => handleFriendRequestUpdated(req.id, newStatus)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Saved Events</h2>
            {savedEvents.length > 0 && (
              <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {savedEvents.length}
              </span>
            )}
          </div>

          {savedEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No saved events yet</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {savedEvents.map((se: any) => (
                <div
                  key={se.id}
                  className="group relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {se.event?.image && (
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={se.event.image}
                        alt={se.event.title}
                        width={400}
                        height={200}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white text-sm leading-tight">
                      {se.event?.title ?? "Unknown Event"}
                    </h3>
                    {se.event?.status && (
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${se.event.status === "UPCOMING"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : se.event.status === "FULL"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : se.event.status === "COMPLETED"
                            ? "bg-slate-500/20 text-slate-300 border-slate-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                        }`}>
                        {se.event.status}
                      </span>
                    )}
                  </div>

                  {se.event?.eventType && (
                    <p className="text-xs text-cyan-400 mb-2 font-medium">
                      {se.event.eventType}
                    </p>
                  )}

                  {se.event?.description && (
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {se.event.description}
                    </p>
                  )}

                  <div className="space-y-1.5">
                    {se.event?.startDate && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>
                          {new Date(se.event.startDate).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                          {se.event.endDate && (
                            <> → {new Date(se.event.endDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}</>
                          )}
                        </span>
                      </div>
                    )}

                    {se.event?.location?.formattedAddress && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
                        <span className="truncate">{se.event.location.formattedAddress}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {se.event?.joiningFee !== undefined && (
                        <span className="text-xs font-semibold text-emerald-400">
                          {se.event.joiningFee === 0 ? "Free" : `৳${se.event.joiningFee}`}
                        </span>
                      )}
                      {se.event?.maxParticipants && (
                        <span className="text-xs text-gray-500">
                          Max {se.event.maxParticipants} participants
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Submit Review</h2>
          </div>
          <ReviewForm />
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/30">
              <Bell className="w-5 h-5 text-pink-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {unreadCount} unread
              </span>
            )}

            <div className="ml-auto flex gap-2">
              {(["", "false", "true"] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setIsReadFilter(val)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${isReadFilter === val
                    ? "bg-pink-500/30 text-pink-300 border-pink-500/50"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                    }`}
                >
                  {val === "" ? "All" : val === "false" ? "Unread" : "Read"}
                </button>
              ))}
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No notifications found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotifications.map((n: any) => (
                <div
                  key={n.id}
                  className={`relative flex justify-between items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${n.isRead
                    ? "bg-white/3 border-white/5 opacity-60"
                    : "bg-pink-500/5 border-pink-500/20 shadow-sm shadow-pink-500/10"
                    }`}
                >
                  {!n.isRead && (
                    <span className="absolute top-4 left-0 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-400 shadow-sm shadow-pink-400" />
                  )}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-white">{n.title}</p>
                      {n.isRead && <CheckCircle className="w-3 h-3 text-slate-500 shrink-0" />}
                    </div>
                    <p className="text-sm text-slate-400">{n.message}</p>
                    <p className="text-xs text-slate-600">
                      {new Date(n.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="shrink-0 self-start text-xs px-2.5 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 transition-colors whitespace-nowrap"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div >
  );
}