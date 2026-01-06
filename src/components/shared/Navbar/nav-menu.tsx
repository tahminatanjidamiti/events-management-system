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
    { label: "Become a Host", href: "/behost" },
  ],

  USER: [
    ...commonLinks,
    { label: "Become a Host", href: "/behost" },
    { label: "My Events", href: "/myevents" },
    { label: "Profile", href: "/profile" },
  ],

  HOST: [
    ...commonLinks,
    { label: "My Events", href: "/myevents" },
    { label: "Create Event", href: "/createevent" },
    { label: "Profile", href: "/profile" },
  ],

  ADMIN: [
    { label: "Home", href: "/" },
    { label: "Admin Dashboard", href: "/admindashboard" },
    { label: "Manage Users", href: "/manageusers" },
    { label: "Manage Hosts", href: "/managehosts" },
    { label: "Manage Events", href: "/manageevents" },
    { label: "Profile", href: "/profile" },
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