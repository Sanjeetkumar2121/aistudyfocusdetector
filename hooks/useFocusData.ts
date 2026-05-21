'use client'

import { useEffect, useState, useCallback } from 'react'
import { FocusData } from '@/types'
import { apiClient } from '@/services/api'
import { wsManager } from '@/services/websocket'

interface UseFocusDataReturn {
  currentFocus: FocusData | null
  focusHistory: FocusData[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFocusData(): UseFocusDataReturn {
  const [currentFocus, setCurrentFocus] = useState<FocusData | null>(null)
  const [focusHistory, setFocusHistory] = useState<FocusData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrentFocus = useCallback(async () => {
    try {
      setError(null)
      const response = await apiClient.getCurrentFocus()
      if (response.success && response.data) {
        setCurrentFocus(response.data)
      }
    } catch (err) {
      setError('Failed to fetch focus data')
      console.error('[v0] Error fetching focus data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFocusHistory = useCallback(async () => {
    try {
      const response = await apiClient.getFocusHistory(24)
      if (response.success && response.data) {
        setFocusHistory(response.data)
      }
    } catch (err) {
      console.error('[v0] Error fetching focus history:', err)
    }
  }, [])

  useEffect(() => {
    fetchCurrentFocus()
    fetchFocusHistory()

    // Connect to WebSocket for real-time updates
    const unsubscribeMessage = wsManager.onMessage((data) => {
      setCurrentFocus(data)
    })

    const unsubscribeStatus = wsManager.onStatusChange((connected) => {
      console.log('[v0] WebSocket status:', connected ? 'connected' : 'disconnected')
    })

    return () => {
      unsubscribeMessage()
      unsubscribeStatus()
    }
  }, [fetchCurrentFocus, fetchFocusHistory])

  return {
    currentFocus,
    focusHistory,
    loading,
    error,
    refetch: fetchCurrentFocus,
  }
}
