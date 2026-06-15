"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/types";
import Skeleton from "@/components/ui/Skeleton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${id}`);
                const json = await res.json();
                if (!json.success) throw new Error();
                setUser(json.data);
            } catch {
                toast.error("Failed to load user");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return (
        <div className="w-8/12 mx-auto space-y-4 m-16">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
        </div>
    );

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">User not found.</p>
        </div>
    );

    return (
        <div className="flex items-start justify-center p-8 mt-12">
            <div className="w-full max-w-lg lg:max-w-2xl border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm">

                <div className="px-6 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700/70 flex gap-4 items-start">
                    <div className="relative shrink-0">
                        <Image
                            src={user.picture || "/avatar.png"}
                            alt={user.fullName}
                            width={72}
                            height={72}
                            loading="eager"
                            className="w-18 h-18 rounded-full object-cover border-2 border-amber-500"
                        />
                        <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-lg font-semibold truncate">{user.fullName}</h1>
                            {user.isVerified && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500 font-medium">
                                    Verified ✓
                                </span>
                            )}
                        </div>

                        {user.bio && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">{user.bio}</p>
                        )}

                        <div className="flex gap-2 mt-3 flex-wrap">
                            <span className="text-xs text-yellow-800 px-2.5 py-1 rounded-full bg-yellow-200 border-amber-500 ">
                                {user.role}
                            </span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700/40">
                                {user.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700/50 px-6">

                    <div className="flex items-center gap-3 py-3.5">
                        <span className="text-amber-500 w-5 text-base">✉</span>
                        <span className="text-sm text-slate-500 w-20 shrink-0">Email</span>
                        <span className="text-sm italic text-slate-700 dark:text-slate-300 truncate">{user.email}</span>
                    </div>

                    {user.phone && (
                        <div className="flex items-center gap-3 py-3.5">
                            <span className="text-amber-500 w-5 text-base">📞</span>
                            <span className="text-sm text-slate-500 w-20 shrink-0">Phone</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{user.phone}</span>
                        </div>
                    )}

                    {user.interests?.length > 0 && (
                        <div className="flex items-start gap-3 py-3.5">
                            <span className="text-amber-500 w-5 text-base mt-0.5">💡</span>
                            <span className="text-sm text-slate-500 w-20 shrink-0 mt-0.5">Interests</span>
                            <div className="flex gap-1.5 flex-wrap">
                                {user.interests.map((interest) => (
                                    <span
                                        key={interest}
                                        className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {user.city && (
                        <div className="flex items-center gap-3 py-3.5">
                            <span className="text-slate-400 w-5 text-base">📍</span>
                            <span className="text-sm text-slate-500 w-20 shrink-0">City</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{user.city.formattedAddress}</span>
                        </div>
                    )}

                </div>
                <div>
                    <button
                    onClick={() => router.back()}
                    className="inline-flex items-center bg-amber-500 px-2.5 py-1 rounded-r-xl gap-1.5 text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                </div>
            </div>
             
        </div>
    );
}