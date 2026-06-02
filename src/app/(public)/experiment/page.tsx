import type { Metadata } from "next"
import {
  ExperimentClientCharts,
  type DeltaRow,
  type LevelRow,
  type SurveyRow,
} from "./ExperimentClientCharts"

export const metadata: Metadata = {
  title: "Тәжірибелік эксперимент | EduAssessmentKids",
  description:
    "Қызылорда қаласындағы Т. Есетов атындағы №264 мектеп-лицейде өткізілген эксперимент нәтижелері",
}

// 2. Анықтаушы эксперимент нәтижелері
const baseline = [
  { group: "4А", type: "Бақылау тобы", count: 25, reading: 63.2, math: 61.6, science: 62.0, total: 62.3 },
  { group: "4Ә", type: "Эксперимент тобы", count: 25, reading: 62.4, math: 61.2, science: 62.4, total: 62.0 },
]

// 3-4. Дейін-кейін динамикасы
const expDelta: DeltaRow[] = [
  { area: "Оқу сауаттылығы", before: 62.4, after: 71.2, delta: 8.8, kind: "оң" },
  { area: "Математикалық сауаттылық", before: 61.2, after: 70.0, delta: 8.8, kind: "оң" },
  { area: "Жаратылыстану", before: 62.4, after: 70.6, delta: 8.2, kind: "оң" },
  { area: "Жалпы орташа", before: 62.0, after: 70.6, delta: 8.6, kind: "оң" },
]

const ctrlDelta: DeltaRow[] = [
  { area: "Оқу сауаттылығы", before: 63.2, after: 62.4, delta: -0.8, kind: "төмендеу" },
  { area: "Математикалық сауаттылық", before: 61.6, after: 60.8, delta: -0.8, kind: "төмендеу" },
  { area: "Жаратылыстану", before: 62.0, after: 61.8, delta: -0.2, kind: "төмендеу" },
  { area: "Жалпы орташа", before: 62.3, after: 61.7, delta: -0.6, kind: "төмендеу" },
]

// 5. Салыстырмалы динамика
const compare = [
  { metric: "Анықтаушы кезең (жалпы орташа)", control: 62.3, experiment: 62.0, diff: -0.3 },
  { metric: "Қорытынды кезең (жалпы орташа)", control: 61.7, experiment: 70.6, diff: 8.9 },
  { metric: "Жалпы динамика, п.п.", control: -0.6, experiment: 8.6, diff: 9.2 },
]

// 6. Деңгейлік нәтижелер
const levels: LevelRow[] = [
  { group: "4А", stage: "Анықтаушы", high: 5, mid: 15, low: 5, note: "Бастапқы деңгей орташа" },
  { group: "4А", stage: "Қорытынды", high: 5, mid: 14, low: 6, note: "Айқын өзгеріс жоқ" },
  { group: "4Ә", stage: "Анықтаушы", high: 5, mid: 15, low: 5, note: "Бастапқы деңгей орташа" },
  { group: "4Ә", stage: "Қорытынды", high: 9, mid: 14, low: 2, note: "Оң динамика байқалды" },
]

// 7. Мұғалімдер сауалнамасы
const survey: SurveyRow[] = [
  { topic: "Платформаны қолдану ыңғайлылығы", percent: 90, comment: "Интерфейс тапсырма орындау мен нәтижені бақылауға қолайлы" },
  { topic: "Бағалау уақытын қысқарту", percent: 82, comment: "Нәтижені жинақтау және салыстыру уақыты азайды" },
  { topic: "Оқушы қатесін анықтау", percent: 88, comment: "Әлсіз дағдыларды бағыт бойынша көруге мүмкіндік берді" },
  { topic: "Кері байланыс беру мүмкіндігі", percent: 86, comment: "Кері байланыс қысқа әрі нақты берілді" },
  { topic: "Аналитикалық есептің пайдалылығы", percent: 84, comment: "Мұғалім келесі тапсырманы дерек негізінде жоспарлады" },
]

export default function ExperimentPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* HERO */}
      <div className="mb-10">
        <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-2">
          Тәжірибелік эксперимент
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          EduAssessmentKids платформасының тиімділігі
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          Қызылорда қаласындағы Т.&nbsp;Есетов атындағы №264 мектеп-лицейдің 4А мен 4Ә
          сыныптарында өткізілген quasi-эксперименттік зерттеу нәтижелері.
        </p>
      </div>

      {/* 1. Жалпы ақпарат */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">1. Эксперимент туралы жалпы ақпарат</h2>
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              <Row k="Зерттеу базасы" v="Қызылорда қаласы, Т. Есетов атындағы №264 мектеп-лицей" />
              <Row k="Қатысушылар" v="4А және 4Ә сынып оқушылары" />
              <Row k="Бақылау тобы" v="4А сыныбы, 25 оқушы" />
              <Row k="Эксперимент тобы" v="4Ә сыныбы, 25 оқушы" />
              <Row k="Бақылау тобының мұғалімі" v="Сатыбалдиева Гүлжанат" />
              <Row k="Эксперимент тобының мұғалімі" v="Съездқызы Аружан" />
              <Row k="Қолданылған құрал" v="EduAssessmentKids цифрлық платформасы" />
              <Row k="Бағалау бағыттары" v="Оқу сауаттылығы, математикалық сауаттылық, жаратылыстану" />
              <Row
                k="Эксперимент мақсаты"
                v="Функционалдық тапсырмалар, дескрипторлық бағалау және цифрлық талдау арқылы оқушы нәтижесін салыстыру"
              />
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Эксперимент №264 мектеп-лицейдің 4А және 4Ә сыныптары негізінде өткізілді.
          4А — бақылау тобы, 4Ә — эксперимент тобы. Әр топта 25 оқушы қатысты.
        </p>
      </section>

      {/* 2. Анықтаушы эксперимент */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">2. Анықтаушы эксперимент нәтижелері</h2>
        <div className="bg-card border rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <Th>Сынып</Th>
                <Th>Топ түрі</Th>
                <Th>Оқушы саны</Th>
                <Th>Оқу сауаттылығы</Th>
                <Th>Математика</Th>
                <Th>Жаратылыстану</Th>
                <Th>Жалпы орташа</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {baseline.map((r) => (
                <tr key={r.group}>
                  <Td className="font-semibold">{r.group}</Td>
                  <Td>{r.type}</Td>
                  <Td>{r.count}</Td>
                  <Td>{r.reading}%</Td>
                  <Td>{r.math}%</Td>
                  <Td>{r.science}%</Td>
                  <Td className="font-semibold">{r.total}%</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Екі топтың бастапқы деңгейі шамалас болған. Бұл кейінгі қалыптастырушы
          эксперимент нәтижелерін салыстыруға негіз болды.
        </p>
      </section>

      {/* 3 & 4: Pre/Post topples */}
      <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeltaCard
          title="3. 4Ә эксперимент тобы"
          subtitle="EduAssessmentKids платформасы қолданылды"
          rows={expDelta}
          highlight="success"
        />
        <DeltaCard
          title="4. 4А бақылау тобы"
          subtitle="Дәстүрлі әдістеме жалғасты"
          rows={ctrlDelta}
          highlight="muted"
        />
      </section>

      {/* 5. Салыстырмалы */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">5. Эксперимент және бақылау топтарының салыстырмалы динамикасы</h2>
        <div className="bg-card border rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <Th>Көрсеткіш</Th>
                <Th>4А бақылау тобы</Th>
                <Th>4Ә эксперимент тобы</Th>
                <Th>Айырмашылық</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {compare.map((r) => (
                <tr key={r.metric}>
                  <Td className="font-medium">{r.metric}</Td>
                  <Td>{r.control >= 0 ? "" : ""}{r.control}{r.metric.includes("динамика") ? "" : "%"}</Td>
                  <Td>{r.experiment}{r.metric.includes("динамика") ? "" : "%"}</Td>
                  <Td
                    className={r.diff > 0 ? "font-bold text-green-600" : r.diff < 0 ? "text-red-600" : ""}
                  >
                    {r.diff > 0 ? "+" : ""}
                    {r.diff} п.п.
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Эксперимент тобының динамикасы бақылау тобынан 9,2 пайыздық пунктке жоғары болды.
          Бұл EduAssessmentKids платформасының функционалдық тапсырмаларды орындау нәтижесіне
          оң ықпал еткенін көрсетеді.
        </p>
      </section>

      {/* 6, 7 — Recharts визуализация */}
      <ExperimentClientCharts
        expDelta={expDelta}
        ctrlDelta={ctrlDelta}
        levels={levels}
        survey={survey}
      />

      {/* 8. Қысқа мәтін */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">8. Қорытынды</h2>
        <div className="bg-card border rounded-2xl shadow-sm p-6">
          <p className="text-base leading-7 text-muted-foreground">
            Тәжірибелік эксперимент Қызылорда қаласындағы Т.&nbsp;Есетов атындағы №264 мектеп-лицейдің
            4А және 4Ә сыныптары негізінде жүргізілді. 4А сыныбы — бақылау тобы, 4Ә сыныбы —
            эксперимент тобы ретінде алынды. Әр топта 25 оқушы қатысты. Анықтаушы кезеңде екі
            топтың бастапқы деңгейі шамалас болды: 4А сыныбының жалпы орташа көрсеткіші{" "}
            <strong>62,3%</strong>, 4Ә сыныбының көрсеткіші <strong>62,0%</strong> болды.
            Қалыптастырушы кезеңде 4Ә сыныбында EduAssessmentKids платформасы қолданылды. Қорытынды
            кезеңде эксперимент тобының жалпы орташа көрсеткіші{" "}
            <strong className="text-green-600">70,6%</strong>-ға жетіп, өсім{" "}
            <strong className="text-green-600">+8,6 пайыздық пункт</strong> болды. Бақылау тобында
            көрсеткіш <strong>61,7%</strong> болып, <strong className="text-red-600">−0,6 п.п.</strong>{" "}
            төмендеді. Екі топтың салыстырмалы айырмашылығы{" "}
            <strong className="text-green-600">+9,2 пайыздық пункт</strong> болды. Бұл нәтиже
            EduAssessmentKids платформасының функционалдық тапсырмаларды орындау, оқушы нәтижесін
            талдау және кері байланыс беру үдерісіне оң әсер еткенін көрсетті.
          </p>
        </div>
      </section>
    </div>
  )
}

// Components

function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr>
      <td className="py-3 px-4 font-medium w-1/3 bg-muted/30">{k}</td>
      <td className="py-3 px-4">{v}</td>
    </tr>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="py-3 px-4 font-semibold">{children}</th>
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 px-4 ${className}`}>{children}</td>
}

function DeltaCard({
  title, subtitle, rows, highlight,
}: {
  title: string
  subtitle: string
  rows: DeltaRow[]
  highlight: "success" | "muted"
}) {
  return (
    <div className="bg-card border rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-2 font-semibold">Бағыт</th>
            <th className="py-2 px-2 text-right">Дейін</th>
            <th className="py-2 px-2 text-right">Кейін</th>
            <th className="py-2 pl-2 text-right">Өзгеріс</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => (
            <tr key={r.area}>
              <td className="py-3 pr-2">{r.area}</td>
              <td className="py-3 px-2 text-right text-muted-foreground">{r.before}%</td>
              <td className="py-3 px-2 text-right">{r.after}%</td>
              <td
                className={
                  "py-3 pl-2 text-right font-semibold " +
                  (highlight === "success" ? "text-green-600" : "text-red-600")
                }
              >
                {r.delta > 0 ? "+" : ""}
                {r.delta} п.п.
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
