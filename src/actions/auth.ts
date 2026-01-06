"use server";
import { FieldValues } from "react-hook-form";

export const register = async (data: FieldValues) => {
  const formData = new FormData();

  formData.append("data", JSON.stringify(data));
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/register`, {
    method: "POST",
    body: formData,
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

