'use client'

interface BlinkRateIndicatorProps {
  blinkRate: number // blinks per minute
  normalRange: { min: number; max: number }
}

export default function BlinkRateIndicator({
  blinkRate,
  normalRange,
}: BlinkRateIndicatorProps) {
  const isNormal = blinkRate >= normalRange.min && blinkRate <= normalRange.max
  const statusColor = isNormal ? 'text-green-500' : 'text-yellow-500'

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Blink Rate</h3>
      <div className="space-y-4">
        <div className="text-center">
          <p className={`text-4xl font-bold ${statusColor}`}>{blinkRate}</p>
          <p className="text-sm text-muted-foreground mt-2">blinks/minute</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Normal Range</span>
            <span>
              {normalRange.min}-{normalRange.max} bpm
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isNormal ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{
                width: `${Math.min((blinkRate / normalRange.max) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2">
          {isNormal ? 'Blinking pattern is normal' : 'Blink rate is unusual'}
        </p>
      </div>
    </div>
  )
}
