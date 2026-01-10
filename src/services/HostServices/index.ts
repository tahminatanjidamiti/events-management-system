export const getHosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/host`, {
    cache: "no-store",
  });

  return res.json();
};

export const getHostById = async (hostId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/host/${hostId}`);

  return res.json();
};