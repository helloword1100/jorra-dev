"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Hairstyle } from "@/lib/api"
import { Heart, Scissors } from "lucide-react"
import Image from "next/image"

interface HairstyleCardProps {
  hairstyle: Hairstyle
  onTryOn: (hairstyle: Hairstyle) => void
  onLike?: (hairstyle: Hairstyle) => void
  isLiked?: boolean
}

export function HairstyleCard({ hairstyle, onTryOn, onLike, isLiked }: HairstyleCardProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://try-on-local.docwyn.com"
  const imageUrl = hairstyle.image_url.startsWith("http")
    ? hairstyle.image_url
    : `${API_BASE_URL}${hairstyle.image_url}`

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={hairstyle.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action buttons overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onTryOn(hairstyle)}
              className="bg-primary/90 hover:bg-primary text-primary-foreground"
            >
              <Scissors className="h-4 w-4 mr-1" />
              Try On
            </Button>
            {onLike && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onLike(hairstyle)}
                className="bg-white/90 hover:bg-white text-foreground"
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{hairstyle.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {hairstyle.category}
          </Badge>
        </div>

        {hairstyle.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{hairstyle.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {hairstyle.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {hairstyle.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{hairstyle.tags.length - 2}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">by {hairstyle.uploaded_by}</span>
        </div>
      </CardContent>
    </Card>
  )
}
