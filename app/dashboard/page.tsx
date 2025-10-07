"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
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

        <div className="flex-1 bg-gradient-to-b from-[#F4ECFF] via-white to-white px-4 pb-24 pt-6 md:px-10 md:pb-12 md:pt-10">
          <div className="mx-auto w-full max-w-5xl">
            <Featured username={user.username} />
          </div>
        </div>

        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
