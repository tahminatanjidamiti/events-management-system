"use server";
import { authFetch } from "@/lib/authFetch";

export const getDashboardMetadata = async () => {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/metadata`, {
    cache: "no-store",
  });
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to Get Analytics Data!");
  }

  return {
    barData: Array.isArray(json.data?.barData) ? json.data.barData : [],
    pieData: Array.isArray(json.data?.pieData) ? json.data.pieData : [],
  };
};