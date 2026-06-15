/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEventById } from "@/services/EventServices";
import { toast } from "sonner";
import Image from "next/image";
import {
  MapPin, Clock, Users, DollarSign, Tag, Star,
  CalendarDays, Edit2, ArrowLeft, Bookmark, CreditCard,
  CheckCircle2, XCircle, AlertCircle, Zap, CircleDot,
  Crown, MessageSquare,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: React.ReactNode }> = {
  UPCOMING:  { label: "Upcoming",  badge: "bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30",       icon: <Clock className="w-3.5 h-3.5" /> },
  ONGOING:   { label: "Ongoing",   badge: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30", icon: <Zap className="w-3.5 h-3.5" /> },
  COMPLETED: { label: "Completed", badge: "bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500",     icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  CANCELLED: { label: "Cancelled", badge: "bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30",             icon: <XCircle className="w-3.5 h-3.5" /> },
  FULL:      { label: "Full",      badge: "bg-orange-100 text-orange-600 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  OPEN:      { label: "Open",      badge: "bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30", icon: <CircleDot className="w-3.5 h-3.5" /> },
};

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—";

const fmtTime = (d?: string) =>
  d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string }) => (
  <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 space-y-2">
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
      {icon}{label}
    </div>
    <div className="text-lg font-bold text-slate-900 dark:text-white">{value}</div>
    {sub && <div className="text-xs text-slate-400">{sub}</div>}
  </div>
);

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getEventById(id as string);
        if (!res) throw new Error("Event not found");
        setEvent(res);
  
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-3 w-full max-w-2xl px-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <CalendarDays className="w-12 h-12 text-slate-300" />
      <p className="text-slate-500 dark:text-slate-400 font-medium">Event not found</p>
      <button onClick={() => router.back()} className="text-sm text-amber-500 hover:underline">Go back</button>
    </div>
  );

  const statusCfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG["UPCOMING"];
  const participantCount = event.participants?.length ?? 0;
  const capacityPct = event.maxParticipants ? Math.round((participantCount / event.maxParticipants) * 100) : null;
  const avgRating = event.reviews?.length
    ? (event.reviews.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / event.reviews.length).toFixed(1)
    : null;
  const totalRevenue = event.payments?.reduce((s: number, p: any) => s + (p.amount ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-5xl mx-auto px-3 md:px-6 lg:px-8 py-6 space-y-6">

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 p-1 md:px-3 md:py-2 text-sm font-medium border border-amber-500 bg-linear-to-b from-gray-700 from-5% via-amber-500 to-gray-700 hover:text-white dark:hover:text-black transition text-center"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => router.push(`/host/events/edit/${id}`)}
            className="inline-flex items-center gap-1.5 p-1 md:px-3 md:py-2 text-sm font-medium border border-amber-500 bg-linear-to-b from-gray-700 from-5% via-amber-500 to-gray-700 hover:text-white dark:hover:text-black transition text-center"
          >
            <Edit2 className="w-4 h-4" /> Edit Event
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5 shadow-sm">
          {event.image ? (
            <div className="relative w-full h-48 md:h-64 lg:h-80">
              <Image src={event.image} alt={event.title ?? "Event"} fill sizes="(max-width:768px)100vw,80vw" loading="eager" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.badge}`}>
                  {statusCfg.icon}{statusCfg.label}
                </span>
                {event.eventType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-sm">
                    <Tag className="w-3 h-3" />{event.eventType}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-32 md:h-48 bg-linear-to-br from-amber-50 to-orange-100 dark:from-amber-500/10 dark:to-orange-600/10 flex items-center justify-center relative">
              <CalendarDays className="w-16 h-16 text-amber-300" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.badge}`}>
                  {statusCfg.icon}{statusCfg.label}
                </span>
                {event.eventType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white">
                    <Tag className="w-3 h-3" />{event.eventType}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="p-4 md:p-6 space-y-3">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {event.description}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
              {event.location?.formattedAddress && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />{event.location.formattedAddress}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {fmt(event.startDate)}{event.startDate && ` · ${fmtTime(event.startDate)}`}
                {event.endDate && <> → {fmt(event.endDate)}</>}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                {event.joiningFee === 0 ? "Free" : `৳${event.joiningFee}`}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<Users className="w-4 h-4 text-cyan-400" />}
            label="Participants"
            value={`${participantCount}${event.maxParticipants ? ` / ${event.maxParticipants}` : ""}`}
            sub={capacityPct !== null ? `${capacityPct}% capacity` : undefined}
          />
          <StatCard
            icon={<CreditCard className="w-4 h-4 text-emerald-400" />}
            label="Revenue"
            value={totalRevenue > 0 ? `৳${totalRevenue.toLocaleString()}` : "—"}
            sub={`${event.payments?.length ?? 0} payments`}
          />
          <StatCard
            icon={<Star className="w-4 h-4 text-amber-400" />}
            label="Avg Rating"
            value={avgRating ?? "—"}
            sub={`${event.reviews?.length ?? 0} reviews`}
          />
          <StatCard
            icon={<Bookmark className="w-4 h-4 text-violet-400" />}
            label="Saved By"
            value={event.savedBy?.length ?? 0}
            sub="users"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="md:col-span-2 space-y-4">

            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Event Details</h2>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Event Type",    value: event.eventType ?? "—",       icon: <Tag className="w-3.5 h-3.5 text-slate-400" /> },
                  { label: "Start Date",    value: `${fmt(event.startDate)} ${fmtTime(event.startDate)}`, icon: <Clock className="w-3.5 h-3.5 text-cyan-400" /> },
                  { label: "End Date",      value: event.endDate ? `${fmt(event.endDate)} ${fmtTime(event.endDate)}` : "—", icon: <Clock className="w-3.5 h-3.5 text-slate-400" /> },
                  { label: "Location",      value: event.location?.formattedAddress ?? "—", icon: <MapPin className="w-3.5 h-3.5 text-pink-400" /> },
                  { label: "Joining Fee",   value: event.joiningFee === 0 ? "Free" : `৳${event.joiningFee}`, icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> },
                  { label: "Max Capacity",  value: event.maxParticipants ?? "Unlimited", icon: <Users className="w-3.5 h-3.5 text-amber-400" /> },
                  { label: "Min Participants", value: event.minParticipants ?? "—", icon: <Users className="w-3.5 h-3.5 text-slate-400" /> },
                  { label: "Status",        value: statusCfg.label,              icon: statusCfg.icon },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{icon}</div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">{label}</p>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-medium truncate">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Participants
                </h2>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {participantCount}
                </span>
              </div>

              {capacityPct !== null && (
                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>{participantCount} joined</span>
                    <span>{event.maxParticipants} max</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${capacityPct >= 100 ? "bg-red-400" : capacityPct >= 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                      style={{ width: `${Math.min(capacityPct, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="p-4">
                {event.participants?.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No participants yet</p>
                ) : (
                  <div className="space-y-2">
                    {event.participants?.map((p: any) => (
                      <div key={p.id} className="flex items-center gap-3">
                        {p.user?.picture ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 shrink-0">
                            <Image src={p.user.picture} alt={p.user.fullName} fill sizes="32px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                            {p.user?.fullName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                          {p.user?.fullName ?? "Unknown"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" /> Reviews
                </h2>
                <div className="flex items-center gap-1.5">
                  {avgRating && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{avgRating}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {event.reviews?.length ?? 0}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {event.reviews?.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No reviews yet</p>
                ) : (
                  event.reviews?.map((r: any) => (
                    <div key={r.id} className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < (r.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">{fmt(r.createdAt)}</span>
                      </div>
                      {r.comment && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{r.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="space-y-4">

            {event.host && (
              <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" /> Host
                  </h2>
                </div>
                <div className="p-4 flex items-center gap-3">
                  {event.host.picture ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-200 dark:ring-amber-500/30 shrink-0">
                      <Image src={event.host.picture} alt={event.host.fullName ?? "Host"} fill sizes="48px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-lg font-bold text-amber-700 dark:text-amber-300 shrink-0">
                      {event.host.fullName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{event.host.fullName}</p>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                      {event.host.role}
                    </span>
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Payments
                </h2>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {event.payments?.length ?? 0}
                </span>
              </div>
              <div className="p-4 space-y-2">
                {event.payments?.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No payments yet</p>
                ) : (
                  <>
                    {event.payments?.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-white/5 last:border-0">
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-30">
                            {p.transactionId ?? p.id?.slice(0, 8) + "…"}
                          </p>
                          <p className="text-[10px] text-slate-400">{fmt(p.createdAt)}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          ৳{p.amount?.toLocaleString() ?? "—"}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100 dark:border-white/10">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ৳{totalRevenue.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-violet-400" /> Saved By
                </h2>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {event.savedBy?.length ?? 0}
                </span>
              </div>
              <div className="p-4">
                {event.savedBy?.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2">Nobody saved this event yet</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {event.savedBy?.map((s: any) => (
                      <span key={s.id} className="text-xs bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {s.user?.fullName ?? s.userId?.slice(0, 8)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}