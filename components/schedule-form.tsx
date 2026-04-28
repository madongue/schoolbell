'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

interface ScheduleFormProps {
  onSuccess?: () => void
}

export function ScheduleForm({ onSuccess }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    time: '',
    label: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: dbError } = await supabase.from('schedules').insert({
        time: formData.time,
        label: formData.label,
        description: formData.description,
      })

      if (dbError) throw dbError

      setFormData({ time: '', label: '', description: '' })
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Failed to create schedule')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Schedule</CardTitle>
        <CardDescription>Add a new bell time to the schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time (HH:MM)</label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Label</label>
            <Input
              type="text"
              placeholder="e.g., Morning Assembly"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              type="text"
              placeholder="Optional description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Schedule'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
