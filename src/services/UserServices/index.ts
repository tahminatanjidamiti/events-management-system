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

  const { data, meta } = await res.json();
  return { users: data as User[], meta };
};


export const getUserById = async (userId: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_API}/user/${userId}`;
  console.log("FETCHING URL 👉", url);

  const res = await fetch(url);

  return res.json();
};

export const deleteUser = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${userId}`, {
    method: "DELETE",
  });

  return res.json();
};