import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell, Users, Clock, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bell className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground">Smart School Bell</h1>
            <p className="text-xl text-muted-foreground">
              Intelligent attendance management and bell scheduling system for educational institutions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <Bell className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Automated bell schedules with real-time coordination across the school
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <Users className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Quick Attendance</h3>
              <p className="text-sm text-muted-foreground">
                Mark attendance in seconds with bulk operations and one-click actions
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <BarChart3 className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive reports and trends with visual dashboards
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <Clock className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Instant notifications and live status updates for all users
              </p>
            </div>
          </div>

          <div className="pt-16 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">Why Choose Smart School Bell?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
              <div>
                <h3 className="font-semibold text-foreground mb-2">For Administrators</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Centralized system control</li>
                  <li>✓ Comprehensive analytics</li>
                  <li>✓ User management</li>
                  <li>✓ Customizable schedules</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">For Teachers</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Quick attendance marking</li>
                  <li>✓ Simple interface</li>
                  <li>✓ Class-wise reports</li>
                  <li>✓ Instant alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
