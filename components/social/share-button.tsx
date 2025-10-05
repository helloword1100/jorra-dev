"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Twitter, Facebook, Link } from "lucide-react"
import { TryOnService } from "@/lib/api"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ShareButtonProps {
  generationId: number
  imageUrl: string
  title?: string
  description?: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
}

export function ShareButton({
  generationId,
  imageUrl,
  title = "Check out my new hairstyle!",
  description = "Generated with Jorra - try it yourself! #jorra",
  className,
  variant = "outline",
  size = "default",
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const getShareUrl = async () => {
    if (shareUrl) return shareUrl

    try {
      setIsSharing(true)
      const shareData = await TryOnService.shareGeneration(generationId, "twitter")
      setShareUrl(shareData.share_url)
      return shareData.share_url
    } catch (error) {
      console.error("Failed to get share URL:", error)
      toast.error("Failed to generate share link")
      return null
    } finally {
      setIsSharing(false)
    }
  }

  const handleTwitterShare = async () => {
    const url = await getShareUrl()
    if (!url) return

    try {
      const shareText = `${title} ${description}`
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
      window.open(twitterUrl, "_blank", "width=550,height=420")

      await TryOnService.shareGeneration(generationId, "twitter")
      toast.success("Shared to Twitter! Don't forget to use #jorra for bonus credits.")
    } catch (error) {
      console.error("Twitter share failed:", error)
      toast.error("Failed to share to Twitter")
    }
  }

  const handleFacebookShare = async () => {
    const url = await getShareUrl()
    if (!url) return

    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${title} ${description}`)}`
      window.open(facebookUrl, "_blank", "width=550,height=420")

      await TryOnService.shareGeneration(generationId, "facebook")
      toast.success("Shared to Facebook! Don't forget to use #jorra for bonus credits.")
    } catch (error) {
      console.error("Facebook share failed:", error)
      toast.error("Failed to share to Facebook")
    }
  }

  const handleCopyLink = async () => {
    const url = await getShareUrl()
    if (!url) return

    try {
      await navigator.clipboard.writeText(url)
      await TryOnService.shareGeneration(generationId, "copy")
      toast.success("Share link copied to clipboard!")
    } catch (error) {
      console.error("Copy failed:", error)
      toast.error("Failed to copy link")
    }
  }

  const handleNativeShare = async () => {
    const url = await getShareUrl()
    if (!url) return

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url,
        })
        await TryOnService.shareGeneration(generationId, "native")
      }
    } catch (error) {
      console.error("Native share failed:", error)
    }
  }

  const hasNativeShare = typeof navigator !== "undefined" && navigator.share

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isSharing}>
          <Share2 className="h-4 w-4 mr-2" />
          {isSharing ? "Loading..." : "Share"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {hasNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share...
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="h-4 w-4 mr-2 text-blue-500" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink}>
          <Link className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
