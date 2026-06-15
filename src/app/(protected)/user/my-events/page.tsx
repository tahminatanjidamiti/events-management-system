"use client";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { getMyEvents } from "@/actions/event";
import { MapPin, Clock, Users, DollarSign, Tag, Calendar } from "lucide-react";
import Image from "next/image";
import { EventRow } from "@/types";

const statusStyle: Record<string, string> = {
  UPCOMING: "bg-green-500/20 text-green-300 border-green-500/30",
  ONGOING: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  FULL: "bg-red-500/20 text-red-300 border-red-500/30",
  COMPLETED: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  CANCELLED: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const StatusBadge = ({ status }: { status?: string }) =>
  status ? (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle[status] ?? "bg-white/10 text-white border-white/20"
      }`}>
      {status}
    </span>
  ) : null;

const DateRange = ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
  if (!startDate) return <span className="text-slate-500">—</span>;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <div className="space-y-0.5 text-xs text-slate-400">
      <div>{fmt(startDate)}</div>
      {endDate && <div className="text-slate-500">→ {fmt(endDate)}</div>}
    </div>
  );
};

export default function UserMyEvents() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return<div className="w-11/12 mx-auto mt-6"><Skeleton className="h-96 w-full m-4" /></div>;

  const empty = (
    <div className="text-center py-16 text-gray-400">
      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
      <p>You have not joined any events yet.</p>
    </div>
  );

  return (
    <div className="p-1 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">My Joined Events</h1>
        {events.length > 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-xs text-center font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {events.length === 0 ? empty : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left">
                  <th className="p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">Images</th>
                  <th className="hidden md:table-cell p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1">Title</div>
                  </th>
                  <th className="p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1"><Tag className="w-3 h-3" /> Type</div>
                  </th>
                  <th className="hidden md:table-cell md:px-4 md:py-3 font-semibold whitespace-nowrap">Status</th>
                  <th className="hidden md:table-cell p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Dates</div>
                  </th>
                  <th className="p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Fee</div>
                  </th>
                  <th className="hidden md:table-cell p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1"><Users className="w-3 h-3" /> Participants</div>
                  </th>
                  <th className="hidden lg:table-cell p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</div>
                  </th>
                  <th className="hidden lg:table-cell p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">Host</th>
                </tr>
              </thead>

              <tbody>
                {events.map((e, i) => (
                  <tr
                    key={e.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "bg-transparent" : "bg-white/2"
                      }`}
                  >
                    <td className="p-1 md:px-4 md:py-3">
                      <div className="flex items-center gap-3">
                        {e.image ? (
                          <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={e.image}
                              alt={e.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-yellow-500/20 border border-yellow-500/20 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-yellow-400" />
                          </div>
                        )}

                      </div>
                    </td>

                    <td className="hidden md:table-cell p-1 md:px-4 md:py-3 whitespace-nowrap text-xs">
                      {e.title}
                    </td>
                    <td className="p-1 md:px-4 md:py-3 whitespace-nowrap text-xs">
                      {e.eventType ?? "—"}
                    </td>

                    <td className="hidden md:table-cell md:px-4 md:py-3">
                      <StatusBadge status={e.status} />
                    </td>

                    <td className="hidden md:table-cell p-1 md:px-4 md:py-3">
                      <DateRange startDate={e.startDate} endDate={e.endDate} />
                    </td>

                    <td className="p-1 md:px-4 md:py-3 whitespace-nowrap">
                      {e.joiningFee !== undefined ? (
                        <span className={`text-sm font-semibold ${e.joiningFee === 0 ? "text-green-400" : "text-emerald-400"
                          }`}>
                          {e.joiningFee === 0 ? "Free" : `৳${e.joiningFee}`}
                        </span>
                      ) : "—"}
                    </td>

                    <td className="hidden md:table-cell p-1 md:px-4 md:py-3 whitespace-nowrap text-xs text-slate-400">
                      <div className="space-y-0.5">
                        <div>{e.participants?.length ?? 0} joined</div>
                        {(e.minParticipants || e.maxParticipants) && (
                          <div className="text-slate-500">
                            {e.minParticipants && `min ${e.minParticipants}`}
                            {e.minParticipants && e.maxParticipants && " / "}
                            {e.maxParticipants && `max ${e.maxParticipants}`}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="hidden lg:table-cell p-1 md:px-4 md:py-3 text-slate-400 text-xs">
                      <span className="truncate block max-w-36">
                        {e.location?.formattedAddress ?? "—"}
                      </span>
                    </td>

                    <td className="hidden lg:table-cell p-1 md:px-4 md:py-3">
                      <div className="flex items-center gap-2">
                        {e.host?.picture ? (
                          <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden">
                            <Image
                              src={e.host.picture}
                              alt={e.host.fullName ?? "Host"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-7 h-7 shrink-0 rounded-full bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-xs text-amber-400 font-bold">
                            {e.host?.fullName?.charAt(0) ?? "H"}
                          </div>
                        )}
                        <span className="text-slate-400 text-xs truncate max-w-24">
                          {e.host?.fullName ?? "—"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}