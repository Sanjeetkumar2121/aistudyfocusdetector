'use client'

interface PostureStatusProps {
  status: 'good' | 'neutral' | 'bad'
  confidence: number // 0-100
}

export default function PostureStatus({ status, confidence }: PostureStatusProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'good':
        return {
          icon: '✓',
          label: 'Good Posture',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
        }
      case 'neutral':
        return {
          icon: '○',
          label: 'Neutral Posture',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
        }
      case 'bad':
        return {
          icon: '✕',
          label: 'Poor Posture',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
        }
    }
  }

  const info = getStatusInfo()

  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Posture</h3>
      <div className="space-y-4">
        <div className={`flex items-center gap-3 p-4 rounded-lg ${info.bgColor}`}>
          <div className={`text-3xl font-bold ${info.color}`}>{info.icon}</div>
          <div>
            <p className={`font-semibold ${info.color}`}>{info.label}</p>
            <p className="text-sm text-muted-foreground">{confidence}% confidence</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Confidence</span>
            <span>{confidence}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${info.color.replace('text-', 'bg-')}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2">
          {status === 'good' && 'Keep up the good posture!'}
          {status === 'neutral' && 'Posture looks okay, stay alert'}
          {status === 'bad' && 'Please adjust your posture for better health'}
        </p>
      </div>
    </div>
  )
}
