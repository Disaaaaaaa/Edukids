import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, FileText, Clock, EyeOff } from "lucide-react";
import { auth } from "@/auth";
import { AssessmentCardMenu } from "./AssessmentCardMenu";

export default async function AssessmentsPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;

  const assessments = await prisma.assessment.findMany({
    where: {
      OR: [
        { teacherId: user.id },
        { teacherId: null }
      ]
    },
    orderBy: { id: "desc" },
    include: {
      _count: {
        select: { tasks: true, results: true }
      }
    }
  });

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Тапсырмалар (Тесттер)</h1>
          <p className="text-muted-foreground mt-2">Базадағы барлық тестілеулерді басқару</p>
        </div>
        <Button render={<Link href="/teacher/assessments/new" className="gap-2" />} nativeButton={false}>
          <PlusCircle className="size-4" /> Жаңа тест құру
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assessments.map((assessment: any) => (
          <Card key={assessment.id} className="hover:shadow-md transition-shadow relative">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="line-clamp-1 text-lg">{assessment.title}</CardTitle>
                    {!assessment.isPublished && (
                      <span title="Оқушыларға көрінбейді"><EyeOff className="size-4 text-destructive shrink-0" /></span>
                    )}
                  </div>
                  <CardDescription className="mt-1">{assessment.grade_level}-сынып • {assessment.difficulty === 'MEDIUM' ? 'Орташа' : assessment.difficulty}</CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                    {assessment.program_type}
                  </span>
                  <AssessmentCardMenu 
                    id={assessment.id} 
                    isPublished={assessment.isPublished} 
                    canEdit={assessment.teacherId === user.id || assessment.teacherId === null} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" /> <span>{assessment.duration} минут</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="size-4" /> <span>{assessment._count.tasks} сұрақ</span>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs">
                  <span>Орындалды: {assessment._count.results} рет</span>
                  <span className="text-primary hover:underline cursor-pointer">Толығырақ &rarr;</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
