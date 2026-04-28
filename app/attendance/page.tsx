'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Student {
  id: string
  name: string
  enrollment_number: string
  class: string
}

interface AttendanceRecord {
  student_id: string
  present: boolean
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Map<string, boolean>>(new Map())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedClass, setSelectedClass] = useState('all')
  const [classes, setClasses] = useState<string[]>([])

  useEffect(() => {
    loadStudentsAndClasses()
  }, [])

  async function loadStudentsAndClasses() {
    try {
      const { data: studentData, error } = await supabase
        .from('students')
        .select('id, name, enrollment_number, class')
        .order('class', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error

      const uniqueClasses = ['all', ...new Set((studentData || []).map((s) => s.class))]
      setClasses(uniqueClasses)
      setStudents(studentData || [])

      // Load today's attendance
      const today = new Date().toISOString().split('T')[0]
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('student_id, present')
        .eq('date', today)

      const attendanceMap = new Map<string, boolean>()
      attendanceData?.forEach((record) => {
        attendanceMap.set(record.student_id, record.present)
      })
      setAttendance(attendanceMap)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents =
    selectedClass === 'all' ? students : students.filter((s) => s.class === selectedClass)

  function toggleAttendance(studentId: string) {
    const newAttendance = new Map(attendance)
    newAttendance.set(studentId, !newAttendance.get(studentId))
    setAttendance(newAttendance)
  }

  function markAllPresent() {
    const newAttendance = new Map(attendance)
    filteredStudents.forEach((s) => newAttendance.set(s.id, true))
    setAttendance(newAttendance)
  }

  function markAllAbsent() {
    const newAttendance = new Map(attendance)
    filteredStudents.forEach((s) => newAttendance.set(s.id, false))
    setAttendance(newAttendance)
  }

  async function saveAttendance() {
    setSaving(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const records: AttendanceRecord[] = []

      attendance.forEach((present, studentId) => {
        records.push({ student_id: studentId, present })
      })

      // Delete existing attendance for today
      await supabase.from('attendance').delete().eq('date', today)

      // Insert new attendance records
      if (records.length > 0) {
        const { error } = await supabase.from('attendance').insert(
          records.map((r) => ({
            ...r,
            date: today,
          }))
        )
        if (error) throw error
      }

      alert('Attendance saved successfully!')
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Failed to save attendance')
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
            <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="mb-6 flex gap-4 items-center flex-wrap">
            <div>
              <label className="text-sm font-medium">Filter by Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="mt-2 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls === 'all' ? 'All Classes' : cls}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={markAllPresent} size="sm">
                Mark All Present
              </Button>
              <Button variant="outline" onClick={markAllAbsent} size="sm">
                Mark All Absent
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                {filteredStudents.length} student(s) in {selectedClass === 'all' ? 'all classes' : selectedClass}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading students...</p>
              ) : filteredStudents.length === 0 ? (
                <p className="text-muted-foreground">No students found</p>
              ) : (
                <div className="space-y-2">
                  {filteredStudents.map((student) => {
                    const isPresent = attendance.get(student.id) ?? true
                    return (
                      <button
                        key={student.id}
                        onClick={() => toggleAttendance(student.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-md border transition-colors ${
                          isPresent
                            ? 'border-green-200 bg-green-50 hover:bg-green-100'
                            : 'border-red-200 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left flex-1">
                          {isPresent ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.enrollment_number} • {student.class}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-4">
            <Button onClick={saveAttendance} disabled={saving} size="lg" className="flex-1">
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
