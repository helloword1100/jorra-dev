"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, ExternalLink, Check } from "lucide-react"
import { TryOnService } from "@/lib/api"
import { toast } from "sonner"

export function SocialBonusTracker() {
  const [postUrl, setPostUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleClaimBonus = async () => {
    if (!postUrl.trim()) {
      toast.error("Please enter a valid post URL")
      return
    }

    if (!postUrl.includes("#jorra") && !postUrl.includes("%23jorra")) {
      toast.error("Post must include #jorra hashtag to claim bonus")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await TryOnService.claimSocialMediaBonus(postUrl)

      if (result.success) {
        setClaimed(true)
        toast.success(`Bonus claimed! +${result.credits_added} try-ons added to your account.`)
        setPostUrl("")
      } else {
        toast.error("Unable to verify post. Make sure it's public and includes #jorra")
      }
    } catch (error) {
      console.error("Bonus claim failed:", error)
      toast.error("Failed to claim bonus. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (claimed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <span className="font-medium">Bonus claimed successfully!</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-600" />
          Claim Social Media Bonus
        </CardTitle>
        <CardDescription>Share your hairstyle with #jorra and get 5 bonus try-ons!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="post-url">Post URL</Label>
          <Input
            id="post-url"
            placeholder="https://twitter.com/yourpost or https://instagram.com/p/yourpost"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">Make sure your post is public and includes the #jorra hashtag</p>
        </div>

        <Button onClick={handleClaimBonus} disabled={isSubmitting || !postUrl.trim()} className="w-full">
          {isSubmitting ? "Verifying..." : "Claim 5 Bonus Try-Ons"}
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
