'use client'

import { SessionData } from '@/types'

interface SessionHistoryTableProps {
  sessions: SessionData[]
}

export default function SessionHistoryTable({ sessions }: SessionHistoryTableProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US')
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Recent Sessions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-left text-muted-foreground">
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Time</th>
              <th className="pb-3 font-semibold text-right">Duration</th>
              <th className="pb-3 font-semibold text-right">Avg Focus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sessions.slice(0, 10).map((session) => (
              <tr key={session.id} className="hover:bg-accent/5 transition-colors">
                <td className="py-3">{formatDate(session.startTime)}</td>
                <td className="py-3">{formatTime(session.startTime)}</td>
                <td className="py-3 text-right font-medium">
                  {formatDuration(session.duration)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`font-semibold ${
                      session.avgFocus >= 80
                        ? 'text-green-500'
                        : session.avgFocus >= 60
                        ? 'text-blue-500'
                        : 'text-orange-500'
                    }`}
                  >
                    {session.avgFocus}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No sessions recorded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
