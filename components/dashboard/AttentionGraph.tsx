'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  time: string
  focus: number
}

interface AttentionGraphProps {
  data: DataPoint[]
}

export default function AttentionGraph({ data }: AttentionGraphProps) {
  return (
    <div className="card col-span-full lg:col-span-2 space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Focus Timeline</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="time"
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
            <Legend />
            <Line
              type="monotone"
              dataKey="focus"
              stroke="rgb(14, 165, 233)"
              dot={false}
              strokeWidth={2}
              name="Focus Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
