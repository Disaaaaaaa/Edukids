import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentResultsPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;

  const results = await prisma.studentResult.findMany({
    where: { userId: user.id },
    include: { assessment: true },
    orderBy: { completedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Жалпы Нәтижелер 📊</h1>
        <p className="text-muted-foreground mt-2">Сенің тапсырған барлық тесттерің мен көрсеткіштерің.</p>
      </div>

      <Card className="shadow-sm border-secondary/20 border">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <CardTitle>Тест тарихы</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
              <p>Әзірге ешқандай тест тапсырмағансыз.</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Тапсырма атауы</TableHead>
                    <TableHead>Бағдарлама</TableHead>
                    <TableHead>Нәтиже</TableHead>
                    <TableHead>Күні</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium align-middle">{r.assessment.title}</TableCell>
                      <TableCell>
                         <Badge variant={r.assessment.program_type === "PISA" ? "default" : r.assessment.program_type === "TIMSS" ? "secondary" : "outline"}>
                           {r.assessment.program_type}
                         </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold text-lg ${r.percentage >= 70 ? "text-primary" : r.percentage >= 40 ? "text-yellow-600" : "text-destructive"}`}>
                          {r.percentage}%
                        </span>
                        <span className="text-muted-foreground text-xs ml-2 font-medium bg-muted px-2 py-0.5 rounded-full">
                          {r.score}/{r.maxScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(r.completedAt).toLocaleString("ru-KZ", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
