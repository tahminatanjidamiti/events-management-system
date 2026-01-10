"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/types";

export default function UserDetailsPage() {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API}/user/${userId}`
                );
                const json = await res.json();
                if (!json.success) throw new Error();
                setUser(json.data);
            } catch {
                toast.error("Failed to load user");
            }
        };

        load();
    }, [userId]);

    if (!user) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-xl mx-auto space-y-4">
            <Image
                src={user.picture || "/avatar.png"}
                alt={user.fullName}
                width={96}
                height={96}
                className="rounded-full"
            />
            {(user?.fullName) && <h1 className="text-2xl font-semibold">
                Full Name: {user?.fullName}
            </h1>}

            <p className="text-lg text-center">
                Email: <span className="italic">{user?.email}</span>
            </p>
            {(user?.phone) && <p className="text-center">
                Phone: <span className="italic">{user?.phone}</span>
            </p>}
            <p className="font-bold text-center">Role: <span className="text-yellow-700 italic">{user?.role}</span></p>
            <p className="text-center">Status: <span className="text-green-700 italic">{user?.status}</span></p>
            {user?.isVerified === true && (
                <p className="text-center">
                    Verified: ☑️
                </p>
            )}
            {(user?.bio) && <p className="text-center">Bio: <span className="text-gray-700 italic">{user?.bio}</span></p>}
            {(user?.interests) && <p>
                <strong>Interests:</strong>{" "}
                {user.interests.join(", ")}
            </p>}
            {(user?.city) &&<p>
                <strong>City:</strong>{" "}
                {user.city.formattedAddress}
            </p>}
        </div>
    );
}