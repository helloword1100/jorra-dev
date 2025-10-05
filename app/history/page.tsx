"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { GenerationGallery } from "@/components/history/generation-gallery"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { History, Sparkles } from "lucide-react"

export default function HistoryPage() {
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
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <History className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">Generation History</h1>
                <p className="text-xs md:text-base text-muted-foreground">View and manage your past creations</p>
              </div>
            </div>
            <Button onClick={() => router.push("/try-on")} size="sm" className="md:h-10">
              <Sparkles className="h-4 w-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Create New</span>
            </Button>
          </div>

          {/* History Content */}
          <GenerationGallery />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
