'use client'

interface StartMonitoringBtnProps {
  onClick: () => void
  loading?: boolean
}

export default function StartMonitoringBtn({ onClick, loading = false }: StartMonitoringBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="btn-primary px-6 py-3 font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Starting...
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>▶</span>
          <span>Start Monitoring</span>
        </div>
      )}
    </button>
  )
}
