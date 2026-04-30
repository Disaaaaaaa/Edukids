import { Navbar } from "@/components/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        {children}
      </main>
    </>
  );
}
