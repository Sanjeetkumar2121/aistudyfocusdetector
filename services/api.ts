import axios, { AxiosInstance, AxiosError } from 'axios'
import { ApiResponse, FocusData, SessionData, AnalyticsData } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Focus Data Endpoints
  async getCurrentFocus(): Promise<ApiResponse<FocusData>> {
    try {
      const response = await this.client.get('/focus/current')
      return response.data
    } catch (error) {
      console.error('Error fetching current focus:', error)
      throw error
    }
  }

  async getFocusHistory(hours: number = 24): Promise<ApiResponse<FocusData[]>> {
    try {
      const response = await this.client.get('/focus/history', {
        params: { hours },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching focus history:', error)
      throw error
    }
  }

  // Analytics Endpoints
  async getDailyAnalytics(date: string): Promise<ApiResponse<AnalyticsData>> {
    try {
      const response = await this.client.get('/analytics/daily', {
        params: { date },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching daily analytics:', error)
      throw error
    }
  }

  async getWeeklyAnalytics(week: string): Promise<ApiResponse<AnalyticsData>> {
    try {
      const response = await this.client.get('/analytics/weekly', {
        params: { week },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching weekly analytics:', error)
      throw error
    }
  }

  async getSessionHistory(): Promise<ApiResponse<SessionData[]>> {
    try {
      const response = await this.client.get('/analytics/sessions')
      return response.data
    } catch (error) {
      console.error('Error fetching session history:', error)
      throw error
    }
  }

  // Monitoring Endpoints
  async startMonitoring(): Promise<ApiResponse<{ sessionId: string }>> {
    try {
      const response = await this.client.post('/monitoring/start', {})
      return response.data
    } catch (error) {
      console.error('Error starting monitoring:', error)
      throw error
    }
  }

  async stopMonitoring(sessionId: string): Promise<ApiResponse<SessionData>> {
    try {
      const response = await this.client.post('/monitoring/stop', { sessionId })
      return response.data
    } catch (error) {
      console.error('Error stopping monitoring:', error)
      throw error
    }
  }

  // Settings Endpoints
  async updateSettings(settings: Record<string, any>): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.put('/settings', settings)
      return response.data
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  async getSettings(): Promise<ApiResponse<Record<string, any>>> {
    try {
      const response = await this.client.get('/settings')
      return response.data
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  }
}

export const apiClient = new ApiClient()
