'use client'

import { useFocusData } from '@/hooks/useFocusData'
import FocusCard from '@/components/dashboard/FocusCard'
import SessionTimer from '@/components/dashboard/SessionTimer'
import AttentionGraph from '@/components/dashboard/AttentionGraph'
import BlinkRateIndicator from '@/components/dashboard/BlinkRateIndicator'
import PostureStatus from '@/components/dashboard/PostureStatus'
import ProductivityStats from '@/components/dashboard/ProductivityStats'

const generateMockData = () => {
  const data = []
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      focus: Math.floor(Math.random() * 40) + 60,
    })
  }
  return data
}

export default function Dashboard() {
  const { currentFocus, focusHistory, loading } = useFocusData()

  const mockGraphData = generateMockData()

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

  const focusScore = currentFocus?.focusScore || 0
  const getStatus = (score: number) => {
    if (score >= 80) return 'excellent'
    if (score >= 60) return 'good'
    if (score >= 40) return 'fair'
    return 'poor'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time monitoring and analytics of your focus levels
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FocusCard focusScore={focusScore} status={getStatus(focusScore)} />
        <SessionTimer isActive={true} duration={60} />
        <BlinkRateIndicator blinkRate={currentFocus?.blinkRate || 16} normalRange={{ min: 12, max: 20 }} />
        <PostureStatus
          status={currentFocus?.posture || 'good'}
          confidence={85}
        />
        <ProductivityStats
          focusTime={140}
          breakTime={20}
          sessions={focusHistory.length}
          avgScore={Math.round(focusScore)}
        />
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Distraction</span>
                <span className="font-semibold">{currentFocus?.distraction || 0}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${currentFocus?.distraction || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Eye Contact</span>
                <span className="font-semibold">
                  {currentFocus?.eyeOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: currentFocus?.eyeOpen ? '100%' : '20%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <AttentionGraph data={mockGraphData} />
    </div>
  )
}
