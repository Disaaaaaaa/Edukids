"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface ChartProps {
  pisaAvg: number;
  timssAvg: number;
  pirlsAvg: number;
}

export function TeacherAnalyticsChart({ pisaAvg, timssAvg, pirlsAvg }: ChartProps) {
  const chartData = [
    { name: "PISA (Функционалдық)", score: pisaAvg, fullMark: 100 },
    { name: "TIMSS (Математика)", score: timssAvg, fullMark: 100 },
    { name: "PIRLS (Оқу)", score: pirlsAvg, fullMark: 100 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 13}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{fill: 'hsl(var(--muted))', opacity: 0.4}}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="score" name="Орташа ұпай (%)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
