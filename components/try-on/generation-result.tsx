"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, RotateCcw, Heart } from "lucide-react"
import Image from "next/image"

interface GenerationResultProps {
  resultImage: string
  onTryAgain: () => void
  onSave?: () => void
  onShare?: () => void
  className?: string
}

export function GenerationResult({ resultImage, onTryAgain, onSave, onShare, className = "" }: GenerationResultProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = resultImage
    link.download = `hairstyle-result-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-center text-primary">Your New Look!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Result Image */}
        <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] rounded-lg overflow-hidden bg-muted">
          <Image
            src={resultImage || "/placeholder.svg"}
            alt="Generated hairstyle result"
            fill
            className="object-cover"
          />
        </div>

        {/* Action Buttons */}
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
            Try Again
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Love your new look? Download and share it with friends!
        </p>
      </CardContent>
    </Card>
  )
}
