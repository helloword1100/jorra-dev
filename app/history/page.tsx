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

  const isGuestUser = user.username.trim().toLowerCase() === "guest"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MobileHeader />

        <div className="flex-1 space-y-6 p-4 md:p-8 pb-20 md:pb-8">
          {isGuestUser ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-[#F13DD4]/40 bg-[#FFF2FB] px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F13DD4]/10">
                <History className="h-8 w-8 text-[#F13DD4]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-[#1F1F1F]">History unavailable for guest accounts</h2>
                <p className="text-sm text-muted-foreground">
                  Create a free account to save, review, and share your past hairstyle generations.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => router.push("/auth")}
                  className="bg-[#F13DD4] hover:bg-[#E034C8] text-white sm:min-w-[180px]"
                >
                  Create an account
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")} className="sm:min-w-[180px]">
                  Back to dashboard
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#F13DD4] rounded-lg p-2">
                    <History className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">Generation History</h1>
                    <p className="text-xs md:text-base text-muted-foreground">View and manage your past creations</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/dashboard")}
                  size="sm"
                  className="md:h-10 bg-[#F13DD4] hover:cursor-pointer hover:bg-[#F13DD4]"
                >
                  <Sparkles className="h-4 w-4 mr-0 md:mr-2" />
                  <span className="hidden md:inline">Create New</span>
                </Button>
              </div>

              {/* History Content */}
              <GenerationGallery />
            </>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
