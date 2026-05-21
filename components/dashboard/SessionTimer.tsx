'use client'

import { useState, useEffect } from 'react'

interface SessionTimerProps {
  isActive: boolean
  duration?: number // in minutes
}

export default function SessionTimer({ isActive, duration = 60 }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const [remaining, setRemaining] = useState(duration * 60)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
      setRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m ${secs}s`
  }

  const progress = ((elapsed) / (duration * 60)) * 100

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Session Timer</h3>
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">{formatTime(elapsed)}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {isActive ? 'In Progress' : 'Not Active'}
          </p>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Time Elapsed</span>
          <span>Duration: {duration}m</span>
        </div>
      </div>
    </div>
  )
}
