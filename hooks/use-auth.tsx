"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"

interface User {
  username: string
  try_ons: number
  user_id: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      console.log("[v0] Refreshing user data...")
      const userData = await AuthService.getCurrentUser()
      console.log("[v0] User data received:", userData)
      setUser(userData)
    } catch (error) {
      console.log("[v0] Failed to refresh user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (username: string, password: string) => {
    console.log("[v0] Attempting login for:", username)
    try {
      const response = await AuthService.login(username, password)
      console.log("[v0] Login response:", response)

      const userData = {
        username: response.username,
        try_ons: response.try_ons,
        user_id: 0, // Temporary ID, will be updated if /me works
      }
      setUser(userData)

      console.log("[v0] Navigating to dashboard...")
      router.push("/dashboard")

      setTimeout(async () => {
        try {
          const fullUserData = await AuthService.getCurrentUser()
          if (fullUserData) {
            setUser(fullUserData)
          }
        } catch (error) {
          console.log("[v0] Background user refresh failed:", error)
          return error
        }
      }, 100)
    } catch (error) {
      console.log("[v0] Login error:", error)
      throw error
    }
  }

  const signup = async (username: string, password: string) => {
    console.log("[v0] Attempting signup for:", username)
    try {
      const response = await AuthService.signup(username, password)
      console.log("[v0] Signup response:", response)

      const userData = {
        username: response.username,
        try_ons: response.try_ons,
        user_id: 0, // Temporary ID
      }
      setUser(userData)

      console.log("[v0] Navigating to dashboard...")
      router.push("/dashboard")

      setTimeout(async () => {
        try {
          const fullUserData = await AuthService.getCurrentUser()
          if (fullUserData) {
            setUser(fullUserData)
          }
        } catch (error) {
          console.log("[v0] Background user refresh failed:", error)
        }
      }, 100)
    } catch (error) {
      console.log("[v0] Signup error:", error)
      throw error
    }
  }

  const logout = () => {
    console.log("[v0] Logging out user")
    AuthService.logout()
    setUser(null)
    router.push("/auth")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
