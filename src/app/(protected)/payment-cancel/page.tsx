"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  XCircle, Home, RefreshCw, ArrowRight,
  Clock, ShieldAlert, AlertTriangle, HelpCircle,
} from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get("transactionId");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const urlStatus = searchParams.get("status");

  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) { router.push("/"); return; }
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown, router]);

  const reasons = [
    { icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />, text: "You cancelled the checkout" },
    { icon: <Clock className="w-3.5 h-3.5 text-amber-400" />, text: "Payment session timed out" },
    { icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />, text: "Payment was declined by your bank" },
    { icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" />, text: "A network error occurred" },
  ];

  return (
    <main
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-16"
      style={{
        backgroundImage: `url('https://i.ibb.co.com/PswVd4JW/digital-techno-background-with-connecting-lines-dots.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/78" />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-105 h-105 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)",
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
        <div className="rounded-2xl border border-red-500/20 bg-white/4 backdrop-blur-md p-7 text-center space-y-4 shadow-xl shadow-black/40">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-red-500/30" />
              <div className="w-full h-full rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-9 h-9 text-red-400" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment Cancelled</h1>
            <p className="text-white/50 text-sm mt-1">
              Your payment was not completed. No charges were made.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div
              className="w-4 h-4 rounded-full border-2 border-white/20 flex items-center justify-center text-[9px] font-bold text-white/60"
              style={{
                background: `conic-gradient(rgba(255,255,255,0.3) ${countdown * 36}deg, transparent 0deg)`,
              }}
            >
            </div>
            <span className="text-xs text-white/40">
              Redirecting to home in <span className="text-white/70 font-semibold">{countdown}s</span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-4 space-y-1 shadow-xl shadow-black/30"
          style={{ animation: "slideUp 0.5s ease 0.15s both" }}
        >
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest pb-2">
            Why did this happen?
          </h3>
          {reasons.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 py-2 border-b border-white/5 last:border-0">
              {icon}
              <span className="text-xs text-white/50">{text}</span>
            </div>
          ))}
        </div>

        {transactionId && (
          <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md px-4 py-3 flex items-center justify-between"
            style={{ animation: "slideUp 0.5s ease 0.25s both" }}
          >
            <span className="text-xs text-white/30">Reference</span>
            <span className="text-xs font-mono text-white/50">
              {transactionId.slice(0, 20)}…
            </span>
          </div>
        )}

        <p className="text-center text-xs text-white/30 px-4"
          style={{ animation: "slideUp 0.5s ease 0.3s both" }}
        >
          If you were charged but landed here, please contact support with your reference ID.
        </p>

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
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-white border-2 border-amber-600/40 transition-all shadow-lg shadow-amber-500/25"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>

        <button
          onClick={() => router.push("/events")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/8 text-white/40 hover:text-white/60 border border-white/8 transition-all"
          style={{ animation: "slideUp 0.5s ease 0.4s both" }}
        >
          Browse other events <ArrowRight className="w-3.5 h-3.5" />
        </button>
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

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelContent/>
    </Suspense>
  );
}