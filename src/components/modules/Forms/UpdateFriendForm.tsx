"use client";

import { updateFriendRequest } from "@/actions/social";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Check, X, UserCheck } from "lucide-react";

export default function UpdateFriendForm({
  requestId,
  status,
  onSuccess,
  onStatusChange,
  requestorName,
  requestorPicture,
}: {
  requestId: string;
  status: string;
  onSuccess: () => void;
  onStatusChange: (newStatus: string) => void;
  requestorName?: string;
  requestorPicture?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handle = async (action: "accept" | "reject") => {
    setLoading(true);
    try {
      await updateFriendRequest({ requestId, action });
      const newStatus = action === "accept" ? "ACCEPTED" : "REJECTED";
      toast.success(action === "accept" ? "Friend request accepted!" : "Request rejected");
      onStatusChange(newStatus);
      if (action === "reject") onSuccess();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "Failed to update request");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ CHANGE: flex-col on mobile so buttons go below name, flex-row on sm+
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all">

      {/* Avatar + name */}
      <div className="flex items-center gap-3 min-w-0">
        {requestorPicture ? (
          <Image
            src={requestorPicture}
            alt={requestorName ?? "User"}
            width={40}
            height={40}
            className="rounded-full object-cover ring-2 ring-yellow-500/30 shrink-0"
          />
        ) : (
          <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-sm font-bold text-white ring-2 ring-yellow-500/30">
            {requestorName?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-medium text-white text-sm truncate">{requestorName ?? "Unknown User"}</p>
          <p className={`text-xs font-medium ${
            status === "ACCEPTED" ? "text-green-400" :
            status === "REJECTED" ? "text-red-400" :
            "text-slate-400"
          }`}>
            {status === "ACCEPTED" ? "✓ Friends" :
             status === "REJECTED" ? "✗ Rejected" :
             "Pending request"}
          </p>
        </div>
      </div>

      {/* Buttons — full width on mobile, auto on sm+ */}
      <div className="flex gap-2 w-full flex-col md:flex-row sm:w-auto shrink-0">
        {status === "ACCEPTED" ? (
          <>
            <button
              disabled
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 opacity-60 cursor-not-allowed"
            >
              <UserCheck className="w-3 h-3" />
              Accepted
            </button>
            <button
              onClick={() => handle("reject")}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X className="w-3 h-3" />
              {loading ? "..." : "Remove"}
            </button>
          </>
        ) : status === "REQUESTED" ? (
          <>
            <button
              onClick={() => handle("accept")}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="w-3 h-3" />
              {loading ? "..." : "Accept"}
            </button>
            <button
              onClick={() => handle("reject")}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X className="w-3 h-3" />
              {loading ? "..." : "Reject"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}