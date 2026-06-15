

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

  const { data, meta } = await res.json();
  return { reviews: data, meta };
};
