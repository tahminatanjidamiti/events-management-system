"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LogOut, BookCheck, User, Users, ProjectorIcon, ChartBar, Group } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN"
  const isHost = session?.user?.role === "HOST"
  const isUser = session?.user?.role === "USER"
  return (
    <aside className="flex h-screen w-42 md:w-64 flex-col border-r">

      {isAdmin && (
        <nav className="flex-1 space-y-2 p-1 md:p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/admin/admin-dashboard"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-gray-100 hover:text-black"
          >
            <ChartBar className="h-4 w-4" />
            Admin Dashboard
          </Link>
          <Link
            href="/admin/manage-users"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Link>
          <Link
            href="/admin/manage-hosts"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-gray-100 hover:text-black"
          >
            <BookCheck className="h-4 w-4" />
            Manage Hosts
          </Link>
          <Link
            href="/admin/manage-events"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <ProjectorIcon className="h-4 w-4" />
            Manage Events
          </Link>
          <Link
            href="/admin/profile"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-gray-100 hover:text-black"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </nav>
      )}
      {isHost && (
        <nav className="flex-1 space-y-2 p-1 md:p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/host/my-events"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-gray-100 hover:text-black"
          >
            <ProjectorIcon className="h-4 w-4" />
            My Events
          </Link>
          <Link
            href="/host/events"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <BookCheck className="h-4 w-4" />
            Manage Events
          </Link>
          <Link
            href="/host/host-analytics"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-gray-100 hover:text-black"
          >
            <ChartBar className="h-4 w-4" />
            Host Analytics
          </Link>

          <Link
            href="/host/profile"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </nav>
      )}
      {isUser && (
        <nav className="flex-1 space-y-2 p-1 md:p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/become-host"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-gray-100 hover:text-black"
          >
            <User className="h-4 w-4" />
            Become a Host
          </Link>
          <Link
            href="/user/my-events"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <ProjectorIcon className="h-4 w-4" />
            My Events
          </Link>
          <Link
            href="/user/user-analytics"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-gray-100 hover:text-black"
          >
            <ChartBar className="h-4 w-4" />
            User Analytics
          </Link>

          <Link
            href="/user/profile"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-yellow-200 hover:text-black"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/user/user-social"
            className="flex items-center gap-2 rounded-lg p-1 md:px-3 md:py-2 text-sm font-medium hover:bg-gray-100 hover:text-black"
          >
            <Group className="h-4 w-4" />
            Social
          </Link>
        </nav>
      )}
      <div className="p-4 border-t border-gray-500">
        {status === "authenticated" && (
          <Button
            className="w-full justify-start gap-2 cursor-pointer bg-yellow-800 hover:bg-yellow-700 transition border-2 border-amber-500"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
    </aside>
  );
}
