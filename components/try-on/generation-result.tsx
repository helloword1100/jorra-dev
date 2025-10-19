"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Download, Share2, RotateCcw, Heart, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Hairstyle } from "@/lib/api"

interface GenerationResultProps {
  resultImage: string
  onTryAgain: () => void
  onSave?: () => void
  onShare?: () => void
  className?: string
  hairstyle?: Hairstyle
}

export function GenerationResult({
  resultImage,
  onTryAgain,
  onSave,
  onShare,
  className = "",
  hairstyle,
}: GenerationResultProps) {
  const router = useRouter()

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = resultImage
    link.download = `hairstyle-result-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBookAppointment = () => {
    const params = new URLSearchParams()

    if (hairstyle?.id) {
      params.set("hairstyleId", hairstyle.id.toString())
    }

    if (hairstyle?.name) {
      params.set("hairstyleName", hairstyle.name)
    }

    if (resultImage) {
      params.set("image", resultImage)
    }

    params.set("origin", "try-on")

    router.push(`/booking?${params.toString()}`)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg text-primary">Your New Look!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-[3/4] rounded-lg bg-muted md:aspect-[4/5] lg:aspect-[3/4]">
          <Image
            src={resultImage || "/placeholder.svg"}
            alt="Generated hairstyle result"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download
          </Button>
          {onShare && (
            <Button onClick={onShare} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {onSave && (
            <Button onClick={onSave} variant="secondary" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Save
            </Button>
          )}
          <Button onClick={onTryAgain} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
        </div>

        <div className="mt-2">
          <Button
            onClick={handleBookAppointment}
            className="flex w-full items-center justify-center gap-2 bg-[#F13DD4] hover:bg-[#E532C8]"
          >
            <Calendar className="h-4 w-4" />
            Book Appointment
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Love your new look? Download and share it with friends!
        </p>
      </CardContent>
    </Card>
  )
}
