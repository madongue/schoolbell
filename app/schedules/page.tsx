'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ScheduleForm } from '@/components/schedule-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Trash2 } from 'lucide-react'

interface Schedule {
  id: string
  time: string
  label: string
  description: string | null
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchedules()
  }, [])

  async function loadSchedules() {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('time', { ascending: true })

      if (error) throw error
      setSchedules(data || [])
    } catch (error) {
      console.error('Error loading schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSchedule(id: string) {
    try {
      const { error } = await supabase.from('schedules').delete().eq('id', id)
      if (error) throw error
      setSchedules(schedules.filter((s) => s.id !== id))
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">School Schedules</h1>
            <p className="text-muted-foreground">Manage bell times and schedules</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ScheduleForm onSuccess={loadSchedules} />

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Active Schedules</CardTitle>
                  <CardDescription>All configured bell times</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-muted-foreground">Loading schedules...</p>
                  ) : schedules.length === 0 ? (
                    <p className="text-muted-foreground">No schedules created yet</p>
                  ) : (
                    <div className="space-y-3">
                      {schedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold w-20 text-primary">
                                {schedule.time}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{schedule.label}</p>
                                {schedule.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {schedule.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
