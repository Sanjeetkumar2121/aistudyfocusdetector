import { FocusData } from '@/types'

type MessageHandler = (data: FocusData) => void
type StatusHandler = (connected: boolean) => void

class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string
  private messageHandlers: Set<MessageHandler> = new Set()
  private statusHandlers: Set<StatusHandler> = new Set()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000

  constructor() {
    this.url =
      (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_WS_URL) ||
      'ws://localhost:5000/ws/focus'
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('[v0] WebSocket connected')
          this.reconnectAttempts = 0
          this.notifyStatusHandlers(true)
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data: FocusData = JSON.parse(event.data)
            this.notifyMessageHandlers(data)
          } catch (error) {
            console.error('[v0] Error parsing WebSocket message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('[v0] WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('[v0] WebSocket closed')
          this.notifyStatusHandlers(false)
          this.attemptReconnect()
        }
      } catch (error) {
        console.error('[v0] WebSocket connection error:', error)
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => {
      this.messageHandlers.delete(handler)
    }
  }

  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler)
    return () => {
      this.statusHandlers.delete(handler)
    }
  }

  private notifyMessageHandlers(data: FocusData): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(data)
      } catch (error) {
        console.error('[v0] Error in message handler:', error)
      }
    })
  }

  private notifyStatusHandlers(connected: boolean): void {
    this.statusHandlers.forEach((handler) => {
      try {
        handler(connected)
      } catch (error) {
        console.error('[v0] Error in status handler:', error)
      }
    })
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(
        `[v0] Attempting reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      )
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('[v0] Reconnect failed:', error)
        })
      }, this.reconnectDelay)
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const wsManager = new WebSocketManager()
