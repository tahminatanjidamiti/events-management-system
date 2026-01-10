"use server";
import { IEventCreate } from "@/types";


export const createEvent = async (data: IEventCreate, file?: File) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (file) formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to create event");
  return json.data;
};

export const updateEvent = async (id: string, data: IEventCreate, file?: File) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (file) formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${id}`, {
    method: "PATCH",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update event");
  return json.data;
};

export const joinEvent = async (eventId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to join event");
  return json.data;
};

export const getAISuggestions = async (prompt: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/suggestion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to get AI suggestions");
  return json.data;
};