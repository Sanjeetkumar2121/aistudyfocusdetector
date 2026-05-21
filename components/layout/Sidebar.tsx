'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/monitoring', label: 'Live Monitoring', icon: '📹' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-slate-50 dark:bg-slate-900 border-r border-border">
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground hover:bg-accent/10'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
