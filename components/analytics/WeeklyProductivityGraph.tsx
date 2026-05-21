'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  day: string
  focus: number
  breaks: number
}

interface WeeklyProductivityGraphProps {
  data: DataPoint[]
}

export default function WeeklyProductivityGraph({ data }: WeeklyProductivityGraphProps) {
  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Weekly Productivity</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="day"
              stroke="currentColor"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="currentColor"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(var(--card))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="focus" fill="rgb(14, 165, 233)" name="Focus Time (min)" />
            <Bar dataKey="breaks" fill="rgb(168, 85, 247)" name="Break Time (min)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
