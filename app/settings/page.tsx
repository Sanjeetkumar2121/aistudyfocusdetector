'use client'

import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

export default function Settings() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [settings, setSettings] = useState({
    notifications: {
      focusDropAlert: true,
      postureAlert: true,
      breakReminder: true,
      distractionAlert: true,
    },
    thresholds: {
      minFocus: 70,
      blinkRateWarning: 10,
      postureThreshold: 60,
    },
    api: {
      baseUrl: 'http://localhost:5000/api',
      wsUrl: 'ws://localhost:5000/ws/focus',
    },
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const handleThresholdChange = (key: keyof typeof settings.thresholds, value: number) => {
    setSettings((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: value,
      },
    }))
  }

  if (!mounted) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your experience and preferences
        </p>
      </div>

      {/* Theme Settings */}
      <div className="card space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-sm text-muted-foreground mt-1">Customize how the app looks</p>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose which alerts you want to receive</p>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {key === 'focusDropAlert' && 'Alert when focus drops below threshold'}
                  {key === 'postureAlert' && 'Alert when posture is poor'}
                  {key === 'breakReminder' && 'Remind to take breaks'}
                  {key === 'distractionAlert' && 'Alert when distraction is detected'}
                </p>
              </div>
              <button
                onClick={() =>
                  handleNotificationChange(key as keyof typeof settings.notifications)
                }
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  value ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Thresholds */}
      <div className="card space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Focus Thresholds</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust sensitivity and alert levels
          </p>
        </div>

        <div className="space-y-6 border-t border-border pt-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-sm">Minimum Focus Score</label>
              <span className="text-primary font-bold">{settings.thresholds.minFocus}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.thresholds.minFocus}
              onChange={(e) =>
                handleThresholdChange('minFocus', parseInt(e.target.value))
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Alert when focus drops below this percentage
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-sm">Blink Rate Warning</label>
              <span className="text-primary font-bold">
                {settings.thresholds.blinkRateWarning} bpm
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              value={settings.thresholds.blinkRateWarning}
              onChange={(e) =>
                handleThresholdChange('blinkRateWarning', parseInt(e.target.value))
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Alert if blink rate falls below this threshold
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-sm">Posture Threshold</label>
              <span className="text-primary font-bold">{settings.thresholds.postureThreshold}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.thresholds.postureThreshold}
              onChange={(e) =>
                handleThresholdChange('postureThreshold', parseInt(e.target.value))
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Alert when posture confidence drops below this level
            </p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="card space-y-6">
        <div>
          <h2 className="text-lg font-semibold">API Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure backend API endpoints
          </p>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <div>
            <label className="font-semibold text-sm block mb-2">API Base URL</label>
            <input
              type="text"
              value={settings.api.baseUrl}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Configure via environment variable: NEXT_PUBLIC_API_BASE_URL
            </p>
          </div>

          <div>
            <label className="font-semibold text-sm block mb-2">WebSocket URL</label>
            <input
              type="text"
              value={settings.api.wsUrl}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Configure via environment variable: NEXT_PUBLIC_WS_URL
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold">About</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>App Version:</strong> 1.0.0
          </p>
          <p>
            <strong>Built with:</strong> Next.js 16, React 19, Tailwind CSS
          </p>
          <p>
            <strong>License:</strong> MIT
          </p>
          <p className="pt-2">
            For support and feature requests, please visit our{' '}
            <a
              href="#"
              className="text-primary hover:underline"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="btn-primary px-6 py-3 font-semibold"
        >
          Save Changes
        </button>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 text-green-600">
            <span>✓</span>
            <span className="text-sm font-semibold">Settings saved</span>
          </div>
        )}
      </div>
    </div>
  )
}
