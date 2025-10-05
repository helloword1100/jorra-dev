"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Generation } from "@/lib/api"
import { Download, RotateCcw, Calendar } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShareButton } from "@/components/social/share-button"

interface GenerationCardProps {
  generation: Generation
  onDownload?: (generation: Generation) => void
  onShare?: (generation: Generation) => void
  onTryAgain?: (generation: Generation) => void
}

export function GenerationCard({ generation, onDownload, onShare, onTryAgain }: GenerationCardProps) {
  const router = useRouter()
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://try-on-local.docwyn.com"

  const resultUrl = generation.result_url.startsWith("http")
    ? generation.result_url
    : `${API_BASE_URL}${generation.result_url}`

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = resultUrl
    link.download = `hairstyle-result-${generation.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onDownload?.(generation)
  }

  const handleTryAgain = () => {
    if (generation.hairstyle) {
      router.push(`/try-on?hairstyle=${generation.hairstyle.id}`)
    } else {
      router.push("/try-on")
    }
    onTryAgain?.(generation)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={resultUrl || "/placeholder.svg"}
          alt="Generated hairstyle result"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Button size="sm" onClick={handleDownload} className="bg-white/90 hover:bg-white text-foreground">
              <Download className="h-4 w-4" />
            </Button>
            <ShareButton
              generationId={generation.id}
              imageUrl={resultUrl}
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
            <Button
              size="sm"
              onClick={handleTryAgain}
              className="bg-primary/90 hover:bg-primary text-primary-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            {generation.hairstyle ? (
              <div>
                <h3 className="font-medium text-foreground line-clamp-1">{generation.hairstyle.name}</h3>
                <p className="text-sm text-muted-foreground">Applied hairstyle</p>
              </div>
            ) : (
              <div>
                <h3 className="font-medium text-foreground">Custom Upload</h3>
                <p className="text-sm text-muted-foreground">Uploaded hairstyle</p>
              </div>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(generation.created_at)}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Button variant="ghost" size="sm" onClick={handleDownload} className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTryAgain}
            className="text-xs text-primary hover:text-primary"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
