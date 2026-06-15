"use client";
 
import { useState } from "react";
import {
  ChevronDown,
  CalendarCheck,
  UserCheck,
  Users,
  BarChart2,
  ShieldCheck,
} from "lucide-react";
 
const faqs = [
  {
    icon: CalendarCheck,
    q: "How do I join an event on EventsVibe?",
    a: "Browse the events listing and click any event to view its details, then hit the Join Event button. If the event has a joining fee you will be redirected to a secure Stripe payment page — once paid you are automatically enrolled. For free events you are joined instantly with no extra steps.",
  },
  {
    icon: UserCheck,
    q: "How do I become a host and create my own events?",
    a: "Any registered user can apply to become a host. Navigate to Become a Host from your sidebar and submit your application message. An admin reviews and approves your request. Once approved your role changes to HOST and you gain access to the Host dashboard where you can create events with custom titles, dates, a map-based location picker, participant limits, and joining fees — and track everything through Host Analytics.",
  },
  {
    icon: Users,
    q: "What social features are available on EventsVibe?",
    a: "EventsVibe has a full social layer under the Social section in your user dashboard. You can send and receive friend requests, follow other users, discover people to connect with on the home page, leave star ratings and reviews on events you have attended, and save events to revisit later.",
  },
  {
    icon: BarChart2,
    q: "What does the analytics dashboard show me?",
    a: "Users get a personal analytics dashboard to track their event participation history and activity. Hosts get deeper insights — participant counts, revenue, and event status breakdowns. Admins have a separate platform-wide dashboard covering all users, hosts, and events across the system.",
  },
  {
    icon: ShieldCheck,
    q: "How does authentication and account security work?",
    a: "EventsVibe uses NextAuth with access and refresh token rotation for secure sessions. You can register with email and password, use the Forgot Password flow to receive a reset link by email, and reset your password securely via a tokenised URL. Role-based access control (User, Host, Admin) ensures each role only sees and can perform its permitted actions.",
  },
];
 
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
 
  const toggle = (i: number) => setOpen(open === i ? null : i);
 
  return (
    <section className="py-20 px-4 max-w-3xl mx-auto">
 
      <div className="text-center mb-14">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-pretty">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-700 via-amber-500 to-gray-700">
            Frequently
          </span> asked questions ?!
        </h2>
        <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
          Everything you need to know about EventsVibe — events, hosting,
          payments, and more.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const Icon = faq.icon;
          const isOpen = open === i;
 
          return (
            <div
              key={i} id="faq"
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "border-amber-500 bg-linear-to-br from-gray-700 via-amber-500 to-gray-700 shadow-lg shadow-amber-900/10"
                  : "border-slate-700/50 bg-background hover:border-amber-500/30"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-4 px-5 py-4 text-left group"
              >
                <span
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    isOpen
                      ? "bg-yellow-200 text-yellow-700"
                      : "bg-slate-800 text-slate-400 group-hover:bg-amber-500/10 group-hover:text-amber-500"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                </span>
 
                <span
                  className={`flex-1 text-sm font-semibold leading-snug transition-colors duration-200 ${
                    isOpen
                      ? "text-black hover:text-white"
                      : "text-foreground group-hover:text-amber-500"
                  }`}
                >
                  {faq.q}
                </span>
 
                <ChevronDown
                  size={18}
                  strokeWidth={1.8}
                  className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-yellow-700" : ""
                  }`}
                />
              </button>
 
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 pl-17 text-sm text-black leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}