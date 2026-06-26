
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
    cache: "no-store",
  });

  const { data, meta } = await res.json();
  return { events: data as IEventCreate[], meta };
};

export const getEventById = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${id}`, {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data;
};