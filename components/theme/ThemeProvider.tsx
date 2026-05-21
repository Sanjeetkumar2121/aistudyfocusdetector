'use client'

import React, { useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = savedTheme === 'dark' || (savedTheme === 'system' && prefersDark) ? 'dark' : 'light'

    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
