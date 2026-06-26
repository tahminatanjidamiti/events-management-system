"use client";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { getMyEvents } from "@/actions/event";
import { MapPin, Clock, Users, DollarSign, Tag, Calendar, TrendingUp } from "lucide-react";
import Image from "next/image";
import { EventRow } from "@/types";

const statusStyle: Record<string, string> = {
  OPEN:  "bg-green-500/20 text-green-300 border-green-500/30",
  ONGOING:   "bg-blue-500/20 text-blue-300 border-blue-500/30",
  FULL:      "bg-red-500/20 text-red-300 border-red-500/30",
  COMPLETED: "bg-amber-500/20 text-amber-300 border-amber-500",
  CANCELLED: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const StatusBadge = ({ status }: { status?: string }) =>
  status ? (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
      statusStyle[status] ?? "bg-white/10  border-white/20"
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

const calcRevenue = (joiningFee?: number, participantCount?: number) => {
  if (!joiningFee || !participantCount) return 0;
  return joiningFee * participantCount;
};

export default function HostMyEvents() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEvents()
      .then((res) => {
        const arr = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setEvents(arr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="w-8/12 mx-auto mt-10 space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>;;

  const empty = (
    <div className="text-center py-16 text-gray-400">
      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
      <p>You have no hosted events yet.</p>
    </div>
  );

  const totalRevenue = events.reduce(
    (sum, e) => sum + calcRevenue(e.joiningFee, e.participants?.length),
    0
  );
  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.participants?.length ?? 0),
    0
  );

  return (
    <div className="p-1 md:p-6 space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-semibold">My Hosted Events</h1>
        {events.length > 0 && (
          <span className=" text-center px-1 md:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {events.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-1 md:p-4">
            <div className="flex items-center gap-1 md:gap-2 mb-1">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400">Total Participants</span>
            </div>
            <p className="text-xl font-bold">{totalParticipants}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-1 md:p-4">
            <div className="flex items-center gap-1 md:gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Total Revenue</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-emerald-400">
              {totalRevenue === 0 ? "—" : `৳${totalRevenue.toLocaleString()}`}
            </p>
          </div>
          <div className="col-span-2 md:col-span-1 rounded-xl border border-white/10 bg-white/5 p-1 md:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-slate-400">Open</span>
            </div>
            <p className="text-xl font-bold">
              {events.filter(e => e.status === "OPEN").length}
            </p>
          </div>
        </div>
      )}

      {events.length === 0 ? empty : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">

                <th className="p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">Image</th>

                <th className="hidden md:table-cell md:px-4 md:py-3 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Type
                  </div>
                </th>

                <th className="hidden md:table-cell p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">Status</th>

                <th className="p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> Joined
                  </div>
                </th>

                <th className="hidden md:table-cell px-4 py-3 font-semibold whitespace-nowrap">Title</th>
                <th className="hidden md:table-cell px-4 py-3 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Dates
                  </div>
                </th>
                <th className="p-1 md:px-4 md:py-3 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Fee
                  </div>
                </th>

                <th className="hidden lg:table-cell px-4 py-3 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Revenue
                  </div>
                </th>
                <th className="hidden lg:table-cell px-4 py-3 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </div>
                </th>

              </tr>
            </thead>

            <tbody>
              {events.map((e, i) => {
                const revenue = calcRevenue(e.joiningFee, e.participants?.length);
                const participantCount = e.participants?.length ?? 0;
                const capacityPct = e.maxParticipants
                  ? Math.round((participantCount / e.maxParticipants) * 100)
                  : null;

                return (
                  <tr
                    key={e.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      i % 2 === 0 ? "bg-transparent" : "bg-white/2"
                    }`}
                  >
                    <td className="p-1 md:px-4 md:py-3">
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
                    </td>

                    <td className="hidden md:table-cell md:px-4 md:py-3 whitespace-nowrap text-xs">
                      {e.eventType ?? "—"}
                    </td>

                    <td className="hidden md:table-cell md:px-4 md:py-3">
                      <StatusBadge status={e.status} />
                    </td>

                    <td className="p-1 md:px-4 md:py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-xs font-medium">
                          {participantCount}
                          {e.maxParticipants && (
                            <span className="text-slate-500"> / {e.maxParticipants}</span>
                          )}
                        </div>
                        {capacityPct !== null && (
                          <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                capacityPct >= 100
                                  ? "bg-red-400"
                                  : capacityPct >= 70
                                  ? "bg-amber-400"
                                  : "bg-green-400"
                              }`}
                              style={{ width: `${Math.min(capacityPct, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="hidden md:table-cell px-4 py-3 text-xs font-medium">
                      <span className="truncate block max-w-32 lg:max-w-44">
                        {e.title}
                      </span>
                    </td>

                    <td className="hidden md:table-cell px-4 py-3">
                      <DateRange startDate={e.startDate} endDate={e.endDate} />
                    </td>

                    <td className="p-1 md:px-4 md:py-3 whitespace-nowrap">
                      {e.joiningFee !== undefined ? (
                        <span className={`text-xs font-semibold ${
                          e.joiningFee === 0 ? "text-green-400" : "text-emerald-400"
                        }`}>
                          {e.joiningFee === 0 ? "Free" : `৳${e.joiningFee}`}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>

                    <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold ${
                        revenue > 0 ? "text-emerald-400" : "text-slate-500"
                      }`}>
                        {revenue > 0 ? `৳${revenue.toLocaleString()}` : "—"}
                      </span>
                    </td>

                    <td className="hidden lg:table-cell px-4 py-3 text-slate-400 text-xs">
                      <span className="truncate block max-w-36">
                        {e.location?.formattedAddress ?? "—"}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}