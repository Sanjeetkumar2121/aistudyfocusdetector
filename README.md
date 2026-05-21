# AI Study Focus Detector

An advanced web application for monitoring and analyzing study focus using AI-powered computer vision. Real-time focus detection with comprehensive analytics and personalized insights.

## Features

- **Real-Time Monitoring**: Live webcam analysis with instant focus scoring
- **Advanced Analytics**: Detailed reports and trends of your study patterns
- **Smart Notifications**: Get alerts when focus drops or posture needs correction
- **Focus Metrics**: Track blink rate, posture, and distraction levels
- **Daily Reports**: Comprehensive summaries of your study sessions
- **Customizable Thresholds**: Adjust sensitivity and alert levels to match your needs
- **Dark Mode**: Beautiful dark/light theme support

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts for analytics visualization
- **HTTP Client**: Axios
- **State Management**: React Context API + Custom Hooks
- **WebRTC**: For real-time webcam access
- **WebSocket**: For live data streaming from backend

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-study-focus-detector
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend API URLs:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws/focus
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

```
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page
│   ├── dashboard/               # Dashboard page
│   ├── monitoring/              # Live monitoring page
│   ├── analytics/               # Analytics page
│   ├── settings/                # Settings page
│   ├── globals.css              # Global styles
│   └── api/                     # API routes (if needed)
├── components/
│   ├── layout/                  # Layout components (Header, Sidebar)
│   ├── dashboard/               # Dashboard components (FocusCard, etc.)
│   ├── monitoring/              # Monitoring components
│   ├── analytics/               # Analytics components
│   ├── theme/                   # Theme provider
│   └── common/                  # Reusable components
├── hooks/                       # Custom React hooks
│   ├── useTheme.ts
│   ├── useFocusData.ts
│   ├── useAnalytics.ts
│   ├── useWebcam.ts
│   └── useNotifications.ts
├── services/                    # API and WebSocket services
│   ├── api.ts                   # Axios client
│   └── websocket.ts             # WebSocket manager
├── types/                       # TypeScript interfaces
│   └── index.ts
├── styles/                      # Global styles
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
└── package.json
```

## Pages

### Home (`/`)
Welcome screen with feature highlights and call-to-action buttons.

### Dashboard (`/dashboard`)
Real-time focus metrics including:
- Current focus score with gauge indicator
- Session timer
- Blink rate monitoring
- Posture status
- Productivity statistics
- Focus timeline graph

### Live Monitoring (`/monitoring`)
Live webcam feed with:
- Real-time video stream
- Start/stop monitoring controls
- Live metrics display
- Analysis status indicators

### Analytics (`/analytics`)
Comprehensive analytics with:
- Daily focus report
- Weekly productivity graph
- 30-day study trend visualization
- Session history table
- AI-generated insights and recommendations

### Settings (`/settings`)
Customization options for:
- Dark/light mode toggle
- Notification preferences
- Focus thresholds and sensitivity
- API endpoint configuration

## API Integration

The frontend expects a backend API with the following endpoints:

### Focus Data
- `GET /api/focus/current` - Get current focus data
- `GET /api/focus/history?hours=24` - Get focus history

### Analytics
- `GET /api/analytics/daily?date=YYYY-MM-DD` - Get daily analytics
- `GET /api/analytics/weekly?week=YYYY-Www` - Get weekly analytics
- `GET /api/analytics/sessions` - Get session history

### Monitoring
- `POST /api/monitoring/start` - Start monitoring session
- `POST /api/monitoring/stop` - Stop monitoring session
- `WebSocket /ws/focus` - Real-time focus data stream

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws/focus

# Optional
NEXT_PUBLIC_APP_NAME=AI Study Focus Detector
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Hooks Reference

### `useTheme()`
Manages dark/light mode state and persistence.

### `useFocusData()`
Fetches and manages real-time focus data with WebSocket support.

### `useAnalytics()`
Fetches and manages analytics data including sessions and trends.

### `useWebcam()`
Handles webcam access, stream management, and frame capture.

### `useNotifications()`
Manages in-app notifications and toast messages.

## Building for Production

```bash
npm run build
npm start
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimizations

- Code splitting by page
- Lazy loaded chart components
- Memoized expensive computations
- Debounced real-time updates
- Optimized image loading
- Next.js Image component for assets

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.
