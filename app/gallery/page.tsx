"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { HairstyleGallery } from "@/components/hairstyles/hairstyle-gallery"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"

export default function GalleryPage() {
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

        {/* Gallery Content */}
        <div className="flex-1 space-y-6 p-4 md:p-8 pb-20 md:pb-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">Hairstyle Gallery</h1>
              <p className="text-xs md:text-base text-muted-foreground">Discover and try on amazing hairstyles</p>
            </div>
            <Button onClick={() => router.push("/upload")} size="sm" className="md:h-10">
              <Upload className="h-4 w-4 mr-0 md:mr-2" />
              <span className="hidden md:inline">Upload Style</span>
            </Button>
          </div>

          {/* Gallery Content */}
          <HairstyleGallery />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
