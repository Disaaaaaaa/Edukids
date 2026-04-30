import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProgressChart } from "@/components/StudentProgressChart";
import { auth } from "@/auth";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const userName = user?.name || session?.user?.name || "Оқушы";
  const currentXp = user?.xp || 0;
  
  // Calculate Levels mathematically
  const level = Math.floor(currentXp / 1000) + 1;
  const nextLevelXp = level * 1000;
  const remainingXp = nextLevelXp - currentXp;

  const diagTest = await prisma.assessment.findFirst({ where: { program_type: "DIAGNOSTIC" }});
  const diagTestId = diagTest?.id || "dummy";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Қош келдің, {userName}! 👋</h1>
        <p className="text-muted-foreground mt-2">Басқару панелі. Сенің соңғы жетістіктерің мен жаңа тапсырмаларың.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Диагностикалық тест</CardTitle>
            <CardDescription>Бастапқы деңгейіңді біл</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Жаңа бағыттар бойынша тапсырмаларды ашпас бұрын өту қажет.</p>
            <Link href={`/student/tests/${diagTestId}`} className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 w-full">
              Тестті бастау
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Жаңа Тапсырмалар</CardTitle>
            <CardDescription>Халықаралық Тесттер (PISA, TIMSS, PIRLS)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Мұғалімдер жасаған жаңа тапсырмалар мен тесттерді көру және орындау.</p>
            <Link href="/student/tests" className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-border bg-background hover:bg-muted h-9 px-3 w-full">
              Барлық тесттерді көру
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-accent-foreground/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Жетістіктерің 🏆</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <div className="text-4xl font-bold text-accent-foreground drop-shadow-sm">{currentXp} <span className="text-lg text-muted-foreground">XP</span></div>
              <p className="text-sm text-muted-foreground mt-2">Деңгей {level} • Келесіге {remainingXp} XP</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20">
              <span className="text-3xl animate-pulse">🔥</span>
              <span className="text-lg font-black text-orange-600 mt-1">{user?.streakCount || 0} күн</span>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
