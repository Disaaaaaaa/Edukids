import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft, Clock, FileText, Hash, Users, EyeOff, Eye,
  CheckCircle2, Pencil, ListChecks,
} from "lucide-react"

type PageProps = { params: Promise<{ id: string }> }

const PROGRAM_BADGE: Record<string, string> = {
  PIRLS: "bg-blue-100 text-blue-700",
  TIMSS: "bg-green-100 text-green-700",
  PISA: "bg-orange-100 text-orange-700",
  DIAGNOSTIC: "bg-purple-100 text-purple-700",
  FINAL: "bg-yellow-100 text-yellow-800",
  SCIENCE: "bg-emerald-100 text-emerald-700",
}

const QTYPE_LABEL: Record<string, string> = {
  SINGLE_CHOICE: "Бір таңдау",
  MULTIPLE_CHOICE: "Бірнеше таңдау",
  SHORT_ANSWER: "Қысқа жауап",
  OPEN_ENDED: "Ашық жауап",
}

const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: "Жеңіл",
  MEDIUM: "Орташа",
  HARD: "Қиын",
}

export default async function AssessmentDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || user.role !== "teacher") redirect("/login")

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { order_index: "asc" }, include: { criteria: true } },
      _count: { select: { results: true } },
    },
  })

  if (!assessment) notFound()
  // Тек өзі немесе ортақ тестке қол жеткізе алады
  if (assessment.teacherId !== user.id && assessment.teacherId !== null) notFound()

  const totalMaxScore = assessment.tasks.reduce((s, t) => s + t.max_score, 0)
  const canEdit = assessment.teacherId === user.id || assessment.teacherId === null

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" render={<Link href="/teacher/assessments" />} nativeButton={false} className="mb-3 gap-2">
          <ArrowLeft className="size-4" /> Барлық тестілерге қайту
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${PROGRAM_BADGE[assessment.program_type] ?? "bg-muted text-muted-foreground"}`}>
                {assessment.program_type}
              </span>
              {assessment.isPublished ? (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                  <Eye className="size-3" /> Жарияланған
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md">
                  <EyeOff className="size-3" /> Жасырын
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{assessment.title}</h1>
            <p className="text-muted-foreground mt-1">
              {assessment.grade_level}-сынып • {DIFFICULTY_LABEL[assessment.difficulty] ?? assessment.difficulty} • {assessment.type}
            </p>
          </div>

          {canEdit && (
            <Button render={<Link href={`/teacher/assessments/${assessment.id}/edit`} className="gap-2" />} nativeButton={false}>
              <Pencil className="size-4" /> Өңдеу
            </Button>
          )}
        </div>
      </div>

      {/* KPI карточкалары */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={<Clock className="size-4" />} label="Ұзақтығы" value={`${assessment.duration} мин`} />
        <Stat icon={<FileText className="size-4" />} label="Тапсырма саны" value={assessment.tasks.length} />
        <Stat icon={<Hash className="size-4" />} label="Жалпы балл" value={totalMaxScore} />
        <Stat icon={<Users className="size-4" />} label="Тапсырғандар" value={assessment._count.results} />
      </div>

      {/* Тапсырмалар тізімі */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="size-5 text-primary" />
            Тапсырмалар ({assessment.tasks.length})
          </CardTitle>
          <CardDescription>
            Тестінің барлық тапсырмалары реті бойынша. Дұрыс жауап жасыл түспен ерекшеленген.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessment.tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Бұл тестке әлі тапсырма қосылмаған.</p>
          ) : (
            assessment.tasks.map((task, idx) => (
              <div key={task.id} className="border rounded-xl p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary/10 text-primary text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                        {QTYPE_LABEL[task.question_type] ?? task.question_type}
                      </span>
                      <span className="text-xs text-muted-foreground">• {task.max_score} балл</span>
                      {task.criteria?.title && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-md">
                          {task.criteria.title}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base">{task.title}</h3>
                  </div>
                </div>

                <p className="text-sm leading-6 mt-2 mb-3 text-foreground/90">
                  {task.content}
                </p>

                {/* Жауап нұсқалары */}
                {task.options.length > 0 && (
                  <div className="space-y-1.5 mt-3">
                    {task.options.map((opt, oi) => {
                      const isCorrect = opt === task.correct_answer
                      return (
                        <div
                          key={oi}
                          className={
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm " +
                            (isCorrect
                              ? "bg-green-50 border border-green-200 text-green-900 font-medium"
                              : "bg-muted/30")
                          }
                        >
                          <span className="font-mono text-xs w-5">{String.fromCharCode(65 + oi)}.</span>
                          <span className="flex-1">{opt}</span>
                          {isCorrect && <CheckCircle2 className="size-4 text-green-600 shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                )}

                {task.question_type !== "SINGLE_CHOICE" && task.question_type !== "MULTIPLE_CHOICE" && (
                  <div className="mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm">
                    <span className="text-xs uppercase font-semibold text-green-800 mr-2">Дұрыс жауап:</span>
                    <span className="font-medium text-green-900">{task.correct_answer}</span>
                  </div>
                )}

                {task.explanation && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
                      Түсіндірме
                    </summary>
                    <p className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-blue-900">
                      {task.explanation}
                    </p>
                  </details>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="opacity-60">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
