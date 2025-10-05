"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Zap, Settings } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { TryOnRequestForm } from "@/components/requests/try-on-request-form"
import { UserRequestStatus } from "@/components/requests/user-request-status"
import { SocialBonusTracker } from "@/components/social/social-bonus-tracker"
import { ShareHistory } from "@/components/social/share-history"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const userData = await AuthService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Failed to load user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{user?.username || "User"}</h2>
              <p className="text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{user?.try_ons || 0}</span>
                <span className="text-muted-foreground">try-ons left</span>
              </div>
              {user?.is_admin && (
                <Badge variant="secondary">
                  <Settings className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Try-On Request Form */}
        <div className="space-y-6">
          <TryOnRequestForm onRequestSubmitted={loadUserProfile} />
          <UserRequestStatus />
        </div>

        {/* Social Features */}
        <div className="space-y-6">
          <SocialBonusTracker />
          <ShareHistory />
        </div>
      </div>
    </div>
  )
}
