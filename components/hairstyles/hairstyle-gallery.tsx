"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HairstyleCard } from "./hairstyle-card"
import { HairstyleService, CategoryService, type Hairstyle } from "@/lib/api"
import { Search, Filter, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Category {
  id: number
  name: string
  description?: string
}

export function HairstyleGallery() {
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const router = useRouter()

  const loadHairstyles = async (reset = false) => {
    try {
      console.log("[v0] Loading hairstyles with params:", { searchTerm, selectedCategoryId })

      if (reset) {
        setLoading(true)
        setHairstyles([])
      } else {
        setLoadingMore(true)
      }

      const offset = reset ? 0 : hairstyles.length

      const selectedCategoryName = selectedCategoryId
        ? categories.find((cat) => cat.id === selectedCategoryId)?.name
        : undefined

      const response = await HairstyleService.getHairstyles({
        search: searchTerm || undefined,
        category: selectedCategoryName,
        limit: 12,
        offset,
      })

      console.log("[v0] Hairstyles response:", response)

      const filteredHairstyles = response.hairstyles.filter((hairstyle) => {
        // Exclude Braids uploaded by the specific user
        if (
          hairstyle.category?.toLowerCase() === "braids" &&
          hairstyle.uploaded_by === "itunu.akinware@medburymedicals.com"
        ) {
          return false
        }
        return true
      })

      if (reset) {
        setHairstyles(filteredHairstyles)
      } else {
        setHairstyles((prev) => [...prev, ...filteredHairstyles])
      }

      setHasMore(response.hairstyles.length === 12)
    } catch (error) {
      console.error("[v0] Failed to load hairstyles:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadCategories = async () => {
    try {
      console.log("[v0] Loading categories...")
      const response = await CategoryService.getCategories()
      console.log("[v0] Categories response:", response)
      setCategories(response.categories)
    } catch (error) {
      console.error("[v0] Failed to load categories:", error)
    }
  }

  useEffect(() => {
    loadCategories()
    loadHairstyles(true)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadHairstyles(true)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCategoryId])

  const handleTryOn = (hairstyle: Hairstyle) => {
    router.push(`/dashboard?hairstyle=${hairstyle.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search hairstyles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedCategoryId?.toString() || "all"}
            onValueChange={(value) => setSelectedCategoryId(value === "all" ? null : Number.parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {hairstyles.length > 0
          ? `Showing ${hairstyles.length} hairstyle${hairstyles.length !== 1 ? "s" : ""}`
          : "No hairstyles found"}
      </div>

      {/* Gallery Grid */}
      {hairstyles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hairstyles.map((hairstyle) => (
              <HairstyleCard key={hairstyle.id} hairstyle={hairstyle} onTryOn={handleTryOn} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center">
              <Button onClick={() => loadHairstyles(false)} disabled={loadingMore} variant="outline">
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
          <div className="text-muted-foreground mb-4">No hairstyles found matching your criteria</div>
          <Button
            onClick={() => {
              setSearchTerm("")
              setSelectedCategoryId(null)
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
