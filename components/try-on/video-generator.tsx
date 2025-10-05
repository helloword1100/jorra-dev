"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Sparkles, Clock, Download } from "lucide-react"
import { TryOnService } from "@/lib/api"

interface VideoGeneratorProps {
  generationId: number
  resultImageUrl: string
  onVideoGenerated?: (videoUrl: string) => void
}

export function VideoGenerator({ generationId, resultImageUrl, onVideoGenerated }: VideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateVideo = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const videoBlob = await TryOnService.generateVideo(generationId)
      const url = URL.createObjectURL(videoBlob)
      setVideoUrl(url)
      onVideoGenerated?.(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement("a")
      a.href = videoUrl
      a.download = `jorra-ai-video-${generationId}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10">
              <Video className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Generate Video</CardTitle>
              <CardDescription>Create an animated video of your hairstyle transformation</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-pink-50 text-pink-700 border-pink-200">
            <Sparkles className="h-3 w-3 mr-1" />
            10 Try-ons
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preview Image */}
        <div className="relative rounded-lg overflow-hidden bg-gray-100">
          <img src={resultImageUrl || "/placeholder.svg"} alt="Hairstyle result" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Video Player */}
        {videoUrl && (
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            <video src={videoUrl} controls className="w-full h-48 object-cover" poster={resultImageUrl} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!videoUrl ? (
            <Button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Generate Video
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleGenerateVideo}
                disabled={isGenerating}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Video className="h-4 w-4 mr-2" />
                Generate New
              </Button>
              <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>

        {/* Feature Description */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-pink-800 mb-1">Premium Video Generation</p>
              <p>
                Transform your static hairstyle into a dynamic video showing the transformation process. Perfect for
                sharing on social media!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
