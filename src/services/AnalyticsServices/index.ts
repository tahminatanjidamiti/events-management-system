

export const getDashboardMetadata = async (
  options?: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  }
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/metadata`, {
    cache: "no-store",
    ...options,
  });

  return res.json();
};