'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  date: string
  score: number
}

interface StudyTrendVisualizationProps {
  data: DataPoint[]
}

export default function StudyTrendVisualization({ data }: StudyTrendVisualizationProps) {
  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Study Trend (30 Days)</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(14, 165, 233)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="rgb(14, 165, 233)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="date"
              stroke="currentColor"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              domain={[0, 100]}
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
            <Area
              type="monotone"
              dataKey="score"
              stroke="rgb(14, 165, 233)"
              fillOpacity={1}
              fill="url(#colorScore)"
              name="Focus Score"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
