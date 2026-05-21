'use client'

interface StopMonitoringBtnProps {
  onClick: () => void
  loading?: boolean
}

export default function StopMonitoringBtn({ onClick, loading = false }: StopMonitoringBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="btn-outline px-6 py-3 font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed border-red-500 text-red-500 hover:bg-red-500/10"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          Stopping...
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>⏹</span>
          <span>Stop Monitoring</span>
        </div>
      )}
    </button>
  )
}
