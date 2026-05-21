'use client'

import { useCallback, useState } from 'react'
import { Notification } from '@/types'

interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration?: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])

  const addNotification = useCallback(
    (
      type: 'focus' | 'break' | 'posture' | 'distraction',
      message: string
    ): string => {
      const notification: Notification = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date().toISOString(),
        read: false,
      }

      setNotifications((prev) => [notification, ...prev])
      return notification.id
    },
    []
  )

  const addToast = useCallback(
    (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info', duration = 5000) => {
      const id = Date.now().toString()
      const toast: Toast = { id, message, type, duration }

      setToasts((prev) => [...prev, toast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    toasts,
    addNotification,
    addToast,
    removeToast,
    markAsRead,
    clearNotifications,
    unreadCount,
  }
}
