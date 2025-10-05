"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Sparkles, Upload, Battery as Gallery, History, Scissors } from "lucide-react"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Try On Hairstyles",
      description: "Upload a selfie and try different looks",
      icon: Sparkles,
      onClick: () => router.push("/try-on"),
      primary: true,
    },
    {
      title: "Browse Gallery",
      description: "Explore trending hairstyles",
      icon: Gallery,
      onClick: () => router.push("/gallery"),
    },
    {
      title: "Upload Style",
      description: "Share your own hairstyle",
      icon: Upload,
      onClick: () => router.push("/upload"),
    },
    {
      title: "View History",
      description: "See your past generations",
      icon: History,
      onClick: () => router.push("/history"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.primary ? "default" : "outline"}
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={action.onClick}
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className="h-4 w-4" />
              <span className="font-medium">{action.title}</span>
            </div>
            <span className="text-xs text-left opacity-80">{action.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
