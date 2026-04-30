import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";

export async function Navbar() {
  const session = await auth();
  const role = session?.user?.role || "student";
  const dashboardHref = `/${role}/dashboard`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
          <span className="text-3xl">🎯</span> EduKids
        </Link>
        <nav className="hidden md:flex gap-6 items-center font-medium">
          <Link href="/about" className="hover:text-primary transition-colors">Жоба туралы</Link>
          <Link href="/diagnostic-info" className="hover:text-primary transition-colors">Диагностика</Link>
          <Link href="#" className="hover:text-primary transition-colors">PISA</Link>
          <Link href="#" className="hover:text-primary transition-colors">TIMSS</Link>
          <Link href="#" className="hover:text-primary transition-colors">PIRLS</Link>
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button variant="ghost" render={<Link href={dashboardHref} />} nativeButton={false}>
                Панельге өту
              </Button>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                <Button type="submit" variant="default">
                  Шығу
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />} nativeButton={false}>Кіру</Button>
              <Button variant="default" render={<Link href="/register" />} nativeButton={false}>Тіркелу</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
