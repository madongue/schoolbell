'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AttendanceStats {
  date: string
  present: number
  absent: number
}

interface ClassStats {
  class: string
  students: number
  present: number
  absent: number
}

export default function ReportsPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceStats[]>([])
  const [classData, setClassData] = useState<ClassStats[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7') // days

  useEffect(() => {
    loadReportData()
  }, [dateRange])

  async function loadReportData() {
    try {
      const days = parseInt(dateRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      const startDateStr = startDate.toISOString().split('T')[0]

      // Get attendance data for the date range
      const { data: attendanceRaw } = await supabase
        .from('attendance')
        .select('date, present')
        .gte('date', startDateStr)

      // Group attendance by date
      const grouped = new Map<string, { present: number; absent: number }>()
      attendanceRaw?.forEach((record) => {
        if (!grouped.has(record.date)) {
          grouped.set(record.date, { present: 0, absent: 0 })
        }
        const data = grouped.get(record.date)!
        if (record.present) {
          data.present++
        } else {
          data.absent++
        }
      })

      const chartData = Array.from(grouped.entries())
        .map(([date, counts]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          present: counts.present,
          absent: counts.absent,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setAttendanceData(chartData)

      // Get class-wise attendance
      const { data: classStudents } = await supabase
        .from('students')
        .select('id, class')

      const { data: classAttendance } = await supabase
        .from('attendance')
        .select('student_id, present')
        .gte('date', startDateStr)

      const classMap = new Map<string, { students: Set<string>; present: number; absent: number }>()

      classStudents?.forEach((student) => {
        if (!classMap.has(student.class)) {
          classMap.set(student.class, { students: new Set(), present: 0, absent: 0 })
        }
        classMap.get(student.class)!.students.add(student.id)
      })

      classAttendance?.forEach((record) => {
        const studentClass = classStudents?.find((s) => s.id === record.student_id)?.class
        if (studentClass && classMap.has(studentClass)) {
          const data = classMap.get(studentClass)!
          if (record.present) {
            data.present++
          } else {
            data.absent++
          }
        }
      })

      const classChartData = Array.from(classMap.entries())
        .map(([className, data]) => ({
          class: className,
          students: data.students.size,
          present: data.present,
          absent: data.absent,
        }))
        .sort((a, b) => a.class.localeCompare(b.class))

      setClassData(classChartData)
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const colors = ['#10b981', '#ef4444']

  const totalPresent = attendanceData.reduce((sum, d) => sum + d.present, 0)
  const totalAbsent = attendanceData.reduce((sum, d) => sum + d.absent, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Attendance trends and statistics</p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="mt-2 px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading reports...</p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Summary</CardTitle>
                    <CardDescription>Total records in selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Present</span>
                        <span className="font-semibold text-green-600">{totalPresent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Absent</span>
                        <span className="font-semibold text-red-600">{totalAbsent}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-sm font-medium">Total</span>
                        <span className="font-semibold">{totalPresent + totalAbsent}</span>
                      </div>
                      {totalPresent + totalAbsent > 0 && (
                        <div className="flex justify-between pt-2">
                          <span className="text-sm text-muted-foreground">Attendance Rate</span>
                          <span className="font-semibold text-green-600">
                            {((totalPresent / (totalPresent + totalAbsent)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Today&apos;s Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {attendanceData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Present', value: attendanceData[attendanceData.length - 1]?.present || 0 },
                              { name: 'Absent', value: attendanceData[attendanceData.length - 1]?.absent || 0 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {[colors[0], colors[1]].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted-foreground">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trend</CardTitle>
                  <CardDescription>Daily present and absent records</CardDescription>
                </CardHeader>
                <CardContent>
                  {attendanceData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="present" stroke={colors[0]} name="Present" />
                        <Line type="monotone" dataKey="absent" stroke={colors[1]} name="Absent" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Class-wise Statistics</CardTitle>
                  <CardDescription>Attendance by class</CardDescription>
                </CardHeader>
                <CardContent>
                  {classData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={classData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="class" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" fill={colors[0]} name="Present" />
                        <Bar dataKey="absent" fill={colors[1]} name="Absent" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
