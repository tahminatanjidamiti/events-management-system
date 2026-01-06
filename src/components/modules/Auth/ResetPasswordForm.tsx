"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm() {
    const params = useSearchParams();
    const router = useRouter();

    const token = params.get("token")!;
    const userId = params.get("userId")!;

    const { register, handleSubmit } = useForm<{ password: string }>();

    const onSubmit = async (data: { password: string }) => {
        try {
            const msg = await resetPassword(token, userId, data.password);
            toast.success(msg);
            router.push("/login");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen border dark:border-slate-700/70">
            <div className="space-y-6 w-full max-w-md p-8 rounded-lg shadow-md border dark:border-slate-700/70 mb-6">
                <h2 className="text-3xl font-bold text-center">Reset your password? Try below!</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="New password"
                        {...register("password")}
                    />
                    <Button type="submit" className="cursor-pointer bg-yellow-800 hover:bg-yellow-900 transition border-2 border-yellow-700 text-white hover:text-black">Reset Password</Button>
                </form>
            </div>
        </div >
    );
}