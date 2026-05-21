'use client'

import { useEffect, useRef } from 'react'

interface WebcamPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>
  isActive: boolean
  error?: string | null
}

export default function WebcamPreview({ videoRef, isActive, error }: WebcamPreviewProps) {
  return (
    <div className="card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Webcam Feed</h3>
      <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500/80 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-white">LIVE</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center">
            <div className="space-y-4">
              <div className="text-6xl">📹</div>
              <div>
                <p className="text-white font-semibold">Camera Inactive</p>
                <p className="text-slate-400 text-sm mt-1">Start monitoring to begin</p>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <div className="bg-red-900/80 px-4 py-2 rounded-lg">
              <p className="text-white text-sm font-semibold">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
