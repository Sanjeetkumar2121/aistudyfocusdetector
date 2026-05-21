'use client'

interface FocusCardProps {
  focusScore: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
}

export default function FocusCard({ focusScore, status }: FocusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return 'text-green-500'
      case 'good':
        return 'text-blue-500'
      case 'fair':
        return 'text-yellow-500'
      case 'poor':
        return 'text-red-500'
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'excellent':
        return 'Excellent Focus'
      case 'good':
        return 'Good Focus'
      case 'fair':
        return 'Fair Focus'
      case 'poor':
        return 'Poor Focus'
    }
  }

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Current Focus</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className={`text-5xl font-bold ${getStatusColor()}`}>{focusScore}%</p>
          <p className={`text-sm font-medium ${getStatusColor()}`}>{getStatusLabel()}</p>
        </div>
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${(focusScore / 100) * 282.6} 282.6`}
              className={getStatusColor()}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">Real-time analysis active</p>
      </div>
    </div>
  )
}
