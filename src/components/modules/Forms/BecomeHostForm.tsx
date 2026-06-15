"use client";

import { becomeHost } from "@/actions/host";
import { useState } from "react";
import { toast } from "sonner";

export default function BecomeHostForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please write a message");
      return;
    }

    try {
      setLoading(true);

      await becomeHost({ message });

      toast.success("Host request submitted successfully 🎉");
      setMessage("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg space-y-4 rounded-xl border p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">Become a Host</h2>
      <p className="text-xs mt-2">
        Tip: Require userId, if you are not logged in first try to login as a USER!
      </p>
      <textarea
        className="textarea border w-full p-1"
        rows={5}
        placeholder="Why do you want to become a host?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
      />

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
