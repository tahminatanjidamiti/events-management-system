"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useSession } from "next-auth/react";
import { getAISuggestions } from "@/actions/event";
import { getUserById } from "@/services/UserServices";
import Link from "next/link";

interface Host {
  id: string;
  fullName: string;
  avgRating: number;
  reviewCount: number;
}

interface LocationData {
  city?: string;
  address?: string;
  formattedAddress?: string;
}

interface SuggestedEvent {
  id: string;
  title: string;
  eventType: string;
  relevanceScore: number;
  reason: string;
  host: Host;
  location: LocationData;
  startDate: string;
  joiningFee: number;
}

interface UserProfile {
  interests?: string[];
}
interface FullUser {
  id: string;
  role: "USER" | "ADMIN" | "HOST";
  interests?: string[];
  userProfile?: UserProfile;
}

const PRESET_EVENT_TYPES = [
  "Hiking",
  "Gaming",
  "Tech",
  "Music",
  "Sports",
  "Art",
  "Food",
  "Travel",
  "Fitness",
  "Photography",
  "Networking",
  "Dance",
  "Coding",
  "Nature",
  "Books",
  "Film",
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  HIKING: "#16a34a",
  GAMING: "#8b5cf6",
  TECH: "#0ea5e9",
  MUSIC: "#f59e0b",
  SPORTS: "#10b981",
  ART: "#ec4899",
  FOOD: "#f97316",
  TRAVEL: "#06b6d4",
  FITNESS: "#14b8a6",
  PHOTOGRAPHY: "#a855f7",
  NETWORKING: "#3b82f6",
  DANCE: "#f43f5e",
  CODING: "#6366f1",
  NATURE: "#22c55e",
  BOOKS: "#d97706",
  FILM: "#64748b",
  AI: "#0891b2",
  DEFAULT: "#78716c",
};

const getEventColor = (type: string) =>
  EVENT_TYPE_COLORS[type?.toUpperCase()] ?? EVENT_TYPE_COLORS.DEFAULT;

const normaliseToPreset = (raw: string): string => {
  const found = PRESET_EVENT_TYPES.find(
    (p) => p.toLowerCase() === raw.toLowerCase()
  );
  return found ?? raw;
};


const StarRating = ({ rating }: { rating: number }) => {
  const stars = Math.round(rating * 2) / 2;
  return (
    <span className="ai-stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={s <= stars ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: s <= stars ? "#f59e0b" : "#cbd5e1" }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
};

const Chip = ({
  label,
  onRemove,
  isFromProfile,
}: {
  label: string;
  onRemove: () => void;
  isFromProfile?: boolean;
}) => (
  <span className={`ai-chip${isFromProfile ? " ai-chip-profile" : ""}`}>
    {isFromProfile && (
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ opacity: 0.7, flexShrink: 0 }}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2v2h-2zm0-8h2v6h-2z" />
      </svg>
    )}
    {label}
    <button
      className="ai-chip-remove"
      onClick={onRemove}
      aria-label={`Remove ${label}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </span>
);

const SkeletonCard = ({ delay }: { delay: number }) => (
  <div className="ai-skeleton-card" style={{ animationDelay: `${delay}ms` }}>
    <div className="ai-skeleton-badge" />
    <div className="ai-skeleton-title" />
    <div className="ai-skeleton-line" style={{ width: "80%" }} />
    <div className="ai-skeleton-line" style={{ width: "60%" }} />
    <div className="ai-skeleton-reason" />
    <div className="ai-skeleton-footer" />
  </div>
);

const EventCard = ({
  event,
  index,
}: {
  event: SuggestedEvent;
  index: number;
}) => {
  const accentColor = getEventColor(event.eventType);
  const dateStr = event.startDate
    ? new Date(event.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Date TBA";
  const rankLabels = ["Best Match", "Second Pick", "Third Pick"];
  const cityLabel =
    event.location?.city ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event.location as any)?.formattedAddress?.split(",")[0] ||
    null;

  return (
    <article
      className="ai-event-card"
      style={
        {
          "--accent": accentColor,
          animationDelay: `${index * 120}ms`,
        } as React.CSSProperties
      }
    >
      <div className="ai-rank-badge">
        <span className="ai-rank-num">{index + 1}</span>
        <span className="ai-rank-label">{rankLabels[index] ?? "Pick"}</span>
      </div>

      <div className="ai-score-wrap">
        <svg width="56" height="56" viewBox="0 0 56 56" className="ai-score-svg">
          <circle cx="28" cy="28" r="22" fill="none" stroke="#e2e8f0" strokeWidth="5" />
          <circle
            cx="28" cy="28" r="22" fill="none"
            stroke={accentColor} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${(event.relevanceScore / 100) * 138.2} 138.2`}
            transform="rotate(-90 28 28)"
            className="ai-score-arc"
          />
        </svg>
        <span className="ai-score-num">{event.relevanceScore}</span>
      </div>

      <div className="ai-card-body">
        <div
          className="ai-card-type-badge"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {event.eventType}
        </div>
        <h3 className="ai-card-title">{event.title}</h3>

        <div className="ai-card-meta">
          <span className="ai-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {dateStr}
          </span>
          {cityLabel && (
            <span className="ai-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {cityLabel}
            </span>
          )}
          <span className="ai-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            {event.joiningFee === 0 ? "Free" : `৳${event.joiningFee}`}
          </span>
        </div>

        <div className="ai-reason-box" style={{ borderLeftColor: accentColor }}>
          <div className="ai-reason-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            Why this event?
          </div>
          <p className="ai-reason-text">{event.reason}</p>
        </div>

        {event.host?.fullName && (
          <div className="ai-host-row">
            <div
              className="ai-host-avatar"
              style={{ background: `${accentColor}22`, color: accentColor }}
            >
              {event.host.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="ai-host-info">
              <span className="ai-host-name">{event.host.fullName}</span>
              {event.host.avgRating > 0 && (
                <span className="ai-host-rating">
                  <StarRating rating={event.host.avgRating} />
                  <span className="ai-host-count">({event.host.reviewCount})</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center justify-center rounded-sm p-2 border border-amber-500 bg-linear-to-b from-gray-500 from-5% via-amber-500 to-gray-500 hover:text-white dark:hover:text-black transition"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};


export default function AiSuggestions() {
   const [user, setUser] = useState<FullUser | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userLoading, setUserLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) {
      setUserLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const data = await getUserById(session.user.id)
        setUser(data?.data ?? null);
      } catch (err) {
        console.error("❌ AiSuggestions: Failed to fetch user:", err);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [session?.user?.id]);

  const [interests, setInterests] = useState<string[]>([]);
  const [profileInterests, setProfileInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || user.role !== "USER") return;

    const raw: string[] =
      user.interests ??
      user.userProfile?.interests ??
      [];

    if (raw.length === 0) return;

    const normalised = raw
      .map(normaliseToPreset)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 8);

    setInterests(normalised);
    setProfileInterests(normalised);
  }, [user]);

  const filteredPresets = PRESET_EVENT_TYPES.filter(
    (p) =>
      !interests.includes(p) &&
      p.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addInterest = (value: string) => {
    const trimmed = normaliseToPreset(value.trim());
    if (!trimmed || interests.includes(trimmed) || interests.length >= 8) return;
    setInterests((prev) => [...prev, trimmed]);
    setInputValue("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeInterest = (tag: string) => {
    setInterests((prev) => prev.filter((i) => i !== tag));
    setProfileInterests((prev) => prev.filter((i) => i !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addInterest(inputValue);
    } else if (e.key === "Backspace" && !inputValue && interests.length > 0) {
      const last = interests[interests.length - 1];
      removeInterest(last);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleFetch = async () => {
    if (interests.length === 0) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await getAISuggestions(interests);
      setSuggestions(data.suggestedEvents ?? []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLoggedInUser = !!user && user.role === "USER";
  const hasProfileInterests = profileInterests.length > 0;

  return (
    <>
      <style>{`
        /* ── Section ── */
        .ai-section {
          padding: 72px 24px;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        .ai-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.12;
          pointer-events: none; z-index: 0;
        }
        .ai-blob-1 { width: 420px; height: 420px; background: #b45309; top: -120px; left: -80px; }
        .ai-blob-2 { width: 360px; height: 360px; background: #d97706; bottom: -80px; right: -60px; }
        .ai-section-inner { max-width: 900px; margin: 0 auto; position: relative; z-index: 1; }
 
        /* ── Header ── */
        .ai-header { text-align: center; margin-bottom: 40px; }
        .ai-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #b45309; background: #fef3c7;
          padding: 5px 14px; border-radius: 99px; margin-bottom: 16px;
        }
        .ai-heading {
          font-size: clamp(28px, 5vw, 44px); font-weight: 800;
          line-height: 1.15; color: #0f172a; margin: 0 0 14px;
          letter-spacing: -0.03em;
        }
        .dark .ai-heading { color: #f1f5f9; }
        .ai-heading span {
          background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ai-sub { font-size: 17px; color: #64748b; line-height: 1.6; max-width: 520px; margin: 0 auto; }
 
        /* ── Personalised banner ── */
        .ai-profile-banner {
          display: flex; align-items: center; gap: 10px;
          background: #fef3c7; border: 1.5px solid #fcd34d;
          border-radius: 12px; padding: 10px 16px;
          font-size: 13px; font-weight: 600; color: #92400e;
          margin-bottom: 16px;
        }
        .ai-profile-banner svg { flex-shrink: 0; color: #d97706; }
        .ai-profile-banner-sub { font-weight: 400; color: #b45309; margin-left: 2px; }
 
        /* ── Input box ── */
        .ai-input-section {
          background: #fff; border-radius: 20px; padding: 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          margin-bottom: 32px; border: 1.5px solid #e2e8f0;
        }
        .dark .ai-input-section { background: #1e293b; border-color: #334155; }
 
        .ai-input-label {
          font-size: 13px; font-weight: 600; color: #475569;
          margin-bottom: 12px; display: flex; align-items: center; gap: 6px;
        }
        .dark .ai-input-label { color: #94a3b8; }
        .ai-input-label span {
          background: #f1f5f9; color: #94a3b8; font-size: 11px;
          padding: 2px 8px; border-radius: 99px; font-weight: 500;
        }
        .dark .ai-input-label span { background: #334155; }
 
        /* chip input row */
        .ai-chip-input-wrap {
          display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
          min-height: 48px; padding: 10px 14px; background: #f8fafc;
          border: 1.5px solid #e2e8f0; border-radius: 12px; cursor: text;
          transition: border-color 0.2s; position: relative;
        }
        .dark .ai-chip-input-wrap { background: #0f172a; border-color: #334155; }
        .ai-chip-input-wrap:focus-within {
          border-color: #b45309; background: #fff;
          box-shadow: 0 0 0 3px rgba(180,83,9,0.12);
        }
        .dark .ai-chip-input-wrap:focus-within { background: #1e293b; }
 
        /* chips */
        .ai-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 10px 5px 12px; background: #fef3c7; color: #92400e;
          border-radius: 99px; font-size: 13px; font-weight: 600;
          animation: chipPop 0.18s cubic-bezier(0.34,1.56,0.64,1);
          border: 1px solid #fde68a;
        }
        /* Profile-sourced chips get a slightly richer border */
        .ai-chip.ai-chip-profile {
          background: #fef9c3; border-color: #fbbf24; color: #78350f;
        }
        @keyframes chipPop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .ai-chip-remove {
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer; padding: 2px;
          color: #d97706; border-radius: 50%; transition: background 0.15s;
        }
        .ai-chip-remove:hover { background: #fde68a; color: #92400e; }
 
        .ai-text-input {
          flex: 1; min-width: 120px; border: none; outline: none;
          background: transparent; font-size: 14px; color: #0f172a; font-family: inherit;
        }
        .dark .ai-text-input { color: #f1f5f9; }
        .ai-text-input::placeholder { color: #94a3b8; }
 
        /* ── Dropdown ── */
        .ai-dropdown-wrap { position: relative; flex: 1; min-width: 120px; }
        .ai-dropdown {
          position: absolute; top: calc(100% + 6px); left: -14px; right: -14px;
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1); z-index: 50; overflow: hidden;
          animation: dropFade 0.15s ease;
        }
        .dark .ai-dropdown { background: #1e293b; border-color: #334155; }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ai-dropdown-header {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: #94a3b8; padding: 10px 14px 6px;
        }
        .ai-dropdown-item {
          padding: 9px 14px; font-size: 14px; color: #1e293b; cursor: pointer;
          display: flex; align-items: center; gap: 8px; transition: background 0.1s;
        }
        .dark .ai-dropdown-item { color: #e2e8f0; }
        .ai-dropdown-item:hover { background: #fef3c7; color: #b45309; }
        .dark .ai-dropdown-item:hover { background: #292524; }
        .ai-dropdown-item-dot { width: 6px; height: 6px; border-radius: 50%; background: #fcd34d; flex-shrink: 0; }
 
        /* ── Preset pills ── */
        .ai-presets { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; }
        .ai-preset-pill {
          font-size: 13px; font-weight: 500; color: #475569; background: #f1f5f9;
          border: 1.5px solid #e2e8f0; border-radius: 99px; padding: 6px 14px;
          cursor: pointer; transition: all 0.15s; white-space: nowrap; font-family: inherit;
        }
        .dark .ai-preset-pill { background: #1e293b; border-color: #334155; color: #94a3b8; }
        .ai-preset-pill:hover { background: #fef3c7; border-color: #fcd34d; color: #92400e; }
        .ai-preset-pill.selected {
          background: #fef3c7; border-color: #f59e0b; color: #92400e;
          font-weight: 600; cursor: default; opacity: 0.6;
        }
 
        /* ── CTA row ── */
        .ai-cta-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 20px; gap: 12px; flex-wrap: wrap;
        }
        .ai-hint { font-size: 12.5px; color: #94a3b8; }
        .ai-btn {
          display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px;
          background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
          color: #fff; font-size: 15px; font-weight: 700; border: none; border-radius: 12px;
          cursor: pointer; transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 16px rgba(180,83,9,0.35); font-family: inherit; letter-spacing: -0.01em;
        }
        .ai-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(180,83,9,0.45); }
        .ai-btn:active:not(:disabled) { transform: translateY(0); }
        .ai-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .ai-btn-spinner {
          width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
 
        /* ── Results ── */
        .ai-results-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .ai-results-title { font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
        .dark .ai-results-title { color: #f1f5f9; }
        .ai-results-count {
          font-size: 12px; font-weight: 600; background: #fef3c7;
          color: #b45309; padding: 3px 10px; border-radius: 99px;
        }
        .ai-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
 
        /* ── Event card ── */
        .ai-event-card {
          background: #fff; border-radius: 18px; border: 1.5px solid #e2e8f0;
          padding: 22px; position: relative; display: flex; flex-direction: column;
          gap: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s;
          animation: cardIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; overflow: hidden;
        }
        .dark .ai-event-card { background: #1e293b; border-color: #334155; }
        .ai-event-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 3px; background: var(--accent); border-radius: 18px 18px 0 0;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ai-event-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.10); }
 
        .ai-rank-badge {
          position: absolute; top: 16px; right: 16px;
          display: flex; flex-direction: column; align-items: center;
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 10px; padding: 4px 8px; min-width: 44px;
        }
        .dark .ai-rank-badge { background: #0f172a; border-color: #334155; }
        .ai-rank-num { font-size: 18px; font-weight: 800; color: #0f172a; line-height: 1; }
        .dark .ai-rank-num { color: #f1f5f9; }
        .ai-rank-label {
          font-size: 9px; font-weight: 600; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap;
        }
 
        .ai-score-wrap { position: relative; width: 56px; height: 56px; flex-shrink: 0; }
        .ai-score-svg { display: block; }
        .ai-score-arc { transition: stroke-dasharray 0.8s ease; }
        .ai-score-num {
          position: absolute; inset: 0; display: flex;
          align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; color: #0f172a;
        }
        .dark .ai-score-num { color: #f1f5f9; }
 
        .ai-card-body { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .ai-card-type-badge {
          display: inline-block; font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 99px; width: fit-content;
        }
        .ai-card-title {
          font-size: 17px; font-weight: 700; color: #0f172a;
          line-height: 1.3; margin: 0; letter-spacing: -0.02em; padding-right: 56px;
        }
        .dark .ai-card-title { color: #f1f5f9; }
 
        .ai-card-meta { display: flex; flex-wrap: wrap; gap: 10px; }
        .ai-meta-item {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12.5px; color: #64748b; font-weight: 500;
        }
        .ai-meta-item svg { flex-shrink: 0; color: #94a3b8; }
 
        .ai-reason-box {
          background: #f8fafc; border-left: 3px solid;
          border-radius: 0 8px 8px 0; padding: 10px 12px;
        }
        .dark .ai-reason-box { background: #0f172a; }
        .ai-reason-label {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 5px;
        }
        .ai-reason-text { font-size: 13px; color: #475569; line-height: 1.55; margin: 0; }
        .dark .ai-reason-text { color: #94a3b8; }
 
        .ai-host-row {
          display: flex; align-items: center; gap: 10px;
          padding-top: 10px; border-top: 1px solid #f1f5f9;
        }
        .dark .ai-host-row { border-color: #334155; }
        .ai-host-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800; flex-shrink: 0;
        }
        .ai-host-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ai-host-name {
          font-size: 13px; font-weight: 600; color: #1e293b;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dark .ai-host-name { color: #e2e8f0; }
        .ai-host-rating { display: flex; align-items: center; gap: 5px; }
        .ai-stars { display: inline-flex; gap: 1px; }
        .ai-host-count { font-size: 11px; color: #94a3b8; font-weight: 500; }
 
        /* ── Skeleton ── */
        .ai-skeleton-card {
          background: #fff; border-radius: 18px; border: 1.5px solid #e2e8f0;
          padding: 22px; display: flex; flex-direction: column; gap: 12px;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .dark .ai-skeleton-card { background: #1e293b; border-color: #334155; }
        @keyframes shimmer { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
        .ai-skeleton-badge, .ai-skeleton-title, .ai-skeleton-line,
        .ai-skeleton-reason, .ai-skeleton-footer { background: #e2e8f0; border-radius: 8px; }
        .dark .ai-skeleton-badge, .dark .ai-skeleton-title, .dark .ai-skeleton-line,
        .dark .ai-skeleton-reason, .dark .ai-skeleton-footer { background: #334155; }
        .ai-skeleton-badge  { height: 22px; width: 70px; border-radius: 99px; }
        .ai-skeleton-title  { height: 20px; }
        .ai-skeleton-line   { height: 14px; }
        .ai-skeleton-reason { height: 60px; }
        .ai-skeleton-footer { height: 34px; border-radius: 99px; width: 50%; }
 
        /* ── Empty / error states ── */
        .ai-state-box {
          text-align: center; padding: 48px 24px; background: #fff;
          border-radius: 20px; border: 1.5px dashed #e2e8f0;
        }
        .dark .ai-state-box { background: #1e293b; border-color: #334155; }
        .ai-state-icon { font-size: 44px; margin-bottom: 14px; }
        .ai-state-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .dark .ai-state-title { color: #f1f5f9; }
        .ai-state-desc { font-size: 14px; color: #64748b; line-height: 1.6; }
        .ai-state-error { border-color: #fca5a5; background: #fff7f7; }
        .ai-state-error .ai-state-title { color: #ef4444; }
 
        @media (max-width: 600px) {
          .ai-section { padding: 48px 16px; }
          .ai-cards-grid { grid-template-columns: 1fr; }
          .ai-cta-row { flex-direction: column; align-items: stretch; }
          .ai-btn { justify-content: center; }
        }
      `}</style>

      <section id="ai" className="ai-section">
        <div className="ai-blob ai-blob-1" />
        <div className="ai-blob ai-blob-2" />

        <div className="ai-section-inner">
          {/* ── Header ── */}
          <div className="ai-header">
            <div className="ai-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              AI-Powered
            </div>
            <h2 className="ai-heading">
              Events picked <span>just for you</span>
            </h2>
            <p className="ai-sub">
              Tell us what you love and our AI will surface the best matching
              events happening near you right now.
            </p>
          </div>

          {/* ── Input box ── */}
          <div className="ai-input-section">

            {/* Personalised banner — only for logged-in USER with saved interests */}
            {isLoggedInUser && hasProfileInterests && (
              <div className="ai-profile-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Pre-filled from your profile
                <span className="ai-profile-banner-sub">
                  — edit or add more below
                </span>
              </div>
            )}

            <div className="ai-input-label">
              Your interests
              <span>{interests.length}/8</span>
            </div>

            {/* Chip input */}
            <div
              className="ai-chip-input-wrap"
              onClick={() => inputRef.current?.focus()}
            >
              {interests.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onRemove={() => removeInterest(tag)}
                  isFromProfile={profileInterests.includes(tag)}
                />
              ))}
              <div className="ai-dropdown-wrap" ref={dropdownRef}>
                <input
                  ref={inputRef}
                  className="ai-text-input"
                  placeholder={
                    interests.length === 0
                      ? "Type an event type… (e.g. Hiking, Gaming)"
                      : interests.length < 8
                        ? "Add more…"
                        : ""
                  }
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={handleKeyDown}
                  disabled={interests.length >= 8}
                  maxLength={30}
                />
                {showDropdown && (
                  filteredPresets.length > 0 || (
                    inputValue.trim() &&
                    !PRESET_EVENT_TYPES.map((x) => x.toLowerCase()).includes(
                      inputValue.trim().toLowerCase()
                    )
                  )
                ) && (
                    <div className="ai-dropdown">
                      {filteredPresets.length > 0 && (
                        <>
                          <div className="ai-dropdown-header">Event types</div>
                          {filteredPresets.slice(0, 6).map((p) => (
                            <div
                              key={p}
                              className="ai-dropdown-item"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                addInterest(p);
                              }}
                            >
                              <span
                                className="ai-dropdown-item-dot"
                                style={{ background: getEventColor(p) }}
                              />
                              {p}
                            </div>
                          ))}
                        </>
                      )}
                      {inputValue.trim() &&
                        !PRESET_EVENT_TYPES.map((x) => x.toLowerCase()).includes(
                          inputValue.trim().toLowerCase()
                        ) && (
                          <div
                            className="ai-dropdown-item"
                            style={{ color: "#b45309", fontWeight: 600 }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              addInterest(inputValue);
                            }}
                          >
                            <span
                              className="ai-dropdown-item-dot"
                              style={{ background: "#fcd34d" }}
                            />
                            Add &quot;{inputValue.trim()}&quot;
                          </div>
                        )}
                    </div>
                  )}
              </div>
            </div>

            {/* Preset pills */}
            <div className="ai-presets">
              {PRESET_EVENT_TYPES.map((p) => (
                <button
                  key={p}
                  className={`ai-preset-pill${interests.includes(p) ? " selected" : ""}`}
                  onClick={() =>
                    interests.includes(p) ? removeInterest(p) : addInterest(p)
                  }
                  disabled={!interests.includes(p) && interests.length >= 8}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* CTA row */}
            <div className="ai-cta-row">
              <p className="ai-hint">
                {interests.length === 0
                  ? "Add at least one event type to get started"
                  : `${interests.length} selected · press Enter to add custom`}
              </p>
              <button
                className="ai-btn"
                onClick={handleFetch}
                disabled={loading || interests.length === 0}
              >
                {loading ? (
                  <>
                    <span className="ai-btn-spinner" />
                    Finding events…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Get AI Suggestions
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <>
              <div className="ai-results-header">
                <span className="ai-results-title">Finding your events…</span>
              </div>
              <div className="ai-cards-grid">
                {[0, 120, 240].map((d) => (
                  <SkeletonCard key={d} delay={d} />
                ))}
              </div>
            </>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div className="ai-state-box ai-state-error">
              <div className="ai-state-icon">⚠️</div>
              <div className="ai-state-title">Something went wrong</div>
              <p className="ai-state-desc">{error}</p>
            </div>
          )}

          {/* ── No results ── */}
          {!loading && !error && hasSearched && suggestions.length === 0 && (
            <div className="ai-state-box">
              <div className="ai-state-icon">🔍</div>
              <div className="ai-state-title">No matches found</div>
              <p className="ai-state-desc">
                We couldn&apos;t find open events matching your interests right
                now. Try different event types or check back later!
              </p>
            </div>
          )}

          {/* ── Results ── */}
          {!loading && !error && suggestions.length > 0 && (
            <>
              <div className="ai-results-header">
                <span className="ai-results-title">Top picks for you</span>
                <span className="ai-results-count">
                  {suggestions.length} event{suggestions.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="ai-cards-grid">
                {suggestions.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}