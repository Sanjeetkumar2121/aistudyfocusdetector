'use client'

import { useEffect, useState, useCallback } from 'react'
import { AnalyticsData, SessionData } from '@/types'
import { apiClient } from '@/services/api'

interface UseAnalyticsReturn {
  analytics: AnalyticsData | null
  sessions: SessionData[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAnalytics(): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null)
      const today = new Date().toISOString().split('T')[0]

      const [dailyResponse, weeklyResponse, sessionsResponse] = await Promise.all([
        apiClient.getDailyAnalytics(today),
        apiClient.getWeeklyAnalytics(today),
        apiClient.getSessionHistory(),
      ])

      if (dailyResponse.success && weeklyResponse.success) {
        setAnalytics({
          daily: dailyResponse.data?.daily || [],
          weekly: weeklyResponse.data?.weekly || [],
          sessions: sessionsResponse.data || [],
        })
      }

      if (sessionsResponse.success && sessionsResponse.data) {
        setSessions(sessionsResponse.data)
      }
    } catch (err) {
      setError('Failed to fetch analytics')
      console.error('[v0] Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()

    // Refresh analytics every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchAnalytics])

  return {
    analytics,
    sessions,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}
