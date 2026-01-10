"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Skeleton from "@/components/ui/Skeleton";
import { updateHostStatus } from "@/actions/host";
import { HostUpdateStatus, User } from "@/types";
import Swal from "sweetalert2";
import { getHosts } from "@/services/HostServices";

interface HostRow {
    id: string;
    user: User;
    status: HostUpdateStatus;
}

export default function AdminManageHosts() {
    const [hosts, setHosts] = useState<HostRow[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHosts = async () => {
        try {
            setLoading(true);
            const res = await getHosts();
            setHosts(res.data || []);
        } catch {
            toast.error("Failed to load host requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHosts();
    }, []);

    const approveHost = async (hostId: string) => {
        Swal.fire({
            title: "Approve Host?",
            text: "This user will be promoted to HOST",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Approve",
        }).then(async (res) => {
            if (!res.isConfirmed) return;

            try {
                await updateHostStatus(hostId, { status: "APPROVED" });

                setHosts((prev) =>
                    prev.map((h) =>
                        h.id === hostId ? { ...h, status: "APPROVED" } : h
                    )
                );

                toast.success("Host approved successfully");
            } catch {
                toast.error("Failed to approve host");
            }
        });
    };

    if (loading) return <Skeleton className="h-8 w-full m-4" />;

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Host Requests</h1>

            <table className="w-full border border-gray-200 rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">Picture</th>
                        <th className="p-2 text-left">Full Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Role</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {hosts.map((h) => (
                        <tr key={h.id} className="border-t">
                            <td className="p-2">
                                {h.user.picture ? (
                                    <Image
                                        width={50}
                                        height={50}
                                        src={h.user.picture}
                                        alt={h.user.fullName}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                                )}
                            </td>

                            <td className="p-2">{h.user.fullName}</td>
                            <td className="p-2">{h.user.email}</td>
                            <td className="p-2">{h.user.role}</td>
                            <td className="p-2">
                                <span
                                    className={
                                        h.status === "APPROVED"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                    }
                                >
                                    {h.status}
                                </span>
                            </td>

                            <td className="p-2">
                                {h.status === "PENDING" && (
                                    <button
                                        onClick={() => approveHost(h.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Approve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}