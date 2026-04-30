import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, HelpCircle } from "lucide-react";
import { auth } from "@/auth";

export default async function StudentTestsPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  // Fetch tests sorted by newest
  const tests = await prisma.assessment.findMany({
    where: {
      isPublished: true,
      OR: [
        { teacherId: user?.teacherId || "" },
        { teacherId: null }
      ]
    },
    orderBy: { id: "desc" },
    include: {
      _count: {
        select: { tasks: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Барлық Тесттер мен Тапсырмалар 📝</h1>
        <p className="text-muted-foreground mt-2">Мұғалімдер жасаған халықаралық PISA, TIMSS, PIRLS бағдарламалары бойынша тесттер тізімі.</p>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">Әзірге тесттер жоқ. Мұғалім жаңа тапсырмалар қосқанда осы жерде пайда болады.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test: any) => (
            <Card key={test.id} className="flex flex-col shadow-sm transition-all hover:shadow-md hover:border-primary/50 border-border/60">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className="px-3" variant={test.program_type === "PISA" ? "default" : test.program_type === "TIMSS" ? "secondary" : test.program_type === "PIRLS" ? "outline" : "destructive"}>
                    {test.program_type}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                    {test.grade_level}-сынып
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-tight line-clamp-2">{test.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-4 text-sm font-medium">
                  <span className="flex items-center gap-1.5 text-foreground/80">
                    <Clock className="w-4 h-4 text-muted-foreground" /> {test.duration} мин
                  </span>
                  <span className="flex items-center gap-1.5 text-foreground/80">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" /> {test._count.tasks} сұрақ
                  </span>
                  <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground ml-auto border">
                    {test.difficulty === "HARD" ? "Қиын" : test.difficulty === "EASY" ? "Оңай" : "Орташа"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-6 border-t border-border/40">
                <Link href={`/student/tests/${test.id}`} className="w-full inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 transition-colors">
                  Тестті тапсыру
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
