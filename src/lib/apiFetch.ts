import { refreshAccessToken } from "@/actions/auth";

export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      await refreshAccessToken();
      const retryRes = await fetch(url, {
        ...options,
        credentials: "include",
      });

      return retryRes;
    } catch {
      throw new Error("Session expired. Please login again.");
    }
  }

  return res;
};