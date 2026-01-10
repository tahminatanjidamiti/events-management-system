"use client";

import { updateFriendRequest } from "@/actions/social";
import { IFriendUpdatePayload } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export default function UpdateFriendForm({
  requestId,
}: {
  requestId: string;
}) {
  const [loading, setLoading] = useState(false);

  const submit = async (action: "accept" | "reject") => {
    try {
      setLoading(true);

      const payload: IFriendUpdatePayload = {
        requestId,
        action,
      };

      await updateFriendRequest(payload);
      toast.success(`Request ${action}ed`);
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => submit("accept")}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Accept
      </button>
      <button
        disabled={loading}
        onClick={() => submit("reject")}
        className="px-3 py-1 bg-gray-600 text-white rounded"
      >
        Reject
      </button>
    </div>
  );
}