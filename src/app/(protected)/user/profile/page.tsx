"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import UserForm from "@/components/modules/Forms/UserForm";
import { getUserById } from "@/services/UserServices";
import { updateProfile } from "@/actions/user";
import { User } from "@/types";
import Skeleton from "@/components/ui/Skeleton";
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(session.user.id);
        setUser(data);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session?.user?.id]);

  if (loading) return <Skeleton className="h-96 w-full m-4" />;


  return (
    <div className="min-h-screen w-11/12 mx-auto flex flex-col items-center p-6">
      {(session?.user?.picture) &&
        <Image className="rounded-4xl border-2 border-yellow-700" width={100}
          height={100} src={session?.user?.picture} alt="Profile Picture"></Image>}
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-gray-700 from-5% via-amber-500 to-gray-700 mb-4">
        Welcome, {session?.user?.fullName}!
      </h1>
      <p className="text-lg text-center">
        Email: <span className="italic">{session?.user?.email}</span>
      </p>
      {(session?.user?.phone) && <p className="text-center">
        Phone: <span className="italic">{session?.user?.phone}</span>
      </p>}
      <p className="font-bold text-center">Role: <span className="text-yellow-700 italic">{session?.user?.role}</span></p>
      <p className="text-center">Status: <span className="text-green-700 italic">{session?.user?.status}</span></p>
      {session?.user?.isVerified === true && (
        <p className="text-center">
          Verified: ☑️
        </p>
      )}
      {(session?.user?.bio) && <p className="text-center">Bio: <span className="text-gray-700 italic">{session?.user?.bio}</span></p>}
      <h2 className="text-3xl font-bold text-center mt-10 mb-2 border-top dark:border-slate-700/70">Update your profile? Try below!</h2>
      <UserForm user={user} onSubmit={async (formData) => {
        await updateProfile(user!.id, formData);
        const refreshed = await getUserById(user!.id);
        setUser(refreshed.data ?? refreshed);
      }} />
    </div>
  );
}

