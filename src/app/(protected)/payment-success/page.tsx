"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getPaymentSession } from "@/actions/payment";
import {
  CheckCircle2, CalendarDays, MapPin, Clock,
  CreditCard, ArrowRight, Home, Loader2,
  Hash, Banknote, BadgeCheck, Mail,
} from "lucide-react";

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }) : "—";

function CountUp({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(target / 40);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setVal(current);
      if (current >= target) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

function Row({ icon, label, value, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-white/30">{icon}</span>
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <span className={`text-xs font-semibold ${highlight ? "text-emerald-400" : "text-white/80"}`}>
        {value}
      </span>
    </div>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get("transactionId");
  const urlAmount = searchParams.get("amount");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const urlStatus = searchParams.get("status");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(!!transactionId);
  const [visible, setVisible] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!transactionId || hasFetched.current) return;
    hasFetched.current = true;
    getPaymentSession(transactionId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [transactionId]);

  const event = data?.payment?.event;
  const payment = data?.payment;
  const session = data?.session;
  const displayAmount = payment?.amount ?? (urlAmount ? Number(urlAmount) : null);

  return (
    <main
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-16"
      style={{
        backgroundImage: `url('https://i.ibb.co.com/PswVd4JW/digital-techno-background-with-connecting-lines-dots.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/75" />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-md space-y-3 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >

        <div className="rounded-2xl border border-emerald-500/20 bg-white/4 backdrop-blur-md p-7 text-center space-y-4 shadow-xl shadow-black/40">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40" />
              <div className="w-full h-full rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment Successful!</h1>
            <p className="text-white/50 text-sm mt-1">
              You&apos;ve successfully joined the event. See you there!
            </p>
          </div>
          {displayAmount && (
            <div className="inline-flex items-baseline gap-1 px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 text-sm font-semibold">৳</span>
              <span className="text-3xl font-bold text-emerald-400 tabular-nums">
                <CountUp target={displayAmount} />
              </span>
              <span className="text-emerald-400/60 text-xs ml-1">paid</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-8 flex items-center justify-center gap-3">
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-white/50 text-sm">Loading your details…</span>
          </div>
        )}


        {!loading && event && (
          <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md overflow-hidden shadow-xl shadow-black/30"
            style={{ animation: "slideUp 0.5s ease 0.15s both" }}
          >
            {event.image && (
              <div className="relative w-full h-40">
                <Image
                  src={event.image} alt={event.title}
                  fill sizes="448px" className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                {event.eventType && (
                  <span className="absolute bottom-3 left-3 text-xs bg-black/50 text-white/80 border border-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    {event.eventType}
                  </span>
                )}
              </div>
            )}
            <div className="p-4 space-y-3">
              <h2 className="font-bold text-white text-base leading-snug">{event.title}</h2>
              <div className="space-y-1.5">
                {event.startDate && (
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {fmt(event.startDate)}
                  </div>
                )}
                {event.location?.formattedAddress && (
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    {event.location.formattedAddress}
                  </div>
                )}
              </div>
              <button
                onClick={() => router.push(`/events/${event.id}?status=success`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-white/8 hover:bg-white/12 text-white border border-white/10 hover:border-white/20 transition-all mt-1"
              >
                View Event <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Receipt */}
        {!loading && (payment || transactionId) && (
          <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-4 shadow-xl shadow-black/30"
            style={{ animation: "slideUp 0.5s ease 0.25s both" }}
          >
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest flex items-center gap-2 pb-2">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Receipt
            </h3>
            <Row
              icon={<Hash className="w-3 h-3" />}
              label="Transaction ID"
              value={transactionId ? transactionId.slice(0, 18) + "…" : "—"}
            />
            <Row
              icon={<Banknote className="w-3 h-3" />}
              label="Amount Paid"
              value={displayAmount ? `৳${Number(displayAmount).toLocaleString()}` : "—"}
              highlight
            />
            <Row
              icon={<CreditCard className="w-3 h-3" />}
              label="Method"
              value={session?.payment_method_types?.[0] ?? payment?.method ?? "Card"}
            />
            <Row
              icon={<BadgeCheck className="w-3 h-3" />}
              label="Status"
              value="Paid ✓"
              highlight
            />
            {session?.customer_email && (
              <Row
                icon={<Mail className="w-3 h-3" />}
                label="Email"
                value={session.customer_email}
              />
            )}
          </div>
        )}

        {!loading && !transactionId && (
          <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-6 text-center space-y-2">
            <CalendarDays className="w-8 h-8 text-amber-400/60 mx-auto" />
            <p className="text-white/50 text-sm">
              Booking confirmed. Check your email for details.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3"
          style={{ animation: "slideUp 0.5s ease 0.35s both" }}
        >
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() => router.push("/user/my-events")}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-white border-2 border-amber-600/40 transition-all shadow-lg shadow-amber-500/25"
          >
            My Events <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent/>
    </Suspense>
  );
}