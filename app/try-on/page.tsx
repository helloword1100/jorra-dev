"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { SelfieUpload } from "@/components/try-on/selfie-upload"
import { HairstyleSelector } from "@/components/try-on/hairstyle-selector"
import { GenerationResult } from "@/components/try-on/generation-result"
import { InspirationalProgress } from "@/components/ui/inspirational-progress"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TryOnService, HairstyleService, type Hairstyle } from "@/lib/api"
import { Sparkles, AlertCircle } from "lucide-react"

export default function TryOnPage() {
  const { user, loading: authLoading, refreshUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedHairstyleId = searchParams.get("hairstyle")

  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")

  // Load preselected hairstyle if provided
  useEffect(() => {
    if (preselectedHairstyleId && !selectedHairstyle) {
      const loadHairstyle = async () => {
        try {
          const hairstyle = await HairstyleService.getHairstyle(Number.parseInt(preselectedHairstyleId))
          setSelectedHairstyle(hairstyle)
        } catch (error) {
          console.error("Failed to load preselected hairstyle:", error)
        }
      }
      loadHairstyle()
    }
  }, [preselectedHairstyleId, selectedHairstyle])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  const handleGenerate = async () => {
    if (!selfieFile || !selectedHairstyle || !user) return

    if (user.try_ons <= 0) {
      setError("You have no try-ons remaining. Please reset your try-ons or wait for them to refresh.")
      return
    }

    setGenerating(true)
    setError("")
    setResultImage(null)

    try {
      const resultBlob = await TryOnService.applyHairstyleById(selectedHairstyle.id, selfieFile)
      const imageUrl = URL.createObjectURL(resultBlob)
      setResultImage(imageUrl)

      // Refresh user data to update try-ons count
      await refreshUser()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate hairstyle")
    } finally {
      setGenerating(false)
    }
  }

  const handleTryAgain = () => {
    setResultImage(null)
    setError("")
  }

  const handleRemoveSelfie = () => {
    setSelfieFile(null)
    setResultImage(null)
    setError("")
  }

  if (authLoading) {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">Try On Hairstyles</h1>
                <p className="text-xs md:text-base text-muted-foreground">See how you look with different styles</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm text-muted-foreground">Try-ons remaining</p>
              <p className="text-xl md:text-2xl font-bold text-primary">{user.try_ons}</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {generating && (
              <InspirationalProgress
                isActive={generating}
                duration={20000}
                onComplete={() => {
                  // Progress bar completed, but generation might still be running
                  console.log("[v0] Progress bar completed")
                }}
              />
            )}

            {!generating && !resultImage ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SelfieUpload
                  onImageSelect={setSelfieFile}
                  selectedImage={selfieFile || undefined}
                  onRemoveImage={handleRemoveSelfie}
                />

                <HairstyleSelector
                  selectedHairstyle={selectedHairstyle || undefined}
                  onHairstyleSelect={setSelectedHairstyle}
                />
              </div>
            ) : !generating && resultImage ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 text-center">Original</h3>
                    <div className="aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] relative rounded-lg overflow-hidden">
                      {selfieFile && (
                        <img
                          src={URL.createObjectURL(selfieFile) || "/placeholder.svg"}
                          alt="Original selfie"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 text-center">Hairstyle</h3>
                    <div className="aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] relative rounded-lg overflow-hidden">
                      {selectedHairstyle && (
                        <img
                          src={
                            selectedHairstyle.image_url.startsWith("http")
                              ? selectedHairstyle.image_url
                              : `${process.env.NEXT_PUBLIC_API_URL || "https://try-on-local.docwyn.com"}${selectedHairstyle.image_url}`
                          }
                          alt={selectedHairstyle.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-sm font-medium text-center mt-2">{selectedHairstyle?.name}</p>
                  </CardContent>
                </Card>

                <GenerationResult resultImage={resultImage} onTryAgain={handleTryAgain} />
              </div>
            ) : null}

            {!generating && !resultImage && (
              <div className="mt-8 text-center">
                {error && (
                  <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!selfieFile || !selectedHairstyle || generating || user.try_ons <= 0}
                  size="lg"
                  className="px-8"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate My Look
                </Button>

                {user.try_ons <= 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No try-ons remaining. Contact support to reset your try-ons.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
