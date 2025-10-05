"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Twitter, Facebook, Instagram, Link } from "lucide-react"
import { TryOnService, type Share } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

export function ShareHistory() {
  const [shares, setShares] = useState<Share[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadShares()
  }, [])

  const loadShares = async () => {
    try {
      const response = await TryOnService.getMyShares({ limit: 10 })
      setShares(response.shares)
      setTotal(response.total)
    } catch (error) {
      console.error("Failed to load shares:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      default:
        return <Link className="h-4 w-4" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "bg-blue-100 text-blue-800"
      case "facebook":
        return "bg-blue-100 text-blue-800"
      case "instagram":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share History</CardTitle>
        <CardDescription>Your recent shares ({total} total)</CardDescription>
      </CardHeader>
      <CardContent>
        {shares.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No shares yet. Start sharing your hairstyles to earn bonus credits!
          </p>
        ) : (
          <div className="space-y-4">
            {shares.map((share) => (
              <div key={share.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getPlatformColor(share.platform)}>
                    {getPlatformIcon(share.platform)}
                    <span className="ml-1 capitalize">{share.platform}</span>
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">Generation #{share.generation_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(share.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => window.open(share.share_url, "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
