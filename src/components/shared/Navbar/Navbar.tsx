"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { Sheet, SheetTitle, SheetDescription, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CircleEllipsis } from "lucide-react";
import { ModeToggle } from "./ModeToggle";


const Navbar = () => {
 
  return (
    <nav className="sticky top-7 inset-x-4 h-16 max-w-7xl mx-auto rounded-full bg-background border dark:border-slate-700/70 z-30">
      <div className="flex h-full items-center justify-between px-6 md:px-8">
        <div className="flex justify-center items-center gap-1">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>
          <h1 className="hidden md:block font-semibold text-transparent bg-clip-text bg-linear-to-r from-gray-700 from-5% via-amber-500 to-gray-700 pr-1"><i>EventsVibe</i></h1>
        </div>
        <NavMenu className="hidden md:block" />
        <div className="flex items-center gap-4 md:gap-6">
          <div className="border-3 border-yellow-700 rounded-full">
            <ModeToggle />
          </div>
          <div className="md:hidden">
            <NavigationSheet />
          </div>

          {/* CircleEllipsis Sidebar */}
          <Sheet>
            <SheetTrigger>
              <CircleEllipsis
                className="border-2 border-yellow-700  rounded-full w-10 h-10 text-yellow-800 cursor-pointer hover:text-primary transition-colors"
                strokeWidth={1.8}
              />
            </SheetTrigger>
            <SheetTitle className="sr-only">Hidden Title</SheetTitle>
            <SheetDescription className="sr-only">Hidden Description</SheetDescription>
            <SheetContent
              side="right"
              className="backdrop-blur-xl bg-black/70 text-white w-[320px] border-l border-white/10"
            >
              <div className="flex flex-col items-center mt-10 text-center space-y-4 overflow-y-auto pb-4">
                <Logo />
                <div className="space-y-1">
                  <h2 className="font-semibold text-xl">EventsVibe</h2>
                  <p className="text-sm text-gray-300 px-4">
                  EventsVive is where moments turn into memories and brings people together through experiences that truly matter. Discover, connect, and vibe with events you’ll love — all in one vibrant platform.
                </p>
                </div>
                 <div className="space-y-1">
                  <h2 className="font-semibold text-lg">Address</h2>
                  <p className="text-gray-400">Sylhet, Bangladesh</p>
                </div>

                <div className="space-y-1">
                  <h2 className="font-semibold text-lg">Email</h2>
                  <Link
                    href="mailto:yoursylhetweb@gmail.com"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    yoursylhetweb@gmail.com
                  </Link>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <h2 className="font-semibold text-lg">Call Now</h2>
                  <p className="text-gray-400">+880 1978387924</p>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 pt-4">
                  <Link href="https://www.linkedin.com/in" target="_blank" className="p-2 rounded-full bg-yellow-600 border-2 border-amber-500 hover:bg-yellow-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin-icon lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </Link>
                  <Link href="https://github.com" target="_blank" className="p-2 rounded-full bg-yellow-600 border-2 border-amber-500 hover:bg-yellow-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github-icon lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </Link>
                </div>
                {/* Login Button*/}
                <div className="space-y-1 mb-2">
                  <Button className="px-6 py-2 text-sm bg-yellow-600 hover:bg-yellow-700 transition border-2 border-amber-500">
                    <Link href="/login" className="block w-full text-center text-white">
                      Login
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;