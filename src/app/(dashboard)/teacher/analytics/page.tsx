import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AnalyticsDashboardClient } from "./AnalyticsDashboardClient"

export const metadata = {
  title: "Аналитика | EduKids",
}

export default async function TeacherAnalyticsPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || user.role !== "TEACHER") redirect("/login")

  // Fetch all results for this teacher's students
  const results = await prisma.studentResult.findMany({
    where: {
      user: {
        teacherId: user.id
      }
    },
    include: {
      assessment: true,
      user: true
    },
    orderBy: { completedAt: "desc" }
  })

  // 1. Calculate KPI Statistics
  const totalTests = results.length
  const uniqueStudents = new Set(results.map((r: any) => r.userId)).size
  const averageScore = totalTests > 0 
    ? results.reduce((acc: any, r: any) => acc + r.percentage, 0) / totalTests 
    : 0

  // Find most popular program type
  const programCounts: Record<string, number> = {}
  results.forEach((r: any) => {
    const pt = r.assessment.program_type
    programCounts[pt] = (programCounts[pt] || 0) + 1
  })
  let topProgram = "-"
  let maxCount = 0
  Object.entries(programCounts).forEach(([pt, count]) => {
    if (count > maxCount) {
      maxCount = count
      topProgram = pt
    }
  })

  // 2. Trend line data (last 7 days active mock)
  const trendMap: Record<string, number> = {}
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dayStr = d.toISOString().split('T')[0]
    trendMap[dayStr] = 0
  }
  
  results.forEach((r: any) => {
    const d = new Date(r.completedAt)
    const dayStr = d.toISOString().split('T')[0]
    if (trendMap[dayStr] !== undefined) {
      trendMap[dayStr]++
    }
  })

  const trendData = Object.keys(trendMap).map(dateStr => {
    const [, month, day] = dateStr.split('-')
    return { date: `${month}/${day}`, count: trendMap[dateStr] }
  })

  // 3. Program Type Performance
  const programSums: Record<string, { total: number, count: number }> = {}
  results.forEach((r: any) => {
    const pt = r.assessment.program_type
    if (!programSums[pt]) programSums[pt] = { total: 0, count: 0 }
    programSums[pt].total += r.percentage
    programSums[pt].count += 1
  })

  const programPerformance = Object.entries(programSums).map(([name, data]) => ({
    name,
    average: Math.round(data.total / data.count),
    tests: data.count
  })).sort((a, b) => b.tests - a.tests) // Sort by most tested

  // Construct structured props
  const stats = {
    totalTests,
    uniqueStudents,
    averageScore,
    topProgram
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Сынып Аналитикасы</h1>
        <p className="text-muted-foreground mt-1">Оқушыларыңыздың оқу үлгерімі мен белсенділігін талдаңыз.</p>
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
        />
      )}
    </div>
  )
}
