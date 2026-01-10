"use server";
import { IHostCreate, IHostUpdate } from "@/types";


export const becomeHost = async (data?: IHostCreate) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/host`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data || {}),
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to become host");
  return json.data;
};

export const updateHostStatus = async (id: string, data: IHostUpdate) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/host/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update host");
  return json.data;
};