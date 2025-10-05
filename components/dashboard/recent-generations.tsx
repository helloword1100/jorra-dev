"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TryOnService, type Generation } from "@/lib/api"
import { History, ArrowRight, ImageIcon, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShareButton } from "@/components/social/share-button"

export function RecentGenerations() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadRecentGenerations = async () => {
      try {
        console.log("[v0] Loading recent generations...")
        const response = await TryOnService.getMyGenerations({ limit: 4 })
        console.log("[v0] Recent generations loaded:", response)
        setGenerations(response.generations)
        setError(null)
      } catch (error) {
        console.error("[v0] Failed to load recent generations:", error)
        if (error instanceof Error) {
          if (error.message.includes("DOCTYPE")) {
            setError("API server may not be running properly")
          } else {
            setError(error.message)
          }
        } else {
          setError("Failed to load recent generations")
        }
      } finally {
        setLoading(false)
      }
    }

    loadRecentGenerations()
  }, [])

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://try-on-local.docwyn.com"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Generations
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/history")}
          className="text-primary hover:text-primary"
        >
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">Unable to load generations</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : generations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {generations.map((generation) => (
              <div key={generation.id} className="group relative">
                <div
                  className="aspect-square relative rounded-lg overflow-hidden bg-muted cursor-pointer"
                  onClick={() => router.push("/history")}
                >
                  <Image
                    src={
                      generation.result_url.startsWith("http")
                        ? generation.result_url
                        : `${API_BASE_URL}${generation.result_url}`
                    }
                    alt="Generated hairstyle"
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <ShareButton
                      generationId={generation.id}
                      imageUrl={
                        generation.result_url.startsWith("http")
                          ? generation.result_url
                          : `${API_BASE_URL}${generation.result_url}`
                      }
                      title={
                        generation.hairstyle
                          ? `Check out my ${generation.hairstyle.name} hairstyle!`
                          : "Check out my new hairstyle!"
                      }
                      description="Generated with Jorra - try it yourself! #jorra"
                      variant="outline"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-foreground border-white/20"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {new Date(generation.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No generations yet</p>
            <Button size="sm" onClick={() => router.push("/try-on")}>
              Try Your First Style
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
