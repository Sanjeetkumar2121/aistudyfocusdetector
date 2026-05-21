export interface FocusData {
  focusScore: number;
  timestamp: string;
  eyeOpen: boolean;
  blinkRate: number;
  posture: 'good' | 'bad' | 'neutral';
  distraction: number;
}

export interface SessionData {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  avgFocus: number;
  avgBlink: number;
  postureMaintenance: number;
}

export interface DailyStats {
  date: string;
  totalFocusTime: number;
  sessionsCount: number;
  avgFocusScore: number;
  totalDistractions: number;
}

export interface WeeklyStats {
  week: string;
  data: DailyStats[];
}

export interface AnalyticsData {
  daily: DailyStats[];
  weekly: WeeklyStats[];
  sessions: SessionData[];
}

export interface Notification {
  id: string;
  type: 'focus' | 'break' | 'posture' | 'distraction';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
