"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const MOCK_PROGRESS_DATA = [
  { name: "Қыркүйек", pisa: 40, timss: 30, pirls: 45 },
  { name: "Қазан", pisa: 55, timss: 40, pirls: 50 },
  { name: "Қараша", pisa: 60, timss: 55, pirls: 65 },
  { name: "Желтоқсан", pisa: 75, timss: 65, pirls: 70 },
];

export function StudentProgressChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MOCK_PROGRESS_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line type="monotone" name="PISA (Функционалдық)" dataKey="pisa" stroke="hsl(var(--accent-foreground))" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
          <Line type="monotone" name="TIMSS (Математика)" dataKey="timss" stroke="hsl(var(--secondary-foreground))" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
          <Line type="monotone" name="PIRLS (Оқу)" dataKey="pirls" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
