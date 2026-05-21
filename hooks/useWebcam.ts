'use client'

import { useRef, useCallback, useState, useEffect } from 'react'

interface UseWebcamReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  isActive: boolean
  error: string | null
  startWebcam: () => Promise<void>
  stopWebcam: () => void
  captureFrame: () => string | null
}

export function useWebcam(): UseWebcamReturn {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startWebcam = useCallback(async () => {
    try {
      setError(null)

      // Check browser support
      const getUserMedia =
        navigator.mediaDevices?.getUserMedia ||
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia

      if (!getUserMedia) {
        throw new Error('WebRTC not supported in this browser')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setIsActive(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access webcam'
      setError(errorMessage)
      console.error('[v0] Webcam error:', err)
    }
  }, [])

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsActive(false)
    setError(null)
  }, [])

  const captureFrame = useCallback((): string | null => {
    try {
      if (!videoRef.current || !canvasRef.current || !isActive) {
        return null
      }

      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return null

      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )

      return canvasRef.current.toDataURL('image/jpeg', 0.8)
    } catch (err) {
      console.error('[v0] Error capturing frame:', err)
      return null
    }
  }, [isActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam()
    }
  }, [stopWebcam])

  return {
    videoRef,
    canvasRef,
    isActive,
    error,
    startWebcam,
    stopWebcam,
    captureFrame,
  }
}
