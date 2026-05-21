'use client'

interface DailyFocusReportProps {
  date: string
  avgFocus: number
  sessionsCount: number
  totalTime: number // in minutes
}

export default function DailyFocusReport({
  date,
  avgFocus,
  sessionsCount,
  totalTime,
}: DailyFocusReportProps) {
  const hours = Math.floor(totalTime / 60)
  const minutes = totalTime % 60

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Daily Report</h3>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Avg Focus</p>
            <p className="text-2xl font-bold text-primary">{avgFocus}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Sessions</p>
            <p className="text-2xl font-bold">{sessionsCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Study Time</p>
            <p className="text-2xl font-bold">
              {hours}h {minutes}m
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Focus Score</span>
            <span className="font-semibold">{avgFocus}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
              style={{ width: `${avgFocus}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
