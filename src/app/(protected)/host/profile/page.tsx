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

  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getUserById(session.user.id);
        setUser(data.data);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session?.user?.id]);

  const displayName = user?.fullName ?? session?.user?.fullName;
  const displayPicture = user?.picture ?? session?.user?.picture;
  const displayEmail = user?.email ?? session?.user?.email;
  const displayPhone = user?.phone ?? session?.user?.phone;
  const displayRole = user?.role ?? session?.user?.role;
  const displayStatus = user?.status ?? session?.user?.status;
  const displayIsVerified = user?.isVerified ?? session?.user?.isVerified;
  const displayBio = user?.bio ?? session?.user?.bio;



  return (
    <div className="min-h-screen w-11/12 mx-auto flex flex-col items-center p-6">

      {displayPicture && (
        displayPicture.startsWith("blob:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayPicture}
            alt="Profile Picture"
            className="w-24 h-24 rounded-2xl border-2 border-yellow-700 object-cover"
          />
        ) : (
          <Image
            className="rounded-2xl border-2 border-yellow-700"
            width={100}
            height={100}
            src={displayPicture}
            alt="Profile Picture"
          />
        )
      )}

      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-gray-700 from-5% via-amber-500 to-gray-700 mb-4">
        Welcome, {displayName}!
      </h1>

      <p className="text-lg text-center">
        Email: <span className="italic">{displayEmail}</span>
      </p>
      {displayPhone && (
        <p className="text-center">
          Phone: <span className="italic">{displayPhone}</span>
        </p>
      )}
      <p className="font-bold text-center">
        Role: <span className="text-yellow-700 italic">{displayRole}</span>
      </p>
      <p className="text-center">
        Status: <span className="text-green-700 italic">{displayStatus}</span>
      </p>
      {displayIsVerified === true && (
        <p className="text-center">Verified: ☑️</p>
      )}
      {displayBio && (
        <p className="text-center">
          Bio: <span className="text-gray-700 italic">{displayBio}</span>
        </p>
      )}

      <h2 className="text-3xl font-bold text-center mt-10 mb-6 border-t dark:border-slate-700/70 pt-6">
        Update your profile? Try below!
      </h2>

      {loading ? (
        <div className="w-8/12 mx-auto space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : user ? (
        <UserForm
          key={user.id}
          user={user}
          onSubmit={async (formData) => {
            try {
              await updateProfile(user!.id, formData);
              const refreshed = await getUserById(user!.id);
              setUser(refreshed.data);

              await updateSession({
                ...session,
                user: { ...session?.user, ...refreshed.data },
              });

              toast.success("Profile updated!");
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              toast.error(err?.message || "Failed to update profile");
            }
          }}
        />
      ) : (
        <div className="w-8/12 mx-auto space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}
    </div>
  );
}