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

        const onlyUsers = json.data.data.filter(
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
    <div id="users" className="p-6 mt-16">
      <h1 className="text-2xl font-semibold text-center">
        Connected with Users!
      </h1>
      <p className="text-center my-4">Let&apos;s connect, make a friend and explore with each other!</p>

      <div className="w-8/12 mx-auto p-1 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded p-4 space-y-4"
          >
            <div className="gap-2">
              <Image
                src={user.picture || "/avatar.png"}
                alt={user.fullName}
                width={50}
                height={50}
                className="rounded-full object-cover ring-2 ring-yellow-500/30 w-12.5! h-12.5!"
              />
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-gray-500">
                  {user.interests.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              <Link
                href={`/${user.id}`}
                className="text-xs px-1 py-1 border-4 border-amber-700 rounded flex justify-center items-center hover:bg-amber-400"
              >
                View
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