'use client'

interface ProductivityStatsProps {
  focusTime: number // in minutes
  breakTime: number // in minutes
  sessions: number
  avgScore: number
}

export default function ProductivityStats({
  focusTime,
  breakTime,
  sessions,
  avgScore,
}: ProductivityStatsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const totalTime = focusTime + breakTime
  const focusPercentage = totalTime > 0 ? (focusTime / totalTime) * 100 : 0

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Productivity Stats</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Focus Time</p>
            <p className="text-2xl font-bold text-primary">{formatTime(focusTime)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Break Time</p>
            <p className="text-2xl font-bold text-accent">{formatTime(breakTime)}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Focus Rate</span>
            <span className="font-semibold">{focusPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 flex overflow-hidden">
            <div
              className="bg-primary rounded-full"
              style={{ width: `${focusPercentage}%` }}
            />
            <div className="bg-accent rounded-full flex-1" />
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Sessions</p>
              <p className="text-xl font-bold">{sessions}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Score</p>
              <p className="text-xl font-bold text-primary">{avgScore}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
