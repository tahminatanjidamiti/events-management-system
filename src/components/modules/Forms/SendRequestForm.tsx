"use client";

import { useState } from "react";
import { IFriendRequestPayload } from "@/types";
import { toast } from "sonner";
import { sendFriendRequest } from "@/actions/social";

export default function SendRequestForm({
  receiverId,
}: {
  receiverId: string;
}) {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const payload: IFriendRequestPayload = {
        receiverId,
      };

      await sendFriendRequest(payload);
      toast.success("Friend request sent");
    } catch {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={submit}
      className="px-3 py-2 bg-blue-600 text-white rounded"
    >
      Send Friend Request
    </button>
  );
}