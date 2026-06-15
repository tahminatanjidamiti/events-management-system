"use server";
import { authFetch } from "@/lib/authFetch";

export async function updateProfile(id: string, formData: FormData) {
  try {
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/${id}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const json = await res.json();

    return json.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Server action error:", error);
    throw error;
  }
}


export const deleteUser = async (userId: string) => {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${userId}`, {
    method: "DELETE",
  });

  return res.json();
};