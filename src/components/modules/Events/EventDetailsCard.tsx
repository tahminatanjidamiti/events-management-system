/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { IEventCreate } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { joinEvent } from "@/actions/event";
import { createPaymentSession } from "@/actions/payment";
import {
  MapPin, Clock, Users, DollarSign, Tag, Star,
  CalendarDays, Bookmark, CreditCard, CheckCircle2,
  XCircle, AlertCircle, Zap, CircleDot, Crown,
  MessageSquare, ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: React.ReactNode }> = {
  UPCOMING:  { label: "Upcoming",  badge: "bg-cyan-500/20 text-cyan-300 border border-cyan-500",     icon: <Clock className="w-3.5 h-3.5" /> },
  ONGOING:   { label: "Ongoing",   badge: "bg-emerald-500 text-emerald-300 border border-emerald-500", icon: <Zap className="w-3.5 h-3.5" /> },
  COMPLETED: { label: "Completed", badge: "bg-amber-500 text-black border border-amber-500",     icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  CANCELLED: { label: "Cancelled", badge: "bg-red-500 text-red-300 border border-red-500",        icon: <XCircle className="w-3.5 h-3.5" /> },
  FULL:      { label: "Full",      badge: "bg-orange-500 text-black border border-orange-500", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  OPEN:      { label: "Open",      badge: "bg-violet-400 text-black border border-violet-500", icon: <CircleDot className="w-3.5 h-3.5" /> },
};

const fmt = (d?: string | Date) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—";

const fmtTime = (d?: string | Date) =>
  d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";

const StatCard = ({
  icon, label, value, sub,
}: {
  icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string;
}) => (
  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 space-y-2">
    <div className="flex items-center gap-2 text-white/50 text-xs font-medium">{icon}{label}</div>
    <div className="text-lg font-bold text-white">{value}</div>
    {sub && <div className="text-xs text-white/40">{sub}</div>}
  </div>
);
export default function EventDetailsCard({ event }: { event: IEventCreate & { [key: string]: any } }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);
    try {
      if (!event.joiningFee || event.joiningFee <= 0) {
        await joinEvent(event.id!);
        toast.success("You have successfully joined the event!");
      } else {
        const session = await createPaymentSession(event.id!);
        if (session?.url) {
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

  const statusCfg = STATUS_CONFIG[event.status as string] ?? STATUS_CONFIG["UPCOMING"];
  const participantCount = event.participants?.length ?? 0;
  const paidPaymentsCount = event.payments?.filter((p: any) => p.status === "PAID").length ?? 0;
  const capacityPct = event.maxParticipants
    ? Math.round((participantCount / event.maxParticipants) * 100)
    : null;
  const avgRating = event.reviews?.length
    ? (event.reviews.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / event.reviews.length).toFixed(1)
    : null;
  const totalRevenue = event.payments
  ?.filter((p: any) => p.status === "PAID")
  .reduce((s: number, p: any) => s + (p.amount ?? 0), 0) ?? 0;

  const isFull = event.status === "FULL" || event.status === "CANCELLED" || event.status === "COMPLETED";

  return (
    <main
      className="relative w-full min-h-screen bg-linear-to-br from-gray-700 from-15% via-yellow-700 to-85% to-gray-700"
    >

      <div className="w-full max-w-5xl mx-auto px-3 md:px-6 lg:px-8 py-8 space-y-6">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-white hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        {/* ── Hero card ── */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm shadow-2xl">
          {/* Event image */}
          {event.image ? (
            <div className="relative w-full h-48 md:h-64 lg:h-80">
              <Image
                src={event.image}
                alt={event.title ?? "Event"}
                fill
                sizes="(max-width:768px)100vw,80vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              {/* Chips over image */}
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${statusCfg.badge}`}>
                  {statusCfg.icon}{statusCfg.label}
                </span>
                {event.eventType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-sm border border-white/20">
                    <Tag className="w-3 h-3" />{event.eventType}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-32 md:h-44 bg-white/5 flex items-center justify-center relative">
              <CalendarDays className="w-16 h-16 text-amber-400/40" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.badge}`}>
                  {statusCfg.icon}{statusCfg.label}
                </span>
                {event.eventType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                    <Tag className="w-3 h-3" />{event.eventType}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Title + description + quick meta */}
          <div className="p-4 md:p-6 space-y-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {event.description}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
              {event.location?.formattedAddress && (
                <span className="flex items-center gap-1.5 text-xs text-white/60">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  {event.location.formattedAddress}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-white/60">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {fmt(event.startDate)}{event.startDate && ` · ${fmtTime(event.startDate)}`}
                {event.endDate && <> → {fmt(event.endDate)}</>}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                {event.joiningFee === 0 ? "Free" : `৳${event.joiningFee}`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats grid ── */}
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
            sub={`${paidPaymentsCount} payments`}
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

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Left col */}
          <div className="md:col-span-2 space-y-4">

            {/* Event Details */}
            <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-semibold text-white">Event Details</h2>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Event Type",       value: event.eventType ?? "—",       icon: <Tag className="w-3.5 h-3.5 text-white/40" /> },
                  { label: "Start",            value: `${fmt(event.startDate)} ${fmtTime(event.startDate)}`, icon: <Clock className="w-3.5 h-3.5 text-cyan-400" /> },
                  { label: "End",              value: event.endDate ? `${fmt(event.endDate)} ${fmtTime(event.endDate)}` : "—", icon: <Clock className="w-3.5 h-3.5 text-white/40" /> },
                  { label: "Location",         value: event.location?.formattedAddress ?? "—", icon: <MapPin className="w-3.5 h-3.5 text-pink-400" /> },
                  { label: "Joining Fee",      value: event.joiningFee === 0 ? "Free" : `৳${event.joiningFee}`, icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> },
                  { label: "Max Capacity",     value: event.maxParticipants ?? "Unlimited", icon: <Users className="w-3.5 h-3.5 text-amber-400" /> },
                  { label: "Min Participants", value: event.minParticipants ?? "—", icon: <Users className="w-3.5 h-3.5 text-white/40" /> },
                  { label: "Status",           value: statusCfg.label,              icon: statusCfg.icon },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{icon}</div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-white/40 font-medium">{label}</p>
                      <p className="text-sm text-white/90 font-medium truncate">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Participants */}
            <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Participants</h2>
                <span className="text-xs font-medium text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                  {participantCount}
                </span>
              </div>
              {capacityPct !== null && (
                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                    <span>{participantCount} joined</span>
                    <span>{event.maxParticipants} max</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${capacityPct >= 100 ? "bg-red-400" : capacityPct >= 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                      style={{ width: `${Math.min(capacityPct, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="p-4">
                {participantCount === 0 ? (
                  <p className="text-xs text-white/40 text-center py-4">No participants yet</p>
                ) : (
                  <div className="space-y-2">
                    {event.participants?.map((p: any) => (
                      <div key={p.id} className="flex items-center gap-3">
                        {p.user?.picture ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
                            <Image src={p.user.picture} alt={p.user.fullName} fill sizes="32px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                            {p.user?.fullName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <span className="text-sm text-white/80 font-medium truncate">
                          {p.user?.fullName ?? "Unknown"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Reviews */}
            <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-white/40" /> Reviews
                </h2>
                <div className="flex items-center gap-1.5">
                  {avgRating && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />{avgRating}
                    </span>
                  )}
                  <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                    {event.reviews?.length ?? 0}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {!event.reviews?.length ? (
                  <p className="text-xs text-white/40 text-center py-4">No reviews yet</p>
                ) : (
                  event.reviews?.map((r: any) => (
                    <div key={r.id} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < (r.rating ?? 0) ? "fill-amber-500 text-yellow-700" : "text-white/20"}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-white/40">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </span>
                      </div>
                      {r.comment && (
                        <p className="text-xs text-black leading-relaxed">{r.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right col */}
          <div className="space-y-4">

            {/* Host */}
            {event.host && (
              <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" /> Host
                  </h2>
                </div>
                <div className="p-4 flex items-center gap-3">
                  {event.host.picture ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-500/30 shrink-0">
                      <Image src={event.host.picture} alt={event.host.fullName ?? "Host"} fill sizes="48px" loading="eager" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg font-bold text-amber-300 shrink-0">
                      {event.host.fullName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{event.host.fullName}</p>
                    <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                      {event.host.role}
                    </span>
                    {event.host.avgRating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-white/60">{event.host.avgRating}</span>
                        {event.host.reviewCount && (
                          <span className="text-xs text-white/40">({event.host.reviewCount} reviews)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Payments */}
            {event.payments?.length > 0 && (
              <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" /> Payments
                  </h2>
                  <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                    {event.payments?.length ?? 0}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {event.payments?.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-white/70 truncate max-w-30">
                          {p.transactionId ?? (p.id?.slice(0, 8) + "…")}
                        </p>
                        <p className="text-[10px] text-white/40">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        ৳{p.amount?.toLocaleString() ?? "—"}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/10">
                    <span className="text-xs font-semibold text-white/40">Total</span>
                    <span className="text-sm font-bold text-emerald-400">৳{totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </section>
            )}

            {/* Saved By */}
            {event.savedBy?.length > 0 && (
              <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-violet-400" /> Saved By
                  </h2>
                  <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                    {event.savedBy?.length}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {event.savedBy?.map((s: any) => (
                      <span key={s.id} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full border border-white/10">
                        {s.user?.fullName ?? s.userId?.slice(0, 8)}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Join / Pay button */}
            <div className="sticky bottom-4">
              <button
                onClick={handleJoin}
                disabled={loading || isFull}
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
                  isFull
                    ? "bg-white/10 text-white/30 border border-white/10 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white border-2 border-amber-700/50 shadow-amber-500/25"
                } disabled:opacity-60`}
              >
                {loading
                  ? "Processing..."
                  : isFull
                  ? event.status === "COMPLETED" ? "Event Ended" : event.status === "CANCELLED" ? "Event Cancelled" : "Event Full"
                  : event.joiningFee && event.joiningFee > 0
                  ? `PAY ৳${event.joiningFee} & JOIN`
                  : "JOIN EVENT"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}