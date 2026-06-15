"use server";
import { authFetch } from "@/lib/authFetch";
import {
  IFriendRequestPayload,
  IFriendUpdatePayload,
  IFollowPayload,
  IReviewPayload,
} from "@/types";

export const sendFriendRequest = async (payload: IFriendRequestPayload) => {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/friend`, { // ✅ fixed
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to send friend request");
  return json.data;
};

export const updateFriendRequest = async (payload: IFriendUpdatePayload) => {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/friend`, { // ✅ fixed
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update friend request");
  return json.data;
};

export const followUser = async (payload: IFollowPayload) => {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to follow user");
  return json.data;
};

export const submitReview = async (payload: IReviewPayload) => {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to submit review");
  return json.data;
};

export const getFriendRequests = async (params?: Record<string, string>) => {
  const query = params && Object.keys(params).length
    ? `?${new URLSearchParams(params)}` : "";
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/social/friend${query}`,
    { cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to get Friend Requests!");
  return {
    data: Array.isArray(json.data?.data) ? json.data.data : (Array.isArray(json.data) ? json.data : []),
    meta: json.data?.meta ?? json.meta ?? null,
  };
};

export const getFollows = async (params?: Record<string, string>) => {
  const query =
    params && Object.keys(params).length
      ? `?${new URLSearchParams(params)}`
      : "";
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/social/follow${query}`,
    { cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.message || "Failed to get Followers");
  return json.data;
};

export const getSavedEvents = async (params?: Record<string, string>) => {
  const query = params && Object.keys(params).length
    ? `?${new URLSearchParams(params)}` : "";
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/social/save${query}`,
    { cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to get Saved Events!");
  return {
    data: Array.isArray(json.data?.data) ? json.data.data : (Array.isArray(json.data) ? json.data : []),
    meta: json.data?.meta ?? json.meta ?? null,
  };
};

export const getNotifications = async (params?: Record<string, string>) => {
  const query = params && Object.keys(params).length
    ? `?${new URLSearchParams(params)}` : "";
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/social/notifications${query}`,
    { cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to get Notifications!");
  return {
    data: Array.isArray(json.data?.data) ? json.data.data : (Array.isArray(json.data) ? json.data : []),
    meta: json.data?.meta ?? json.meta ?? null,
  };
};
export const markNotificationRead = async (notificationId: string) => {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/social/notifications/${notificationId}/read`,
    { method: "PATCH" }
  );
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.message || "Failed to mark notification");
  return json.data;
};