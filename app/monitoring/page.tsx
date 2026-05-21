'use client'

import { useState } from 'react'
import { useWebcam } from '@/hooks/useWebcam'
import { useFocusData } from '@/hooks/useFocusData'
import WebcamPreview from '@/components/monitoring/WebcamPreview'
import StartMonitoringBtn from '@/components/monitoring/StartMonitoringBtn'
import StopMonitoringBtn from '@/components/monitoring/StopMonitoringBtn'

export default function Monitoring() {
  const { videoRef, canvasRef, isActive, error, startWebcam, stopWebcam } = useWebcam()
  const { currentFocus } = useFocusData()
  const [isMonitoring, setIsMonitoring] = useState(false)

  const handleStart = async () => {
    try {
      setIsMonitoring(true)
      await startWebcam()
    } catch (err) {
      console.error('[v0] Error starting webcam:', err)
      setIsMonitoring(false)
    }
  }

  const handleStop = () => {
    stopWebcam()
    setIsMonitoring(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Monitoring</h1>
        <p className="text-muted-foreground mt-1">
          Real-time focus detection with AI analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Webcam Feed */}
        <div className="lg:col-span-2">
          <WebcamPreview videoRef={videoRef} isActive={isActive} error={error} />
          <canvas ref={canvasRef} hidden width={1280} height={720} />
        </div>

        {/* Controls and Stats */}
        <div className="space-y-4">
          {/* Control Buttons */}
          <div className="card space-y-3">
            {!isActive ? (
              <StartMonitoringBtn onClick={handleStart} loading={isMonitoring} />
            ) : (
              <StopMonitoringBtn onClick={handleStop} loading={false} />
            )}
          </div>

          {/* Status Indicators */}
          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Camera</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm font-semibold">
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Focus Score</span>
                <span className="text-sm font-bold text-primary">{currentFocus?.focusScore || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Analysis</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-semibold">Processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Real-Time Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Blink Rate</span>
                <span className="font-semibold">{currentFocus?.blinkRate || 0}/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Eye Contact</span>
                <span className="font-semibold">
                  {currentFocus?.eyeOpen ? '✓ Open' : '✗ Closed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posture</span>
                <span className={`font-semibold capitalize ${
                  currentFocus?.posture === 'good' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {currentFocus?.posture || 'Analyzing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distraction</span>
                <span className="font-semibold">{currentFocus?.distraction || 0}%</span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="card bg-primary/5 space-y-3">
            <h3 className="text-sm font-semibold">How it works</h3>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex gap-2">
                <span>•</span>
                <span>AI analyzes facial features and posture</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Real-time focus scoring updates</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Alerts for posture and distraction</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
