"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { register } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { signIn } from "next-auth/react";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required"),

  email: z.email(),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;


export default function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const router = useRouter();
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const res = await register(values);

        toast.success(res.message); 
        router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSocialRegister = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: "/login",
    })
  };


  return (
    <div className="flex justify-center items-center min-h-screen border dark:border-slate-700/70">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md p-8 rounded-lg shadow-md border dark:border-slate-700/70 my-16"
        >
          <h2 className="text-3xl font-bold text-center">Register Now</h2>
          {/* Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2 bg-linear-to-r from-yellow-700 via-amber-500 to-yellow-700 border-2 border-yellow-700 transition hover:scale-[1.02]">
            Register
          </Button>

          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleSocialRegister("google")
              }
            >

              <Image
                src="https://img.icons8.com/color/24/google-logo.png"
                alt="Google"
                className="w-5 h-5"
                width={20}
                height={20}
              />
              Register with Google
            </Button>
          </div>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}