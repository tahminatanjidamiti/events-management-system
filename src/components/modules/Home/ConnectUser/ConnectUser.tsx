"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { User } from "@/types";
import FollowForm from "../../Forms/FollowForm";
import SendRequestForm from "../../Forms/SendRequestForm";

export default function ConnectUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/user`
        );
        const json = await res.json();

        if (!json.success) throw new Error();

        const onlyUsers = json.data.filter(
          (u: User) => u.role === "USER"
        );

        setUsers(onlyUsers);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Connected with Users!
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded p-4 space-y-4"
          >
            <div className="flex items-center gap-3">
              <Image
                src={user.picture || "/avatar.png"}
                alt={user.fullName}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-gray-500">
                  {user.interests.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`/home/details/${user.id}`}
                className="px-3 py-2 bg-gray-200 rounded text-center"
              >
                Details
              </Link>

              <SendRequestForm receiverId={user.id} />

              <FollowForm followingId={user.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}