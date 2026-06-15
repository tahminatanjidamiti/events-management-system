"use server";
import { FieldValues } from "react-hook-form";

export const register = async (data: FieldValues) => {
  const formData = new FormData();

  formData.append("data", JSON.stringify(data));
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/register`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const responseData = await res.json();

  if (!res.ok || !responseData.success) {
    throw new Error(responseData.message || "Registration failed");
  }

  return {
    success: true,
    message: responseData.message,
    data: responseData.data,
  };
};

export const login = async (data: FieldValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const responseData = await res.json();

  if (!res.ok || !responseData.success) {
    throw new Error(responseData.message || "Login failed");
  }

  return {
    success: true,
    message: responseData.message,
    data: responseData.data,
  };
};

export const refreshAccessToken = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error("Session expired");
  }

  return data;
};

export const forgotPassword = async (email: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to send reset email");
  }

  return data.message;
};
export const resetPassword = async (
  token: string,
  id: string,
  password: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, password }),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Password reset failed");
  }

  return data.message;
};
