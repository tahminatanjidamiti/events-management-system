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
      className="px-3 py-2 bg-indigo-600 text-white rounded"
    >
      Follow
    </button>
  );
}