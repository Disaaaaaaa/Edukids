import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AnalyticsDashboardClient } from "./AnalyticsDashboardClient"

export const metadata = {
  title: "Аналитика | EduAssessmentKids",
}

export default async function TeacherAnalyticsPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || user.role !== "teacher") redirect("/login")

  // 1. Барлық оқушылар (streak ranking + жеке аналитика үшін)
  const students = await prisma.user.findMany({
    where: { teacherId: user.id, role: "student" },
    select: {
      id: true,
      name: true,
      email: true,
      xp: true,
      streakCount: true,
      lastActiveAt: true,
    },
    orderBy: { name: "asc" },
  })

  // 2. Барлық нәтижелер + олардың тапсырмалары
  const results = await prisma.studentResult.findMany({
    where: { user: { teacherId: user.id } },
    include: {
      assessment: { include: { tasks: true } },
      user: { select: { id: true, name: true } },
    },
    orderBy: { completedAt: "desc" },
  })

  // 3. KPI
  const totalTests = results.length
  const uniqueStudents = new Set(results.map((r) => r.userId)).size
  const averageScore = totalTests > 0
    ? results.reduce((acc, r) => acc + r.percentage, 0) / totalTests
    : 0

  const programCounts: Record<string, number> = {}
  results.forEach((r) => {
    const pt = r.assessment.program_type
    programCounts[pt] = (programCounts[pt] || 0) + 1
  })
  let topProgram = "-"
  let maxCount = 0
  Object.entries(programCounts).forEach(([pt, count]) => {
    if (count > maxCount) { maxCount = count; topProgram = pt }
  })

  const avgStreak = students.length > 0
    ? students.reduce((s, st) => s + (st.streakCount || 0), 0) / students.length
    : 0

  // 4. Соңғы 7 күн белсенділік
  const trendMap: Record<string, number> = {}
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    trendMap[d.toISOString().split("T")[0]] = 0
  }
  results.forEach((r) => {
    const dayStr = new Date(r.completedAt).toISOString().split("T")[0]
    if (trendMap[dayStr] !== undefined) trendMap[dayStr]++
  })
  const trendData = Object.keys(trendMap).map((dateStr) => {
    const [, month, day] = dateStr.split("-")
    return { date: `${month}/${day}`, count: trendMap[dateStr] }
  })

  // 5. Программа бойынша performance
  const programSums: Record<string, { total: number; count: number }> = {}
  results.forEach((r) => {
    const pt = r.assessment.program_type
    if (!programSums[pt]) programSums[pt] = { total: 0, count: 0 }
    programSums[pt].total += r.percentage
    programSums[pt].count += 1
  })
  const programPerformance = Object.entries(programSums).map(([name, data]) => ({
    name,
    average: Math.round(data.total / data.count),
    tests: data.count,
  })).sort((a, b) => b.tests - a.tests)

  // 6. Streak ranking (топ 10 ең тұрақты оқушы)
  const streakRanking = [...students]
    .filter((s) => (s.streakCount || 0) > 0)
    .sort((a, b) => (b.streakCount || 0) - (a.streakCount || 0))
    .slice(0, 10)
    .map((s) => ({
      name: s.name || s.email || "Атаусыз",
      streak: s.streakCount || 0,
      xp: s.xp || 0,
    }))

  // 7. Әр оқушының жан-жақты талдауы
  const studentAnalytics = students.map((s) => {
    const myResults = results.filter((r) => r.userId === s.id)
    const avgPct = myResults.length > 0
      ? myResults.reduce((a, r) => a + r.percentage, 0) / myResults.length
      : 0

    const byProgram: Record<string, { sum: number; count: number }> = {}
    myResults.forEach((r) => {
      const pt = r.assessment.program_type
      if (!byProgram[pt]) byProgram[pt] = { sum: 0, count: 0 }
      byProgram[pt].sum += r.percentage
      byProgram[pt].count += 1
    })
    const programAverages = Object.entries(byProgram).map(([name, d]) => ({
      name,
      avg: Math.round(d.sum / d.count),
    }))

    // Уақыт бойынша динамика (соңғы 10 тест)
    const timeline = [...myResults].reverse().slice(-10).map((r, i) => ({
      idx: i + 1,
      title: r.assessment.title.slice(0, 28),
      percentage: Math.round(r.percentage),
      date: new Date(r.completedAt).toISOString().split("T")[0].slice(5),
    }))

    // Жеке тапсырма деңгейіндегі талдау
    const taskBreakdown: { taskTitle: string; assessment: string; earned: number; max: number; pct: number }[] = []
    myResults.forEach((r) => {
      let answers: Record<string, number> = {}
      try {
        const parsed = JSON.parse(r.answersJson || "{}")
        answers = parsed.answers || parsed || {}
      } catch { /* skip */ }
      for (const task of r.assessment.tasks) {
        const earned = Number(answers[task.id] ?? 0)
        taskBreakdown.push({
          taskTitle: task.title.slice(0, 32),
          assessment: r.assessment.title.slice(0, 24),
          earned,
          max: task.max_score,
          pct: Math.round((earned / task.max_score) * 100),
        })
      }
    })

    return {
      id: s.id,
      name: s.name || s.email || "Атаусыз",
      xp: s.xp || 0,
      streak: s.streakCount || 0,
      testsCount: myResults.length,
      avgPercentage: Math.round(avgPct),
      programAverages,
      timeline,
      taskBreakdown: taskBreakdown.slice(0, 30),
    }
  }).sort((a, b) => b.avgPercentage - a.avgPercentage)

  // 8. Тапсырмалар бойынша талдау (қай тапсырмалар ең қиын/жеңіл)
  type TaskStat = {
    title: string
    assessment: string
    program: string
    maxScore: number
    attempts: number
    avgEarned: number
    successRate: number
  }
  const taskStats: Record<string, TaskStat> = {}

  results.forEach((r) => {
    let answers: Record<string, number> = {}
    try {
      const parsed = JSON.parse(r.answersJson || "{}")
      answers = parsed.answers || parsed || {}
    } catch { /* skip */ }
    for (const task of r.assessment.tasks) {
      const earned = Number(answers[task.id] ?? 0)
      if (!taskStats[task.id]) {
        taskStats[task.id] = {
          title: task.title,
          assessment: r.assessment.title,
          program: r.assessment.program_type,
          maxScore: task.max_score,
          attempts: 0,
          avgEarned: 0,
          successRate: 0,
        }
      }
      const ts = taskStats[task.id]
      const oldSum = ts.avgEarned * ts.attempts
      ts.attempts += 1
      ts.avgEarned = (oldSum + earned) / ts.attempts
      const oldRateSum = ts.successRate * (ts.attempts - 1)
      ts.successRate = (oldRateSum + (earned / task.max_score) * 100) / ts.attempts
    }
  })

  const taskAnalysisAll = Object.values(taskStats)
    .filter((t) => t.attempts > 0)
    .map((t) => ({
      title: t.title.slice(0, 36),
      assessment: t.assessment.slice(0, 24),
      program: t.program,
      attempts: t.attempts,
      successRate: Math.round(t.successRate),
      avgEarned: Math.round(t.avgEarned * 10) / 10,
      maxScore: t.maxScore,
    }))

  const hardestTasks = [...taskAnalysisAll].sort((a, b) => a.successRate - b.successRate).slice(0, 8)
  const easiestTasks = [...taskAnalysisAll].sort((a, b) => b.successRate - a.successRate).slice(0, 8)

  // 9. Қорытынды тестінің бөлім бойынша талдауы
  // (FINAL тесттерден sectionBreakdown оқимыз)
  const finalResults = results.filter((r) => r.assessment.program_type === "FINAL")
  type SectionAgg = { sum: number; count: number; max: number }
  const sectionsAgg: Record<"reading" | "math" | "science", SectionAgg> = {
    reading: { sum: 0, count: 0, max: 10 },
    math: { sum: 0, count: 0, max: 10 },
    science: { sum: 0, count: 0, max: 10 },
  }
  const studentSectionRows: { name: string; reading: number; math: number; science: number; total: number }[] = []

  finalResults.forEach((r) => {
    try {
      const parsed = JSON.parse(r.answersJson || "{}")
      const sb = parsed.sectionBreakdown as { reading?: number; math?: number; science?: number } | undefined
      if (sb) {
        const reading = Number(sb.reading ?? 0)
        const math = Number(sb.math ?? 0)
        const science = Number(sb.science ?? 0)
        sectionsAgg.reading.sum += reading; sectionsAgg.reading.count += 1
        sectionsAgg.math.sum += math; sectionsAgg.math.count += 1
        sectionsAgg.science.sum += science; sectionsAgg.science.count += 1
        studentSectionRows.push({
          name: r.user.name || "Атаусыз",
          reading: Math.round((reading / 10) * 100),
          math: Math.round((math / 10) * 100),
          science: Math.round((science / 10) * 100),
          total: Math.round(r.percentage),
        })
      }
    } catch { /* skip */ }
  })

  function pctOrNull(a: SectionAgg) {
    if (a.count === 0) return null
    return Math.round((a.sum / a.count / a.max) * 1000) / 10
  }
  const finalBreakdown = finalResults.length === 0 ? null : {
    avgReading: pctOrNull(sectionsAgg.reading) ?? 0,
    avgMath: pctOrNull(sectionsAgg.math) ?? 0,
    avgScience: pctOrNull(sectionsAgg.science) ?? 0,
    attempts: finalResults.length,
    students: studentSectionRows.sort((a, b) => b.total - a.total),
  }

  const stats = {
    totalTests,
    uniqueStudents,
    averageScore,
    topProgram,
    avgStreak: Math.round(avgStreak * 10) / 10,
    totalStudents: students.length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Сынып Аналитикасы</h1>
        <p className="text-muted-foreground mt-1">
          Оқушыларыңыздың оқу үлгерімі, белсенділігі мен тапсырмалар динамикасын талдаңыз.
        </p>
      </div>

      {totalTests === 0 ? (
        <div className="bg-card border rounded-2xl shadow-sm p-12 text-center">
          <h2 className="text-xl font-bold mb-2">Мәлімет жоқ</h2>
          <p className="text-muted-foreground">Әзірге сіздің оқушыларыңыз ешқандай тест тапсырмаған.</p>
        </div>
      ) : (
        <AnalyticsDashboardClient
          stats={stats}
          trendData={trendData}
          programPerformance={programPerformance}
          streakRanking={streakRanking}
          studentAnalytics={studentAnalytics}
          hardestTasks={hardestTasks}
          easiestTasks={easiestTasks}
          finalBreakdown={finalBreakdown}
        />
      )}
    </div>
  )
}
