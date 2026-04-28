import { supabase } from './supabase'

export type UserRole = 'admin' | 'teacher' | 'coordinator'

export interface User {
  id: string
  email: string
  role: UserRole
  school_id: string
  name: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data as User
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  school_id: string,
  name: string
) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError
    if (!user) throw new Error('No user returned from sign up')

    const { error: dbError } = await supabase.from('users').insert({
      id: user.id,
      email,
      role,
      school_id,
      name,
    })

    if (dbError) throw dbError

    return { success: true, user }
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}
