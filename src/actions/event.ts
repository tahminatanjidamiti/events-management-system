"use server";
import { authFetch } from "@/lib/authFetch";

export const getMyEvents = async () => {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/event/me`,
    { cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.message || "Failed to GET my events");

  const payload = json.data;
  return Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
};
export const createEvent = async (formData: FormData) => {
  try {
    const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/event`, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Failed to create event");
    return json.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Server action error:", error);
    throw error;
  }
}


export const updateEvent = async (id: string, formData: FormData) => {
  try {
    const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${id}`, {
      method: "PATCH",
      body: formData,
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Failed to update event");
    return json.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Server action error:", error);
    throw error;
  }
}

export const joinEvent = async (eventId: string) => {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to join event");
  return json.data;
};


export const deleteEvent = async (eventId: string) => {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${eventId}`, {
    method: "DELETE",
  });

  return res.json();
};

export const getAISuggestions = async (interests: string[]) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/suggestion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interests }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to get AI suggestions");
  return json.data;
};
