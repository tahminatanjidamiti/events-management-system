import { IEventCreate } from "@/types";


export const getAllEvents = async (
  options?: RequestInit & {
    params?: Record<string, string>;
    next?: { revalidate?: number; tags?: string[] };
  }
) => {
  const query = options?.params
    ? `?${new URLSearchParams(options.params)}`
    : "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event${query}`, {
    ...options,
  });

  const { data, meta } = await res.json();
  return { events: data as IEventCreate[], meta };
};

export const getEventById = async (eventId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${eventId}`);

  return res.json();
};

export const getMyEvents = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/me`, {
    cache: "no-store",
  });

  return res.json();
};

export const deleteEvent = async (eventId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${eventId}`, {
    method: "DELETE",
  });

  return res.json();
};
