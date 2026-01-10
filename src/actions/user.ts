"use server";

import { toast } from "sonner";

export async function updateProfile(id: string, formData: FormData) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Update failed:", errorData);
      throw new Error(errorData.message || "Failed to update user");
    }

    const updatedUser = await res.json();
    return updatedUser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Server action error:", error);
    toast.error(error.message || "Failed to update user");
    throw error;
  }
}