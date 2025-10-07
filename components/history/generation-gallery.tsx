"use client"

import { useState, useEffect } from "react"
import { GenerationCard } from "./generation-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TryOnService, type Generation } from "@/lib/api"
import { Filter, Loader2, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export function GenerationGallery() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const router = useRouter()

  const loadGenerations = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setGenerations([])
      } else {
        setLoadingMore(true)
      }

      const offset = reset ? 0 : generations.length
      const response = await TryOnService.getMyGenerations({
        limit: 12,
        offset,
      })

      const sortedGenerations = [...response.generations]
      if (sortBy === "oldest") {
        sortedGenerations.reverse()
      }

      if (reset) {
        setGenerations(sortedGenerations)
      } else {
        setGenerations((prev) => [...prev, ...sortedGenerations])
      }

      setHasMore(response.generations.length === 12)
    } catch (error) {
      console.error("Failed to load generations:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadGenerations(true)
  }, [sortBy])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">Your Generations ({generations.length})</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: "newest" | "oldest") => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gallery Grid */}
      {generations.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generations.map((generation) => (
              <GenerationCard key={generation.id} generation={generation} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center">
              <Button onClick={() => loadGenerations(false)} disabled={loadingMore} variant="outline">
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No generations yet</h3>
          <p className="text-muted-foreground mb-6">Start creating your first hairstyle generation to see them here</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/dashboard")}>Try On Hairstyles</Button>
            <Button variant="outline" onClick={() => router.push("/gallery")}>
              Browse Gallery
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
