"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Skeleton from "@/components/ui/Skeleton";
import { getHosts, updateHostStatus } from "@/actions/host";
import { HostUpdateStatus, User } from "@/types";
import Swal from "sweetalert2";
import { CheckCircle2, Clock, Users } from "lucide-react";

interface HostRow {
  id: string;
  user: User;
  status: HostUpdateStatus;
  message?: string;
}

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  PENDING:  { label: "Pending",  badge: "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30" },
  APPROVED: { label: "Approved", badge: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30" },
  REJECTED: { label: "Rejected", badge: "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30" },
};

const TH = "text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap";
const TD = "px-4 py-3";

export default function AdminManageHosts() {
  const [hosts, setHosts] = useState<HostRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHosts = async () => {
    try {
      setLoading(true);
      // ✅ FIX: getHosts() already returns the array directly (json.data)
      // the old code did res.data which was undefined on an array
      const data = await getHosts();
      setHosts(Array.isArray(data) ? data : data?.data ?? []);
    } catch {
      toast.error("Failed to load host requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHosts(); }, []);

  const approveHost = async (hostId: string) => {
    const res = await Swal.fire({
      title: "Approve Host?",
      text: "This user will be promoted to HOST role.",
      icon: "question",
      background: "#ffffff",
      color: "#1e293b",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    });
    if (!res.isConfirmed) return;
    try {
      await updateHostStatus(hostId, { status: "APPROVED" });
      setHosts((prev) => prev.map((h) => h.id === hostId ? { ...h, status: "APPROVED" as HostUpdateStatus } : h));
      toast.success("Host approved successfully");
    } catch {
      toast.error("Failed to approve host");
    }
  };

  if (loading) return <div className="w-11/12 mx-auto mt-6"><Skeleton className="h-96 w-full m-4" /></div>;

  const pending  = hosts.filter(h => h.status === "PENDING").length;
  const approved = hosts.filter(h => h.status === "APPROVED").length;

  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-3 md:px-6 lg:px-8 py-6 space-y-5 max-w-screen-2xl mx-auto">

        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Host Requests
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {hosts.length} total · {pending} pending · {approved} approved
          </p>
        </div>

        {hosts.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{pending} Pending</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{approved} Approved</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{hosts.length} Total</span>
            </div>
          </div>
        )}

        {hosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
              <Users className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium">No host requests yet</p>
            <p className="text-slate-400 text-sm mt-1">Host applications will appear here</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <th className={`${TH}`}>User</th>
                    <th className={`${TH} hidden sm:table-cell`}>Email</th>
                    <th className={`${TH} hidden md:table-cell`}>Role</th>
                    <th className={`${TH}`}>Status</th>
                    <th className={`${TH}`}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-transparent">
                  {hosts.map((h) => {
                    const cfg = STATUS_CONFIG[h.status] ?? STATUS_CONFIG["PENDING"];
                    return (
                      <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">

                        <td className={TD}>
                          <div className="flex items-center gap-3">
                            {h.user.picture ? (
                              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 shrink-0">
                                <Image src={h.user.picture} alt={h.user.fullName} fill sizes="36px" className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-700 dark:text-amber-300 shrink-0">
                                {h.user.fullName?.[0]?.toUpperCase() ?? "?"}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-30 sm:max-w-40">
                                {h.user.fullName}
                              </p>
                              <p className="text-xs text-slate-400 truncate max-w-30 sm:hidden mt-0.5">
                                {h.user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className={`${TD} hidden sm:table-cell`}>
                          <span className="text-xs text-slate-600 dark:text-slate-300 truncate block max-w-45">
                            {h.user.email}
                          </span>
                        </td>

                        <td className={`${TD} hidden md:table-cell`}>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                            {h.user.role}
                          </span>
                        </td>

                        <td className={TD}>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.badge}`}>
                            {h.status === "PENDING"  && <Clock className="w-3 h-3" />}
                            {h.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                            {cfg.label}
                          </span>
                        </td>

                        <td className={TD}>
                          {h.status === "PENDING" ? (
                            <button
                              onClick={() => approveHost(h.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          ) : (
                            <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}