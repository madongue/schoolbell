'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { Edit2, Trash2, Plus } from 'lucide-react'

interface Student {
  id: string
  name: string
  enrollment_number: string
  email: string
  class: string
  phone: string | null
}

interface FormData {
  name: string
  enrollment_number: string
  email: string
  class: string
  phone: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    enrollment_number: '',
    email: '',
    class: '',
    phone: '',
  })
  const [classes, setClasses] = useState<string[]>([])

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('class', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error

      setStudents(data || [])

      // Extract unique classes
      const uniqueClasses = [...new Set((data || []).map((s) => s.class))]
      setClasses(uniqueClasses.sort())
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      enrollment_number: '',
      email: '',
      class: '',
      phone: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  function editStudent(student: Student) {
    setFormData({
      name: student.name,
      enrollment_number: student.enrollment_number,
      email: student.email,
      class: student.class,
      phone: student.phone || '',
    })
    setEditingId(student.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (editingId) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Create new student
        const { error } = await supabase.from('students').insert(formData)

        if (error) throw error
      }

      await loadStudents()
      resetForm()
    } catch (error) {
      console.error('Error saving student:', error)
      alert('Failed to save student')
    }
  }

  async function deleteStudent(id: string) {
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      const { error } = await supabase.from('students').delete().eq('id', id)

      if (error) throw error

      await loadStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student')
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
              <p className="text-muted-foreground">Add, edit, and manage student information</p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="flex gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            )}
          </div>

          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Student' : 'Add New Student'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Enrollment Number</label>
                      <Input
                        value={formData.enrollment_number}
                        onChange={(e) =>
                          setFormData({ ...formData, enrollment_number: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Class</label>
                      <select
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        required
                      >
                        <option value="">Select or type class</option>
                        {classes.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone (Optional)</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={resetForm} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">{editingId ? 'Update' : 'Add'} Student</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>{students.length} students registered</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading students...</p>
              ) : students.length === 0 ? (
                <p className="text-muted-foreground">No students found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-semibold">Name</th>
                        <th className="text-left py-2 px-4 font-semibold">Enrollment</th>
                        <th className="text-left py-2 px-4 font-semibold">Email</th>
                        <th className="text-left py-2 px-4 font-semibold">Class</th>
                        <th className="text-left py-2 px-4 font-semibold">Phone</th>
                        <th className="text-right py-2 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-accent/50">
                          <td className="py-2 px-4">{student.name}</td>
                          <td className="py-2 px-4 text-muted-foreground">
                            {student.enrollment_number}
                          </td>
                          <td className="py-2 px-4 text-muted-foreground text-xs">
                            {student.email}
                          </td>
                          <td className="py-2 px-4">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                              {student.class}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-muted-foreground">
                            {student.phone || '—'}
                          </td>
                          <td className="py-2 px-4 text-right flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editStudent(student)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteStudent(student.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
