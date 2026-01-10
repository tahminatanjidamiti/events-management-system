"use server";

export const createPaymentSession = async (eventId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/payment/create-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Failed to create payment session");
  return json.data;
};