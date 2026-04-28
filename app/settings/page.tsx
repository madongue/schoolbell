'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

interface UserSettings {
  name: string
  email: string
  role: string
  school_name: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    role: '',
    school_name: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const user = await getCurrentUser()
      if (!user) return

      // Get school name
      const { data: schoolData } = await supabase
        .from('schools')
        .select('name')
        .eq('id', user.school_id)
        .single()

      setSettings({
        name: user.name,
        email: user.email,
        role: user.role,
        school_name: schoolData?.name || 'Unknown School',
      })
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const user = await getCurrentUser()
      if (!user) return

      const { error } = await supabase
        .from('users')
        .update({ name: settings.name })
        .eq('id', user.id)

      if (error) throw error
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading settings...</p>
          ) : (
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input value={settings.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Input
                      value={settings.role}
                      disabled
                      className="bg-muted"
                      placeholder="Loading..."
                    />
                    <p className="text-xs text-muted-foreground">Contact admin to change role</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School</label>
                    <Input
                      value={settings.school_name}
                      disabled
                      className="bg-muted"
                      placeholder="Loading..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact admin to change school
                    </p>
                  </div>
                  <Button onClick={saveSettings} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Application status and details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Application</p>
                      <p className="font-semibold">Smart School Bell</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-semibold">1.0.0</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold text-green-600">Operational</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>Available system features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded hover:bg-accent/50">
                      <span className="text-sm">Real-time Bell Scheduling</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-accent/50">
                      <span className="text-sm">Attendance Tracking</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-accent/50">
                      <span className="text-sm">Analytics & Reports</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-accent/50">
                      <span className="text-sm">Student Management</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded hover:bg-accent/50">
                      <span className="text-sm">Notifications</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
