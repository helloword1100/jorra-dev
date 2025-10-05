"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState({
    guest: false,
    user: false
  })
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading({ ...loading, user: true })
    setError("")

    try {
      await login(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading({ ...loading, user: false })
    }
  }

  const handleGuestLogin = async () => {

    setLoading({ ...loading, guest: true })
    setError("")

    try {
      await login('Guest', 'Guest123')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading({ ...loading, guest: false })
    }

  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
        <CardDescription>Sign in to continue your styling journey</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading?.user || loading?.guest}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading?.user || loading?.guest}
            />
          </div>
          {error && <div className="text-destructive text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full hover:cursor-pointer" disabled={loading?.user || loading?.guest}>
            {loading?.user ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <button onClick={onToggleMode} className="text-primary hover:underline font-medium hover:cursor-pointer">
            Sign up
          </button>
        </div>
        {/* <div className="mt-4 text-center text-sm">
          Signin as a{" "}
          <button onClick={handleGuestLogin}
            disabled={loading?.user || loading?.guest}
            className="text-primary hover:underline font-medium hover:cursor-pointer">
            {
              loading?.guest ? (<>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

              </>) : (' Guest')
            }

          </button>
        </div> */}
      </CardContent>
    </Card>
  )
}
