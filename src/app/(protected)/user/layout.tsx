import Sidebar from "@/components/shared/Sidebar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-dvh flex gap-1 md:gap-4">
      <Sidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </main>
  );
}
