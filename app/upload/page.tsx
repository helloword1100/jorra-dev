"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { HairstyleUploadForm } from "@/components/upload/hairstyle-upload-form"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { Upload, Sparkles } from "lucide-react"

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MobileHeader />

        <div className="flex-1 space-y-8 p-6 md:p-8 lg:p-10 pb-20 md:pb-8 lg:pb-10">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <Upload className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">Upload Hairstyle</h1>
                <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">
                  Share your favorite hairstyle with the community and help others discover new looks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Upload → Gallery → Community</span>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <HairstyleUploadForm />
            </div>
          </div>
        </div>

        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
