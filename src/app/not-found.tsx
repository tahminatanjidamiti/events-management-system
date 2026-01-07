"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-yellow-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-yellow-800">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-yellow-700">
          Page not found
        </h2>
        <p className="mt-2 text-yellow-900">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <div className="mt-6">
          <Button asChild className="hover:bg-yellow-700 border-4 border-yellow-800">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
