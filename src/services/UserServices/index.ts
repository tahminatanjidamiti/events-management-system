import { User } from "@/types";

export const getAllUsers = async (
  options?: RequestInit & {
    params?: Record<string, string>;
  }
) => {
  const query = options?.params
    ? `?${new URLSearchParams(options.params)}`
    : "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user${query}`, {
    ...options,
  });

  const json = await res.json();

  return {
    users: json.data.data as User[],
    meta: json.data.meta,
  };
};


export const getUserById = async (userId: string) => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${userId}`);
  return res.json();
};

