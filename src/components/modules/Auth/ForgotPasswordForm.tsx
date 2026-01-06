"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { forgotPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordForm() {
    const { register, handleSubmit } = useForm<{ email: string }>();

    const onSubmit = async (data: { email: string }) => {
        try {
            const msg = await forgotPassword(data.email);
            toast.success(msg);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen border dark:border-slate-700/70">
            <div className="space-y-6 w-full max-w-md p-8 rounded-lg shadow-md border dark:border-slate-700/70 mb-6">
            <h2 className="text-3xl font-bold text-center">Forget your password? Try below!</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Enter your email" {...register("email")} />
                    <Button type="submit" className="cursor-pointer bg-yellow-800 hover:bg-yellow-900 transition border-2 border-yellow-700 text-white hover:text-black">Send Reset Link</Button>
                </form>
            </div>
        </div >
    );
}