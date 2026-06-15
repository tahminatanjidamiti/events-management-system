"use client";

import { deleteUser } from "@/actions/user";
import Skeleton from "@/components/ui/Skeleton";
import { getAllUsers } from "@/services/UserServices";
import { User } from "@/types";
import { Trash2, ShieldCheck, ShieldOff, Users, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [search, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { users } = await getAllUsers({ cache: "no-store" });
      setUsers(users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      background: "#0f172a",
      color: "#f8fafc",
      showCancelButton: true,
      confirmButtonColor: "#b45309",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, delete",
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      try {
        const result = await deleteUser(userId);
        if (!result.success) throw new Error(result.message);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success("User deleted successfully");
      } catch {
        toast.error("Failed to delete user");
      }
    });
  };

  const userCount = users.filter((u) => u.role === "USER").length;
  const hostCount = users.filter((u) => u.role === "HOST").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  if (loading) return <div className="w-11/12 mx-auto mt-6"><Skeleton className="h-96 w-full m-4" /></div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-700 via-yellow-700 to-gray-700">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 w-11/12 mx-auto px-4 md:px-8 py-10 space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-500 from-25% via-[#EC5A28] to-65% to-amber-500">
            Manage Users
          </h1>
          <p className="text-sm">
            {userCount} user{userCount !== 1 ? "s" : ""},{" "}
            {hostCount} host{hostCount !== 1 ? "s" : ""} and{" "}
            {adminCount} admin{adminCount !== 1 ? "s" : ""} of{" "}
            {users.length} Users!
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-black focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-14 h-14 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 hover:bg-white/10 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
              >
                {u.isVerified && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60 ring-2 ring-slate-900" />
                )}
                <div className="flex justify-center">
                  {u.picture ? (
                    <div className="relative w-16 h-16 rounded-full ring-2 ring-white/10 group-hover:ring-amber-500/40 transition-all overflow-hidden">
                      <Image
                        src={u.picture}
                        alt={u.fullName ?? "User"}
                        fill
                        sizes="64px"
                        className="object-cover"
                        loading="eager"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-500/30 to-orange-600/30 border border-amber-500/20 flex items-center justify-center text-xl font-bold text-amber-300 group-hover:from-amber-500/40 group-hover:to-orange-600/40 transition-all">
                      {u.fullName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>

                <div className="text-center space-y-1 flex-1">
                  <p className="font-semibold text-white text-sm leading-tight truncate">
                    {u.fullName ?? "Unknown"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>

                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    {u.role}
                  </span>

                  <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${u.status === "ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                        : "bg-slate-500/15 text-slate-400 border-slate-500/25"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${u.status === "ACTIVE" ? "bg-emerald-400" : "bg-slate-500"
                          }`}
                      />
                      {u.status}
                    </span>

                    {u.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/25">
                        <ShieldOff className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(u.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-yellow-700 text-black border border-amber-700 hover:bg-yellow-700 hover:border-yellow-500 hover:text-white transition-all duration-200 group/btn"
                >
                  <Trash2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}