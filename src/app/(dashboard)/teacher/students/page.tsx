import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Mail } from "lucide-react";
import { auth } from "@/auth";

export const metadata = { title: "Оқушылар | Мұғалім Панелі" };

export default async function TeacherStudentsPage() {
  const session = await auth();

  const students = await prisma.user.findMany({
    where: { role: "student", teacherId: session?.user?.id },
    include: {
      results: { include: { assessment: true } }
    },
    orderBy: { name: 'asc' }
  });

  const studentStats = students.map((student: any) => {
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
      name: student.name || "Белгісіз",
      email: student.email,
      pirls, timss, pisa, overallAvg, progress
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Оқушылар тізімі</h1>
          <p className="text-muted-foreground mt-2">Сыныптағы барлық оқушылардың академиялық жетістіктері</p>
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>Жалпы тізім ({students.length} оқушы)</CardTitle>
          <CardDescription>PISA, TIMSS, PIRLS бағдарламалары бойынша орташа ұпайлар</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-x-auto p-0 border-t">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 font-medium">
              <tr>
                <th className="py-4 px-6 text-left">Оқушы</th>
                <th className="py-4 px-6 text-center">PIRLS (%)</th>
                <th className="py-4 px-6 text-center">TIMSS (%)</th>
                <th className="py-4 px-6 text-center">PISA (%)</th>
                <th className="py-4 px-6 text-right">Жалпы Үлгерімі</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {studentStats.map((student: any) => (
                <tr key={student.id} className="hover:bg-muted/30">
                  <td className="py-4 px-6">
                    <div className="font-medium text-base">{student.name}</div>
                    <div className="text-muted-foreground flex items-center gap-1 mt-1 text-xs">
                      <Mail className="size-3" /> {student.email}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={student.pirls < 50 && student.pirls > 0 ? "text-destructive font-bold" : ""}>
                      {student.pirls > 0 ? student.pirls : "-"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={student.timss < 50 && student.timss > 0 ? "text-destructive font-bold" : ""}>
                      {student.timss > 0 ? student.timss : "-"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={student.pisa < 50 && student.pisa > 0 ? "text-destructive font-bold" : ""}>
                      {student.pisa > 0 ? student.pisa : "-"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium 
                      ${student.progress === "Көңіл бөлу қажет" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                        student.progress === "Өте жоғары" ? "bg-primary/10 text-primary border border-primary/20" : 
                        student.progress === "Жоғары" ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                        "bg-muted text-muted-foreground border"}`}>
                      {student.progress}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {students.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Жүйеде оқушылар тіркелмеген.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
