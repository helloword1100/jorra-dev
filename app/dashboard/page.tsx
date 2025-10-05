"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentGenerations } from "@/components/dashboard/recent-generations"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import Featured from "@/components/dashboard/featured"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MobileHeader />

        <div className="flex-1 space-y-6 p-4 md:p-8 pb-20 md:pb-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {user.username}!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">Ready to try some new styles with Jorra?</p>
          </div>

          {/* Main Content Grid - Only Quick Actions and Recent Generations */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickActions />
            <RecentGenerations />
          </div> */}
          <Featured />
        </div>

        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
