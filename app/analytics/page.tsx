'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import DailyFocusReport from '@/components/analytics/DailyFocusReport'
import WeeklyProductivityGraph from '@/components/analytics/WeeklyProductivityGraph'
import StudyTrendVisualization from '@/components/analytics/StudyTrendVisualization'
import SessionHistoryTable from '@/components/analytics/SessionHistoryTable'

const generateMockWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day) => ({
    day,
    focus: Math.floor(Math.random() * 120) + 100,
    breaks: Math.floor(Math.random() * 40) + 20,
  }))
}

const generateMockTrendData = () => {
  const data = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.floor(Math.random() * 30) + 65,
    })
  }
  return data
}

export default function Analytics() {
  const { sessions, loading } = useAnalytics()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32 mx-auto" />
          <div className="h-4 bg-muted rounded w-24 mx-auto" />
        </div>
      </div>
    )
  }

  const mockWeeklyData = generateMockWeeklyData()
  const mockTrendData = generateMockTrendData()

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights into your focus patterns and productivity
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <DailyFocusReport
          date={today}
          avgFocus={82}
          sessionsCount={sessions.length}
          totalTime={340}
        />

        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Weekly Summary</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Focus</p>
                <p className="text-2xl font-bold">18h 45m</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold text-primary">79%</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">28</p>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">Best Day: Friday with 89% focus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WeeklyProductivityGraph data={mockWeeklyData} />
        <StudyTrendVisualization data={mockTrendData} />
      </div>

      {/* Session History */}
      <SessionHistoryTable sessions={sessions} />

      {/* Insights Card */}
      <div className="card space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Insights & Recommendations</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-semibold text-sm">Peak Focus Hours</p>
              <p className="text-sm text-muted-foreground">Your focus is highest between 10 AM and 12 PM</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-lg">🎯</span>
            <div>
              <p className="font-semibold text-sm">Posture Improvement</p>
              <p className="text-sm text-muted-foreground">Your posture has improved by 12% this week</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-lg">⚡</span>
            <div>
              <p className="font-semibold text-sm">Break Suggestions</p>
              <p className="text-sm text-muted-foreground">Take a 5-minute break every 45 minutes for optimal focus</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
