import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-12 sm:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-balance">
              AI-Powered Study Focus Detection
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Monitor your concentration in real-time with advanced AI technology. Get instant
              feedback and personalized recommendations to improve your productivity.
            </p>
            <div className="flex gap-4">
              <Link
                href="/monitoring"
                className="btn-primary px-8 py-3 font-semibold"
              >
                Start Monitoring
              </Link>
              <Link
                href="/dashboard"
                className="btn-outline px-8 py-3 font-semibold"
              >
                View Dashboard
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-6xl">📊</span>
              </div>
              <p className="text-sm text-muted-foreground">Focus Tracking Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-12 text-balance">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '📹',
              title: 'Real-Time Monitoring',
              description: 'Live webcam analysis with instant focus scoring',
            },
            {
              icon: '📈',
              title: 'Advanced Analytics',
              description: 'Detailed reports and trends of your study patterns',
            },
            {
              icon: '🔔',
              title: 'Smart Notifications',
              description: 'Get alerts when focus drops or posture needs correction',
            },
            {
              icon: '🎯',
              title: 'Focus Metrics',
              description: 'Track blink rate, posture, and distraction levels',
            },
            {
              icon: '📊',
              title: 'Daily Reports',
              description: 'Comprehensive summaries of your study sessions',
            },
            {
              icon: '⚙️',
              title: 'Customizable',
              description: 'Adjust thresholds and preferences to match your needs',
            },
          ].map((feature, i) => (
            <div key={i} className="card space-y-3">
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary/5 rounded-2xl px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Active Sessions', value: '1,234' },
            { label: 'Total Hours Tracked', value: '12,456' },
            { label: 'Avg Focus Score', value: '87%' },
            { label: 'Users Worldwide', value: '5K+' },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold text-balance">Ready to Improve Your Focus?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start monitoring your study sessions today and unlock your full potential with
          AI-powered insights.
        </p>
        <Link
          href="/monitoring"
          className="btn-primary px-8 py-3 font-semibold inline-block"
        >
          Begin Your Session
        </Link>
      </section>
    </div>
  )
}
