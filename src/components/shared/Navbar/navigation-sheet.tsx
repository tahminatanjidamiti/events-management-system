import { Button } from "@/components/ui/button";
import { Sheet, SheetTitle, SheetDescription, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavMenu } from "./nav-menu";
import Link from "next/link";
import { Logo } from "./logo";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">
          EventsVibe Menu
        </SheetTitle>

        <SheetDescription className="sr-only">
          User navigation and account actions
        </SheetDescription>
        <Link className="mt-2 ml-1" href="/">
          <Logo />
        </Link>
        <NavMenu orientation="vertical" />
      </SheetContent>
    </Sheet>
  );
};
