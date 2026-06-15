import { Logo } from "@/components/shared/Navbar/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";



export default function Hero() {

  return (
    <section className="relative overflow-hidden py-32 min-h-screen">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <Image
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          fill
          sizes="100vw"
          priority
          className="mask[radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
        />
      </div>
      <div className="relative z-10 container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <Logo />
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                Ready to Join a{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-700 from-5% via-amber-500 to-gray-700">Event?</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                Your journey begins from EventsVibe. Enjoy quality transfers tailored to your schedule—fast, secure, and hassle-free.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <Button className="font-bold border border-amber-500 bg-linear-to-r from-gray-700 from-5% via-amber-500 to-gray-700 hover:text-white dark:hover:text-black transition">
                <Link
                  href="/events"
                >
                  Explore Events
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}