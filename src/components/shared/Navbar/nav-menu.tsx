"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type Role = "USER" | "HOST" | "ADMIN" | "GUEST";

type MenuItem = {
  label: string;
  href: string;
};

const commonLinks: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Explore Events", href: "/events" },
];

const menuByRole: Record<Role, MenuItem[]> = {
  GUEST: [
    ...commonLinks,
    { label: "Become a Host", href: "/become-host" },
  ],

  USER: [
    ...commonLinks,
    { label: "Become a Host", href: "/become-host" },
    { label: "My Events", href: "/user/my-events" },
    { label: "Profile", href: "/user/profile" },
  ],

  HOST: [
    ...commonLinks,
    { label: "My Events", href: "host/my-events" },
    { label: "Create Event", href: "host/create-event" },
    { label: "Profile", href: "/host/profile" },
  ],

  ADMIN: [
    { label: "Home", href: "/" },
    { label: "Admin Dashboard", href: "/admin/admin-dashboard" },
    { label: "Manage Users", href: "/admin/manage-users" },
    { label: "Manage Hosts", href: "/admin/manage-hosts" },
    { label: "Manage Events", href: "/admin/manage-events" },
    { label: "Profile", href: "/admin/profile" },
  ],
};

export const NavMenu = (props: NavigationMenuProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return null;

  const role: Role = (session?.user?.role as Role) ?? "GUEST";
  const menuItems = menuByRole[role] ?? menuByRole.GUEST;

  const linkClasses = (path: string) =>
    pathname === path
      ? "text-yellow-700 font-semibold"
      : "hover:text-yellow-600 transition-colors";

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-2 font-medium data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {menuItems.map(({ label, href }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink asChild>
              <Link className={linkClasses(href)} href={href}>
                {label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};