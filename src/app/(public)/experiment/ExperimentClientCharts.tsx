"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts"

export type DeltaRow = {
  area: string
  before: number
  after: number
  delta: number
  kind: string
}

export type LevelRow = {
  group: string
  stage: string
  high: number
  mid: number
  low: number
  note: string
}

export type SurveyRow = {
  topic: string
  percent: number
  comment: string
}

type Props = {
  expDelta: DeltaRow[]
  ctrlDelta: DeltaRow[]
  levels: LevelRow[]
  survey: SurveyRow[]
}

type TooltipEntry = { color?: string; name?: string; value?: number | string }
type TooltipProps = { active?: boolean; payload?: TooltipEntry[]; label?: string }

const Tip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((e, i) => (
          <p key={i} style={{ color: e.color }}>
            {e.name}: <strong>{e.value}</strong>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ExperimentClientCharts({ expDelta, ctrlDelta, levels, survey }: Props) {
  // Pre/Post chart үшін бір массивке біріктіреміз
  const combinedDelta = expDelta.map((e) => {
    const c = ctrlDelta.find((x) => x.area === e.area)
    return {
      area: e.area,
      "4Ә (дейін)": e.before,
      "4Ә (кейін)": e.after,
      "4А (дейін)": c?.before ?? 0,
      "4А (кейін)": c?.after ?? 0,
    }
  })

  // Радар үшін: тек "кейін" мәндері
  const radarData = expDelta.map((e) => {
    const c = ctrlDelta.find((x) => x.area === e.area)
    return { area: e.area, "4Ә": e.after, "4А": c?.after ?? 0 }
  })

  // Деңгейлер
  const levelChart = levels.map((l) => ({
    label: `${l.group} (${l.stage})`,
    Жоғары: l.high,
    Орта: l.mid,
    Төмен: l.low,
    note: l.note,
  }))

  return (
    <>
      {/* Pre/Post salystyru */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Pre / Post салыстыру (диаграмма)</h2>
        <div className="bg-card border rounded-2xl shadow-sm p-6">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={combinedDelta}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" tick={{ fontSize: 12 }} />
              <YAxis domain={[55, 75]} tick={{ fontSize: 12 }} />
              <Tooltip content={<Tip />} />
              <Legend />
              <Bar dataKey="4А (дейін)" fill="#fda4af" />
              <Bar dataKey="4А (кейін)" fill="#ef4444" />
              <Bar dataKey="4Ә (дейін)" fill="#93c5fd" />
              <Bar dataKey="4Ә (кейін)" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-3">
            4Ә сыныбы (көк) қалыптастырушы кезеңде барлық бағыт бойынша көтерілді,
            4А (қызыл) шамалы төмендеу немесе тұрақтылық көрсетті.
          </p>
        </div>
      </section>

      {/* Радар: екі топтың Post профилі */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Қорытынды кезеңдегі профиль (радар)</h2>
        <div className="bg-card border rounded-2xl shadow-sm p-6">
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="area" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 80]} tick={{ fontSize: 10 }} />
              <Tooltip content={<Tip />} />
              <Legend />
              <Radar name="4А (бақылау)" dataKey="4А" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Radar name="4Ә (эксперимент)" dataKey="4Ә" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 6. Деңгейлер */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">6. Оқушылардың деңгейлік нәтижелері</h2>
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="py-3 px-4 font-semibold">Топ</th>
                <th className="py-3 px-4 font-semibold">Кезең</th>
                <th className="py-3 px-4 font-semibold text-center">Жоғары</th>
                <th className="py-3 px-4 font-semibold text-center">Орта</th>
                <th className="py-3 px-4 font-semibold text-center">Төмен</th>
                <th className="py-3 px-4 font-semibold">Сипаттама</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {levels.map((l, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 font-semibold">{l.group}</td>
                  <td className="py-3 px-4">{l.stage}</td>
                  <td className="py-3 px-4 text-center text-green-600 font-medium">{l.high}</td>
                  <td className="py-3 px-4 text-center">{l.mid}</td>
                  <td className="py-3 px-4 text-center text-red-600 font-medium">{l.low}</td>
                  <td className="py-3 px-4 text-muted-foreground">{l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm p-6 mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={levelChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<Tip />} />
              <Legend />
              <Bar dataKey="Жоғары" stackId="a" fill="#16a34a" />
              <Bar dataKey="Орта" stackId="a" fill="#facc15" />
              <Bar dataKey="Төмен" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-3">
            4Ә эксперимент тобында жоғары деңгейдегі оқушылар саны 5-тен 9-ға өсті.
            Төмен деңгейдегі оқушылар саны 5-тен 2-ге азайды.
          </p>
        </div>
      </section>

      {/* 7. Сауалнама */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">7. Мұғалімдер сауалнамасының нәтижелері</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-2xl shadow-sm p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={survey} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={180} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="percent" name="Оң жауап үлесі, %">
                  {survey.map((s, i) => (
                    <Cell
                      key={i}
                      fill={s.percent >= 88 ? "#16a34a" : s.percent >= 84 ? "#84cc16" : "#facc15"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="py-3 px-4 font-semibold">Сұрақ</th>
                  <th className="py-3 px-4 font-semibold text-center">%</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {survey.map((s, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <div className="font-medium">{s.topic}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.comment}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{s.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Ең жоғары көрсеткіш — платформаның қолдануға ыңғайлылығы (90%).
          Мұғалімдер цифрлық құралдың негізгі артықшылығы ретінде нәтижені жинақтау,
          оқушының қай бағытта қиналғанын көру және кері байланысты жедел беру мүмкіндігін атаған.
        </p>
      </section>
    </>
  )
}
