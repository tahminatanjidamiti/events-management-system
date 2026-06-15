"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";
import { refreshAccessToken } from "@/actions/auth";

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    // console.error("authFetch: no session found for", url);
    throw new Error("Session expired. Please login again.");
  }

  const accessToken = session.accessToken;

  if (!accessToken) {
    //console.error("authFetch: session exists but no accessToken for", url);
    throw new Error("Session expired. Please login again.");
  }

  // console.log("authFetch: calling", url, "with token", accessToken.slice(0, 20) + "..."); // confirm token exists

  const makeRequest = (token: string) =>
    fetch(url, {
      ...options,
      cache: "no-store",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  let res = await makeRequest(accessToken);

  if (res.status === 401) {
    try {
      const refreshData = await refreshAccessToken();
      const newToken = refreshData?.data?.accessToken;
      if (!newToken) throw new Error("No new token");
      res = await makeRequest(newToken);
    } catch {
      throw new Error("Session expired. Please login again.");
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }

  return res;
};