"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts"
import { Users, FileText, Target, Activity, Flame, Trophy, AlertTriangle, CheckCircle2 } from "lucide-react"

type StudentRow = {
  id: string
  name: string
  xp: number
  streak: number
  testsCount: number
  avgPercentage: number
  programAverages: { name: string; avg: number }[]
  timeline: { idx: number; title: string; percentage: number; date: string }[]
  taskBreakdown: { taskTitle: string; assessment: string; earned: number; max: number; pct: number }[]
}

type AnalyticsProps = {
  stats: {
    totalTests: number
    uniqueStudents: number
    averageScore: number
    topProgram: string
    avgStreak: number
    totalStudents: number
  }
  trendData: { date: string; count: number }[]
  programPerformance: { name: string; average: number; tests: number }[]
  streakRanking: { name: string; streak: number; xp: number }[]
  studentAnalytics: StudentRow[]
  hardestTasks: { title: string; assessment: string; program: string; attempts: number; successRate: number; avgEarned: number; maxScore: number }[]
  easiestTasks: { title: string; assessment: string; program: string; attempts: number; successRate: number; avgEarned: number; maxScore: number }[]
}

const PROGRAM_COLORS: Record<string, string> = {
  PIRLS: "#2563eb",
  TIMSS: "#16a34a",
  PISA: "#ea580c",
  DIAGNOSTIC: "#9333ea",
}

type TooltipEntry = { color?: string; name?: string; value?: number | string }
type TooltipProps = { active?: boolean; payload?: TooltipEntry[]; label?: string }

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsDashboardClient({
  stats, trendData, programPerformance, streakRanking,
  studentAnalytics, hardestTasks, easiestTasks,
}: AnalyticsProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    studentAnalytics[0]?.id ?? ""
  )
  const selectedStudent = studentAnalytics.find(s => s.id === selectedStudentId) ?? studentAnalytics[0]

  return (
    <div className="space-y-6">
      {/* 1. KPI карточкалары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard icon={<Users className="h-4 w-4" />} label="Барлық оқушы" value={stats.totalStudents} />
        <KpiCard icon={<FileText className="h-4 w-4" />} label="Тапсырылған тест" value={stats.totalTests} />
        <KpiCard icon={<Target className="h-4 w-4" />} label="Орташа балл" value={`${Math.round(stats.averageScore)}%`} />
        <KpiCard icon={<Flame className="h-4 w-4 text-orange-500" />} label="Орташа streak" value={`${stats.avgStreak} күн`} />
        <KpiCard icon={<Activity className="h-4 w-4" />} label="Топ-программа" value={stats.topProgram} />
      </div>

      {/* 2. Соңғы 7 күн белсенділігі мен программалар */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Соңғы 7 күнгі белсенділік</CardTitle>
            <CardDescription>Күн сайын тапсырылған тест саны</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} name="Тест" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Программалар бойынша орташа</CardTitle>
            <CardDescription>Әр бағдарлама түрі бойынша орташа балл</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="average" name="Орташа балл, %">
                  {programPerformance.map((p, i) => (
                    <Cell key={i} fill={PROGRAM_COLORS[p.name] ?? "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Streak ranking — ең тұрақты оқушылар */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Streak рейтингі — ең тұрақты оқушылар
          </CardTitle>
          <CardDescription>Күнделікті оқу әдетін сақтайтын топ-10 оқушы</CardDescription>
        </CardHeader>
        <CardContent>
          {streakRanking.length === 0 ? (
            <p className="text-muted-foreground text-sm">Әзірге streak көрсеткен оқушылар жоқ.</p>
          ) : (
            <div className="space-y-3">
              <ResponsiveContainer width="100%" height={Math.max(260, streakRanking.length * 36)}>
                <BarChart data={streakRanking} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="streak" fill="#f97316" name="Streak (күн)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Жеке оқушы талдау блогы */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle>Жеке оқушы талдауы</CardTitle>
              <CardDescription>Оқушыны таңдап, оның толық нәтижесін қараңыз</CardDescription>
            </div>
            <select
              className="border rounded-md px-3 py-2 bg-background text-sm w-full md:w-64"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {studentAnalytics.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.avgPercentage}%
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Жеке KPI */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MiniStat label="Орташа балл" value={`${selectedStudent.avgPercentage}%`} />
                <MiniStat label="Тапсырған тест" value={selectedStudent.testsCount} />
                <MiniStat label="XP" value={selectedStudent.xp} icon={<Trophy className="h-4 w-4 text-yellow-500" />} />
                <MiniStat label="Streak" value={`${selectedStudent.streak} күн`} icon={<Flame className="h-4 w-4 text-orange-500" />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Динамика */}
                <div>
                  <h4 className="font-semibold mb-2">Уақыт бойынша динамика</h4>
                  {selectedStudent.timeline.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={selectedStudent.timeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="percentage" stroke="#2563eb" strokeWidth={2} name="Балл, %" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground">Тарихы жоқ.</p>
                  )}
                </div>

                {/* Программалар бойынша radar */}
                <div>
                  <h4 className="font-semibold mb-2">Программалар бойынша</h4>
                  {selectedStudent.programAverages.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={selectedStudent.programAverages}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Radar dataKey="avg" stroke="#16a34a" fill="#16a34a" fillOpacity={0.4} name="Орташа, %" />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground">Деректер жоқ.</p>
                  )}
                </div>
              </div>

              {/* Тапсырмалар деңгейіндегі талдау */}
              <div>
                <h4 className="font-semibold mb-2">Тапсырмалар бойынша талдау</h4>
                {selectedStudent.taskBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={Math.max(260, selectedStudent.taskBreakdown.length * 22)}>
                    <BarChart data={selectedStudent.taskBreakdown} layout="vertical" margin={{ left: 90 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="taskTitle" tick={{ fontSize: 10 }} width={180} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="pct" name="Орындалу, %">
                        {selectedStudent.taskBreakdown.map((t, i) => (
                          <Cell key={i} fill={
                            t.pct === 100 ? "#16a34a" :
                            t.pct >= 70 ? "#84cc16" :
                            t.pct >= 50 ? "#eab308" :
                            t.pct >= 30 ? "#f97316" : "#ef4444"
                          } />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground">Тапсырма деректері жоқ.</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Тапсырмалар талдауы — сынып деңгейінде */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Ең қиын тапсырмалар
            </CardTitle>
            <CardDescription>Сыныптағы орындалу пайызы ең төмен топ-8</CardDescription>
          </CardHeader>
          <CardContent>
            {hardestTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Дерек жоқ.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(260, hardestTasks.length * 36)}>
                <BarChart data={hardestTasks} layout="vertical" margin={{ left: 90 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="title" tick={{ fontSize: 10 }} width={180} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="successRate" fill="#ef4444" name="Орындалу, %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Ең жеңіл тапсырмалар
            </CardTitle>
            <CardDescription>Сыныптағы орындалу пайызы ең жоғары топ-8</CardDescription>
          </CardHeader>
          <CardContent>
            {easiestTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Дерек жоқ.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(260, easiestTasks.length * 36)}>
                <BarChart data={easiestTasks} layout="vertical" margin={{ left: 90 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="title" tick={{ fontSize: 10 }} width={180} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="successRate" fill="#16a34a" name="Орындалу, %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
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

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  )
}
