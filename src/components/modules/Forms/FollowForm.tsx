"use client";

import { useState } from "react";
import { IFollowPayload } from "@/types";
import { toast } from "sonner";
import { followUser } from "@/actions/social";

export default function FollowForm({
  followingId,
}: {
  followingId: string;
}) {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const payload: IFollowPayload = {
        followingId,
      };

      await followUser(payload);
      toast.success("Now following user");
    } catch {
      toast.error("Failed to follow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={submit}
      className="text-xs px-1 py-1 hover:bg-orange-400 border-4 border-yellow-800 rounded"
    >
      Follow
    </button>
  );
}