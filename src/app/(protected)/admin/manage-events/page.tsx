/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { IEventCreate } from "@/types";
import Skeleton from "@/components/ui/Skeleton";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { getAllEvents } from "@/services/EventServices";
import Image from "next/image";
import {
  Trash2, Search, CalendarDays, MapPin, Users,
  Clock, Crown, Zap, CheckCircle2, CircleDot, XCircle, AlertCircle,
} from "lucide-react";
import { deleteEvent } from "@/actions/event";

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: ReactNode }> = {
  UPCOMING:  { label: "Upcoming",  badge: "bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30",     icon: <Clock className="w-3 h-3" /> },
  ONGOING:   { label: "Ongoing",   badge: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30", icon: <Zap className="w-3 h-3" /> },
  COMPLETED: { label: "Completed", badge: "bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500",    icon: <CheckCircle2 className="w-3 h-3" /> },
  CANCELLED: { label: "Cancelled", badge: "bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30",             icon: <XCircle className="w-3 h-3" /> },
  FULL:      { label: "Full",      badge: "bg-orange-100 text-orange-600 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30", icon: <AlertCircle className="w-3 h-3" /> },
  OPEN:      { label: "Open",      badge: "bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30", icon: <CircleDot className="w-3 h-3" /> },
};

const STATUSES = [
  { value: "ALL",       label: "All Status" },
  { value: "OPEN",      label: "Open" },
  { value: "COMPLETED", label: "Completed" },
];

const TH = "text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-3 py-3 whitespace-nowrap";
const TD = "px-3 py-3";

export default function AdminManageEvents() {
  const [events, setEvents]       = useState<IEventCreate[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { events } = await getAllEvents({ cache: "no-store" });
      setEvents(events);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const filteredEvents = useMemo(() => events.filter((e) => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q || e.title?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.eventType?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchSearch && matchStatus;
  }), [events, search, statusFilter]);

  const eventDelete = (eventId: string) => {
    Swal.fire({
        title: "Are you sure?",
        text: "This event will be permanently deleted!",
        icon: "warning",
        background: "#0f172a",
        color: "#f8fafc",
        showCancelButton: true,
        confirmButtonColor: "#b45309",
        cancelButtonColor: "#334155",
        confirmButtonText: "Yes, delete",
      }).then(async (res) => {
        if (!res.isConfirmed) return;
        try {
          const result = await deleteEvent(eventId);
          if (!result.success) throw new Error(result.message);
          setEvents((prev) => prev.filter((e) => e.id !== eventId));
          toast.success("Event deleted successfully");
        } catch {
          toast.error("Failed to delete event");
        }
      });
    };

  

  if (loading) return <div className="w-11/12 mx-auto mt-6"><Skeleton className="h-96 w-full m-4" /></div>;

  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-3 md:px-6 lg:px-8 py-6 space-y-5 max-w-screen-2xl mx-auto">

        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manage Events
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredEvents.length} of {events.length} events
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-500/20 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-1 shadow-sm">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  statusFilter === s.value
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
              <CalendarDays className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium">No events found</p>
            <p className="text-slate-400 text-sm mt-1">
              {search || statusFilter !== "ALL" ? "Try adjusting your search or filters" : "No events have been created yet"}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[320px]">

                <thead className="md:hidden">
                  <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <th className={TH}>Event</th>
                    <th className={TH}>Fee</th>
                    <th className={TH}>Host</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Action</th>
                  </tr>
                </thead>

                <thead className="hidden md:table-header-group lg:hidden">
                  <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <th className={TH}>Event</th>
                    <th className={TH}>Dates</th>
                    <th className={TH}>Fee</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Action</th>
                  </tr>
                </thead>

                <thead className="hidden lg:table-header-group">
                  <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <th className={TH}>Event</th>
                    <th className={TH}>Dates</th>
                    <th className={TH}>Location</th>
                    <th className={TH}>Capacity</th>
                    <th className={TH}>Fee</th>
                    <th className={TH}>Host</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-transparent">
                  {filteredEvents.map((event) => {
                    const statusCfg = STATUS_CONFIG[event.status as string] ?? STATUS_CONFIG["UPCOMING"];
                    const host = (event as any).host;

                    const imgCell = (size: number) => (
                      <div className={`relative shrink-0 rounded-lg overflow-hidden bg-amber-50 dark:bg-amber-500/10`} style={{ width: size, height: size }}>
                        {event.image
                          ? <Image src={event.image} alt={event.title ?? "Event"} fill sizes={`${size}px`} className="object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><CalendarDays className="w-4 h-4 text-amber-400" /></div>
                        }
                      </div>
                    );

                    const feeCell = (
                      <span className={`text-xs font-bold ${event.joiningFee === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                        {event.joiningFee === 0 ? "Free" : `৳${event.joiningFee}`}
                      </span>
                    );

                    const statusCell = (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusCfg.badge}`}>
                        {statusCfg.icon}{statusCfg.label}
                      </span>
                    );

                    const actionCell = (
                      <button
                        onClick={() => eventDelete(event.id!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 transition-all whitespace-nowrap"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    );

                    return (
                      <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">

                        <>
                          <td className={`${TD} md:hidden`}>
                            <div className="flex items-center gap-2">
                              {imgCell(36)}
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white text-xs leading-snug truncate max-w-22.5">{event.title}</p>
                                {event.eventType && <p className="text-[10px] text-slate-400 mt-0.5">{event.eventType}</p>}
                              </div>
                            </div>
                          </td>
                          <td className={`${TD} md:hidden`}>{feeCell}</td>
                          <td className={`${TD} md:hidden`}>
                            {host ? (
                              <div className="flex items-center gap-1.5">
                                {host.picture
                                  ? <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 shrink-0"><Image src={host.picture} alt={host.fullName ?? "Host"} fill sizes="20px" className="object-cover" /></div>
                                  : <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-700 dark:text-amber-300 shrink-0">{host.fullName?.[0]?.toUpperCase() ?? "?"}</div>
                                }
                                <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-15">{host.fullName}</span>
                              </div>
                            ) : <span className="text-xs text-slate-300">—</span>}
                          </td>
                          <td className={`${TD} md:hidden`}>{statusCell}</td>
                          <td className={`${TD} md:hidden`}>{actionCell}</td>
                        </>

                        <>
                          <td className={`${TD} hidden md:table-cell lg:hidden`}>
                            <div className="flex items-center gap-2.5">
                              {imgCell(36)}
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-32.5">{event.title}</p>
                                {host && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span className="text-xs text-slate-400 truncate max-w-22.5">{host.fullName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className={`${TD} hidden md:table-cell lg:hidden`}>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              {new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                            {event.endDate && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                → {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                            )}
                          </td>
                          <td className={`${TD} hidden md:table-cell lg:hidden`}>{feeCell}</td>
                          <td className={`${TD} hidden md:table-cell lg:hidden`}>{statusCell}</td>
                          <td className={`${TD} hidden md:table-cell lg:hidden`}>{actionCell}</td>
                        </>
                        <>
                          <td className={`${TD} hidden lg:table-cell`}>
                            <div className="flex items-center gap-3">
                              {imgCell(40)}
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-37.5">{event.title}</p>
                                {event.eventType && <p className="text-xs text-slate-400 mt-0.5">{event.eventType}</p>}
                              </div>
                            </div>
                          </td>
                          <td className={`${TD} hidden lg:table-cell`}>
                            <div className="text-xs text-slate-600 dark:text-slate-300">
                              {new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              {event.endDate && (
                                <div className="text-slate-400 mt-0.5">
                                  → {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className={`${TD} hidden lg:table-cell`}>
                            {event.location?.formattedAddress
                              ? <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="truncate max-w-27.5">{event.location.formattedAddress}</span></div>
                              : <span className="text-xs text-slate-300">—</span>}
                          </td>
                          <td className={`${TD} hidden lg:table-cell`}>
                            {event.maxParticipants
                              ? <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"><Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />{event.maxParticipants}</div>
                              : <span className="text-xs text-slate-300">—</span>}
                          </td>
                          <td className={`${TD} hidden lg:table-cell`}>{feeCell}</td>
                          <td className={`${TD} hidden lg:table-cell`}>
                            {host ? (
                              <div className="flex items-center gap-2">
                                {host.picture
                                  ? <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 shrink-0"><Image src={host.picture} alt={host.fullName ?? "Host"} fill sizes="24px" className="object-cover" /></div>
                                  : <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300 shrink-0">{host.fullName?.[0]?.toUpperCase() ?? "?"}</div>
                                }
                                <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-20">{host.fullName}</span>
                              </div>
                            ) : <span className="text-xs text-slate-300">—</span>}
                          </td>
                          <td className={`${TD} hidden lg:table-cell`}>{statusCell}</td>
                          <td className={`${TD} hidden lg:table-cell`}>{actionCell}</td>
                        </>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}