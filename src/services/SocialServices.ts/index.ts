

export const getFriendRequests = async (
  options?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  }
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/friend`, {
    ...options,
  });

  return res.json();
};

export const getFollows = async (
  options?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  }
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/follow`, {
    ...options,
  });

  return res.json();
};

export const getSavedEvents = async (
  options?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  }
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/save`, {
    ...options,
  });

  return res.json();
};

export const getReviews = async (
  options?: RequestInit & {
    params?: Record<string, string>;
    next?: { revalidate?: number; tags?: string[] };
  }
) => {
  const query = options?.params
    ? `?${new URLSearchParams(options.params)}`
    : "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/review${query}`, {
    ...options,
  });

  return res.json();
};


export const getNotifications = async (
  options?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  }
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social/notifications`, {
    cache: "no-store",
    ...options,
  });

  return res.json();
};