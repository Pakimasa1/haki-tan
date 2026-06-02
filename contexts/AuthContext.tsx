import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { v4 as uuid } from 'uuid'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, username: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_KEY = 'haki-tan-users'
const CURRENT_USER_KEY = 'haki-tan-current-user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const getUsers = (): (User & { password: string })[] => {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  const saveUsers = (users: (User & { password: string })[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers()
    const foundUser = users.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    const users = getUsers()
    if (users.some((u) => u.email === email)) {
      return false
    }
    const newUser: User & { password: string } = {
      id: uuid(),
      email,
      username,
      password,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsers(users)
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))
    const users = getUsers()
    const index = users.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users[index] = { ...users[index], ...data }
      saveUsers(users)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
