import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherAnalyticsChart } from "@/components/TeacherAnalyticsChart";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export default async function TeacherDashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "Мұғалім";

  const students = await prisma.user.findMany({
    where: { role: "student", teacherId: session?.user?.id },
    include: { results: { include: { assessment: true } } }
  });

  const getAvg = (programType: string) => {
    let totalScore = 0;
    let totalMax = 0;
    for (const student of students) {
      for (const res of student.results) {
        if (res.assessment.program_type === programType) {
          totalScore += res.score;
          totalMax += res.maxScore;
        }
      }
    }
    return totalMax === 0 ? 0 : Math.round((totalScore / totalMax) * 100);
  }

  const pirlsAvg = getAvg("PIRLS");
  const timssAvg = getAvg("TIMSS");
  const pisaAvg = getAvg("PISA");

  const MOCK_STUDENTS = students.map((student: any) => {
    const studentAvg = (programType: string) => {
      const filtered = student.results.filter((r: any) => r.assessment.program_type === programType);
      if (filtered.length === 0) return 0;
      const tScore = filtered.reduce((acc: number, r: any) => acc + r.score, 0);
      const tMax = filtered.reduce((acc: number, r: any) => acc + r.maxScore, 0);
      return Math.round((tScore / tMax) * 100);
    };

    const pirls = studentAvg("PIRLS");
    const timss = studentAvg("TIMSS");
    const pisa = studentAvg("PISA");
    
    const overallAvg = (pirls + timss + pisa) / 3;
    let progress = "Қалыпты";
    if (overallAvg >= 85) progress = "Өте жоғары";
    else if (overallAvg >= 70) progress = "Жоғары";
    else if (overallAvg >= 50) progress = "Орташа";
    else progress = "Көңіл бөлу қажет";

    return {
      id: student.id,
      name: student.name || "Белгісіз оқушы",
      pirls, timss, pisa, overallAvg, progress
    }
  }).sort((a: any, b: any) => b.overallAvg - a.overallAvg).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Қош келдіңіз, {userName}! 👨‍🏫</h1>
        <p className="text-muted-foreground mt-2">Сыныптың жалпы көрсеткіштері мен оқушылардың жетістіктерін бақылаңыз.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Жалпы оқушылар</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Осы жүйеге тіркелген</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">PIRLS Орташа ұпай</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{pirlsAvg}%</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-600">Барлық оқушылар бойынша</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">TIMSS Орташа ұпай</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary-foreground">{timssAvg}%</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-600">Барлық оқушылар бойынша</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">PISA Орташа ұпай</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-foreground">{pisaAvg}%</div>
            <p className="text-xs text-muted-foreground mt-1 text-amber-600">Барлық оқушылар бойынша</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Бағыттар бойынша сынып нәтижесі</CardTitle>
            <CardDescription>4А сыныбы, 4-тоқсан</CardDescription>
          </CardHeader>
          <CardContent>
            <TeacherAnalyticsChart pisaAvg={pisaAvg} timssAvg={timssAvg} pirlsAvg={pirlsAvg} />
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Оқушылар тізімі (Топ-4)</CardTitle>
            <CardDescription>Нәтижелері ең жоғары және ең төмен оқушылар</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0 border-t">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 font-medium">
                <tr>
                  <th className="py-3 px-4 text-left">Аты-жөні</th>
                  <th className="py-3 px-4 text-center">PIRLS</th>
                  <th className="py-3 px-4 text-center">TIMSS</th>
                  <th className="py-3 px-4 text-center">PISA</th>
                  <th className="py-3 px-4 text-right">Күйі</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {MOCK_STUDENTS.map((student: any) => (
                  <tr key={student.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-center">{student.pirls}%</td>
                    <td className="py-3 px-4 text-center">{student.timss}%</td>
                    <td className="py-3 px-4 text-center">{student.pisa}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${student.progress === "Көңіл бөлу қажет" ? "bg-destructive/10 text-destructive" :
                          student.progress === "Өте жоғары" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {student.progress}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
