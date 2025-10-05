"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { HairstyleService, type Hairstyle } from "@/lib/api"
import { Search, Scissors, Check } from "lucide-react"
import Image from "next/image"

interface HairstyleSelectorProps {
  selectedHairstyle?: Hairstyle
  onHairstyleSelect: (hairstyle: Hairstyle) => void
  className?: string
}

export function HairstyleSelector({ selectedHairstyle, onHairstyleSelect, className = "" }: HairstyleSelectorProps) {
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const loadHairstyles = async () => {
    try {
      setLoading(true)
      const response = await HairstyleService.getHairstyles({
        search: searchTerm || undefined,
        limit: 20,
      })
      setHairstyles(response.hairstyles)
    } catch (error) {
      console.error("Failed to load hairstyles:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadHairstyles()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://try-on-local.docwyn.com"

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          Choose a Hairstyle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search hairstyles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selected Hairstyle */}
        {selectedHairstyle && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={
                    selectedHairstyle.image_url.startsWith("http")
                      ? selectedHairstyle.image_url
                      : `${API_BASE_URL}${selectedHairstyle.image_url}`
                  }
                  alt={selectedHairstyle.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{selectedHairstyle.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {selectedHairstyle.category}
                </Badge>
              </div>
              <Check className="h-5 w-5 text-primary" />
            </div>
          </div>
        )}

        {/* Hairstyle Grid */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : hairstyles.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {hairstyles.map((hairstyle) => (
                <button
                  key={hairstyle.id}
                  onClick={() => onHairstyleSelect(hairstyle)}
                  className={`
                    relative group overflow-hidden rounded-lg border-2 transition-all duration-200
                    ${
                      selectedHairstyle?.id === hairstyle.id
                        ? "border-primary shadow-md"
                        : "border-transparent hover:border-primary/50"
                    }
                  `}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={
                        hairstyle.image_url.startsWith("http")
                          ? hairstyle.image_url
                          : `${API_BASE_URL}${hairstyle.image_url}`
                      }
                      alt={hairstyle.name}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {selectedHairstyle?.id === hairstyle.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary rounded-full p-1">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-card">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{hairstyle.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {hairstyle.category}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hairstyles found</p>
              {searchTerm && (
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("")} className="mt-2">
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
