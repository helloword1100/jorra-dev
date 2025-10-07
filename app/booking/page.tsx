"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { CheckCircle2, MapPin, ArrowLeft } from "lucide-react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Salon = {
  id: string
  name: string
  address: string
  distance: string
  specialties: string[]
}

const SAMPLE_SALONS: Salon[] = [
  {
    id: "niyo-beauty",
    name: "Niyo Beauty Bar",
    address: "14 Camden High Street, London",
    distance: "1.2 km away",
    specialties: ["Protective Styles", "Loc Maintenance"],
  },
  {
    id: "curl-collective",
    name: "Curl Collective Studio",
    address: "22 Brick Lane, Shoreditch",
    distance: "2.1 km away",
    specialties: ["Silk Press", "Colour Services"],
  },
  {
    id: "mane-garden",
    name: "The Mane Garden",
    address: "5 Market Street, Peckham",
    distance: "3.4 km away",
    specialties: ["Braids", "Afro Cuts"],
  },
]

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const imageKey = searchParams.get("imageKey")
  const imageParam = searchParams.get("image")
  const [generatedImage, setGeneratedImage] = useState<string>(imageParam || "")
  const hairstyleName = searchParams.get("hairstyleName") || "Selected hairstyle"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedSalonId, setSelectedSalonId] = useState<string>(SAMPLE_SALONS[0]?.id ?? "")
  const [submitted, setSubmitted] = useState(false)

  const isFormValid = useMemo(() => name.trim().length > 1 && /\S+@\S+\.\S+/.test(email), [name, email])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (imageKey) {
      const storedImage = sessionStorage.getItem(imageKey)
      if (storedImage) {
        setGeneratedImage(storedImage)
        sessionStorage.removeItem(imageKey)
        return
      }
    }

    if (imageParam) {
      try {
        setGeneratedImage(decodeURIComponent(imageParam))
      } catch {
        setGeneratedImage(imageParam)
      }
    }
  }, [imageKey, imageParam])

  const handleSubmit = () => {
    if (!isFormValid) return
    setSubmitted(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MobileHeader />

        <div className="flex-1 bg-gradient-to-b from-[#F4ECFF] via-white to-white px-4 pb-24 pt-6 md:px-10 md:pb-12 md:pt-10">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="text-xs uppercase tracking-[0.3em] text-[#F13DD4]">Secure your seat</div>
            </div>

            <Card className="overflow-hidden border-none shadow-lg ring-1 ring-black/5">
              <CardHeader className="border-b bg-white/85">
                <CardTitle className="flex flex-col gap-2 text-2xl font-bold text-[#1F1F1F] md:flex-row md:items-end md:justify-between">
                  <span>Book Your Appointment</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {hairstyleName ? `Look: ${hairstyleName}` : "Your selected look"}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-8 bg-white/90 p-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.6fr)] md:p-10">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Your name</Label>
                      <Input
                        id="name"
                        placeholder="Ada Lovelace"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-base font-semibold text-[#1F1F1F]">Choose a salon partner</h2>
                    <div className="grid gap-3">
                      {SAMPLE_SALONS.map((salon) => {
                        const isSelected = salon.id === selectedSalonId
                        return (
                          <button
                            key={salon.id}
                            type="button"
                            onClick={() => setSelectedSalonId(salon.id)}
                            className={cn(
                              "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                              isSelected
                                ? "border-[#F13DD4] bg-[#FFF2FB] shadow-sm"
                                : "border-border/40 hover:border-[#F13DD4]/40 bg-white",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border",
                                isSelected
                                  ? "border-[#F13DD4] bg-[#F13DD4] text-white"
                                  : "border-muted-foreground/40 text-transparent",
                              )}
                            >
                              ✓
                            </span>
                            <div className="flex-1">
                              <p className="font-semibold text-[#1F1F1F]">{salon.name}</p>
                              <p className="text-sm text-muted-foreground">{salon.address}</p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-[#F13DD4]">
                                <MapPin className="h-3 w-3" />
                                {salon.distance}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                {salon.specialties.map((tag) => (
                                  <span key={tag} className="rounded-full bg-muted px-2 py-0.5">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                      className="order-2 sm:order-1 sm:w-auto"
                    >
                      Start another look
                    </Button>
                    <Button
                      className="order-1 bg-[#F13DD4] text-white hover:bg-[#E532C8] sm:order-2 sm:w-auto"
                      disabled={!isFormValid || submitted}
                      onClick={handleSubmit}
                    >
                      {submitted ? "Request sent" : "Send booking request"}
                    </Button>
                  </div>

                  {submitted && (
                    <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Thanks {name.split(" ")[0] || name}! We&apos;ll reach out shortly to confirm your appointment.
                    </div>
                  )}
                </div>

                <aside className="space-y-4 rounded-3xl bg-[#F9F5FF] p-5">
                  <div>
                    <h3 className="text-base font-semibold text-[#1F1F1F]">Your look</h3>
                    <p className="text-sm text-muted-foreground">
                      Share this preview with your stylist so they know exactly what to recreate.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-3xl bg-white shadow-inner">
                    {generatedImage ? (
                      <Image
                        src={generatedImage}
                        alt={hairstyleName}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-white to-[#F4ECFF] text-sm text-muted-foreground">
                        Generated preview will appear here.
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl bg-white/90 p-4 text-sm text-muted-foreground shadow-sm">
                    <p className="font-medium text-[#1F1F1F]">Need changes?</p>
                    <p className="mt-1">
                      Reply to your confirmation email with any tweaks or notes before the appointment.
                    </p>
                  </div>
                </aside>
              </CardContent>
            </Card>
          </div>
        </div>

        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
