"use client";

import Skeleton from "@/components/ui/Skeleton";
import { User } from "@/types";
import { Delete } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { getAllUsers, deleteUser } from "@/services/UserServices";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { users } = await getAllUsers({
        params: {
          searchTerm: search,
        },
        cache: "no-store",
      });

      setUsers(users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search,]);

  const handleDelete = (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        const result = await deleteUser(userId);

        if (!result.success) {
          throw new Error(result.message);
        }

        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success("User deleted successfully");
      } catch {
        toast.error("Failed to delete user");
      }
    });
  };

  if (loading) return <Skeleton className="h-8 w-full m-4" />;

  return (
    <div className="p-6 space-y-4">
      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full max-w-sm"
      />

      {users.map((u) => (
        <div
          key={u.id}
          className="flex justify-between items-center border p-3 rounded"
        >
          <div className="space-y-1">
            <p className="font-medium">
              {u.fullName} ({u.role})
            </p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="text-sm">
              Status:{" "}
              <span
                className={
                  u.status === "ACTIVE"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {u.status}
              </span>
            </p>
          </div>

          <button
            className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-1"
            onClick={() => handleDelete(u.id)}
          >
            <Delete size={16} />
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}