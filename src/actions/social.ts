"use server";
import { IFriendRequestPayload, IFriendUpdatePayload, IFollowPayload, IReviewPayload } from "@/types";


export const sendFriendRequest = async (payload: IFriendRequestPayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/friend-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to send friend request");
  return json.data;
};

export const updateFriendRequest = async (payload: IFriendUpdatePayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/friend-request`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to update friend request");
  return json.data;
};

export const followUser = async (payload: IFollowPayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to follow user");
  return json.data;
};

export const submitReview = async (payload: IReviewPayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to submit review");
  return json.data;
};