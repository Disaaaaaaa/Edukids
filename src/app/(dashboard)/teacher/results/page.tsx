import { prisma } from "@/lib/db";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { auth } from "@/auth";

const PROGRAM_FILTERS = [
  { value: "ALL", label: "Барлығы" },
  { value: "PIRLS", label: "PIRLS" },
  { value: "TIMSS", label: "TIMSS" },
  { value: "PISA", label: "PISA" },
  { value: "DIAGNOSTIC", label: "Диагностика" },
] as const;

type ProgramFilter = typeof PROGRAM_FILTERS[number]["value"];

export default async function TeacherResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const session = await auth();

  const sp = await searchParams;
  const selected: ProgramFilter = (PROGRAM_FILTERS.find((f) => f.value === sp.program)?.value ?? "ALL") as ProgramFilter;

  const results = await prisma.studentResult.findMany({
    where: {
      user: { teacherId: session?.user?.id },
      ...(selected !== "ALL" ? { assessment: { program_type: selected } } : {}),
    },
    include: { assessment: true, user: true },
    orderBy: { completedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Жалпы Нәтижелер тақтасы 🏆</h1>
        <p className="text-muted-foreground mt-2">Барлық оқушылардың халықаралық PISA, TIMSS, PIRLS стандарттарындағы көрсеткіштері.</p>
      </div>

      <Card className="shadow-sm border-secondary/20">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <CardTitle>Оқушылардың тест тарихы</CardTitle>
          <CardDescription>Соңғы тапсыру уақыты бойынша сұрыпталған</CardDescription>
          <div className="flex flex-wrap gap-2 pt-3">
            {PROGRAM_FILTERS.map((f) => {
              const isActive = f.value === selected;
              const href = f.value === "ALL" ? "?" : `?program=${f.value}`;
              return (
                <Link
                  key={f.value}
                  href={href}
                  className={`inline-flex items-center px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
              <p>
                {selected === "ALL"
                  ? "Әзірге бірде-бір оқушы тест тапсырмаған."
                  : `${selected} форматы бойынша нәтиже жоқ.`}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Оқушы</TableHead>
                    <TableHead>Тапсырма атауы</TableHead>
                    <TableHead>Бағдарлама</TableHead>
                    <TableHead>Нәтижесі</TableHead>
                    <TableHead>Күні</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r: any) => (
                    <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold text-foreground/90">{r.user?.name || "Белгісіз оқушы"}</TableCell>
                      <TableCell className="font-medium text-muted-foreground">{r.assessment.title}</TableCell>
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
                      <TableCell className="text-muted-foreground text-xs">
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
