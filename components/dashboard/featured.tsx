"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MutableRefObject,
} from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, Camera, AlertCircle, UploadCloud, Check, RefreshCw, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { HairstyleService, TryOnService, type Hairstyle } from "@/lib/api"
import { cn } from "@/lib/utils"

type FeaturedProps = {
  username?: string
  host?: string | null
}

type FeaturedProduct = {
  id: string
  name: string
  description: string
  image: string
}

const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "shampoo-conditioner",
    name: "Shampoo & Conditioner",
    description: "Prep your hair with salon-grade care",
    image: "/placeholder.svg",
  },
  {
    id: "take-down",
    name: "Hair Take Down",
    description: "Gentle removal to protect your strands",
    image: "/placeholder.svg",
  },
  {
    id: "medium-bun",
    name: "Medium Braid Bun",
    description: "Elegant bun for every occasion",
    image: "/placeholder.svg",
  },
  {
    id: "curly-braid",
    name: "French Curly Braid",
    description: "Defined curls with a protective style",
    image: "/placeholder.svg",
  },
]

const HAIR_COLORS = ["#8B4513", "#D2691E", "#2F1B14", "#C0C0C0", "#DEB887", "#F4A460", "#CD853F", "#A0522D", "#800080"]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://try-on-local.docwyn.com"

function resolveImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return "/placeholder-user.jpg"
  }

  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`
}

function dataUrlToFile(dataUrl: string, filename: string) {
  const [header, base64] = dataUrl.split(",")
  const mimeMatch = header?.match(/:(.*?);/)
  const mime = mimeMatch?.[1] || "image/jpeg"
  const binary = atob(base64 || "")
  const length = binary.length
  const array = new Uint8Array(length)
  for (let i = 0; i < length; i += 1) {
    array[i] = binary.charCodeAt(i)
  }
  return new File([array], filename, { type: mime })
}

async function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to convert blob"))
      }
    }
    reader.onerror = () => reject(new Error("Failed to convert blob"))
    reader.readAsDataURL(blob)
  })
}

export default function Featured({ username, host }: FeaturedProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const generationIntervalRef = useRef<number | null>(null)
  const generationStartTimeRef = useRef<number | null>(null)

  const { user, refreshUser } = useAuth()

  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([])
  const [loadingHairstyles, setLoadingHairstyles] = useState(true)
  const [selectedHairstyleId, setSelectedHairstyleId] = useState<string | number | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [formMessage, setFormMessage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCaptureReady, setIsCaptureReady] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationElapsedSeconds, setGenerationElapsedSeconds] = useState(0)
  const [nhbHairStyles, setNHBHairStyles] = useState<any>([]);
  const [loadingNHB, setLoadingNHB] = useState<boolean>(false);


  const getNHBHairStyles = async () => {
    try {
      setLoadingNHB(true);
      const response = await HairstyleService.getNHBHairstyles();

      console.log('nhb hairstyles', response.hairstyles);

      setNHBHairStyles(response.hairstyles);
      setLoadingNHB(false);

    } catch (error) {
      setNHBHairStyles([])
      setLoadingNHB(false);

    }
  }

  useEffect(() => {
    const loadHairstyles = async () => {
      try {
        setLoadingHairstyles(true)
        const response = await HairstyleService.getHairstyles({
          search: "",
          limit: 24,
        })
        setHairstyles(response.hairstyles)
        if (response.hairstyles.length > 0) {
          setSelectedHairstyleId(response.hairstyles[0].id)
        }
      } catch (error) {
        console.error("Failed to load hairstyles:", error)
      } finally {
        setLoadingHairstyles(false)
      }
    }

    void loadHairstyles()
    getNHBHairStyles()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!isCameraActive || capturedPhoto) return

    const video = videoRef.current
    const stream = streamRef.current

    if (!video || !stream) return

    const handleReady = () => {
      setIsCaptureReady(true)
      video.removeEventListener("loadedmetadata", handleReady)
    }

    video.addEventListener("loadedmetadata", handleReady)
    video.srcObject = stream

    const playPromise = video.play()
    if (playPromise instanceof Promise) {
      playPromise.catch((error) => {
        console.warn("Camera playback blocked:", error)
        setCameraError("Unable to start camera preview. Please retry or upload from device.")
      })
    }

    if (video.readyState >= 2) {
      setIsCaptureReady(true)
    }

    const fallbackTimeout = window.setTimeout(() => {
      if (streamRef.current === stream) {
        setIsCaptureReady(true)
      }
    }, 1200)

    return () => {
      window.clearTimeout(fallbackTimeout)
      video.removeEventListener("loadedmetadata", handleReady)
    }
  }, [isCameraActive, capturedPhoto])

  const preselectedHairstyleId = host ?? (searchParams?.get("hairstyle") ?? "jorra")

  useEffect(() => {
    if (!hairstyles.length || !preselectedHairstyleId) return
    const parsedId = Number.parseInt(preselectedHairstyleId, 10)
    if (!Number.isNaN(parsedId)) {
      setSelectedHairstyleId(parsedId)
    }
  }, [hairstyles, preselectedHairstyleId])

  useEffect(() => {
    return () => {
      stopCamera(streamRef, videoRef, setIsCameraActive, setIsCaptureReady)
    }
  }, [])

  useEffect(() => {
    if (!isGenerating) {
      if (generationIntervalRef.current !== null) {
        window.clearInterval(generationIntervalRef.current)
        generationIntervalRef.current = null
      }
      generationStartTimeRef.current = null
      setGenerationProgress(0)
      setGenerationElapsedSeconds(0)
      return
    }

    generationStartTimeRef.current = Date.now()
    const startTime = generationStartTimeRef.current
    if (!startTime) return

    setGenerationProgress(0)
    setGenerationElapsedSeconds(0)

    if (generationIntervalRef.current !== null) {
      window.clearInterval(generationIntervalRef.current)
    }

    generationIntervalRef.current = window.setInterval(() => {
      const elapsedMs = Date.now() - startTime
      const elapsedSeconds = Math.floor(elapsedMs / 1000)
      const cappedSeconds = Math.min(elapsedSeconds, 35)
      const progressValue = Math.min((elapsedMs / 35000) * 100, 100)

      setGenerationElapsedSeconds(cappedSeconds)
      setGenerationProgress((previousValue) => {
        if (previousValue === 100 && progressValue === 100) {
          return previousValue
        }
        return progressValue
      })
    }, 500)

    return () => {
      if (generationIntervalRef.current !== null) {
        window.clearInterval(generationIntervalRef.current)
        generationIntervalRef.current = null
      }
      generationStartTimeRef.current = null
    }
  }, [isGenerating])

  const displayedHairstyles = useMemo(() => {
    if (!hairstyles.length) return []
    return hairstyles.slice(0, Math.max(hairstyles.length, 8))
  }, [hairstyles])

  // Resolve selected hairstyle from either local `hairstyles` or remote `nhbHairStyles`.
  const selectedHairstyle = useMemo(() => {
    if (selectedHairstyleId === null) return null
    const idStr = String(selectedHairstyleId)
    const local = hairstyles.find((s) => String(s.id) === idStr)
    if (local) return local
    const remote = (nhbHairStyles || []).find((s: any) => String(s?.id) === idStr)
    return remote || null
  }, [hairstyles, nhbHairStyles, selectedHairstyleId])

  const isSelectedFromNHB = useMemo(() => {
    if (selectedHairstyleId === null) return false
    const idStr = String(selectedHairstyleId)
    return (nhbHairStyles || []).some((s: any) => String(s?.id) === idStr)
  }, [nhbHairStyles, selectedHairstyleId])

  // const handleBookOnly = () => {
  //   if (!selectedHairstyle) return
  //   const params = new URLSearchParams()
  //   params.set("hairstyleId", String((selectedHairstyle as any).id))
  //   if ((selectedHairstyle as any).name) params.set("hairstyleName", String((selectedHairstyle as any).name))
  //   const imageUrl = (selectedHairstyle as any).image_url || (selectedHairstyle as any).thumbnail?.url
  //   if (imageUrl) params.set("image", String(imageUrl))
  //   params.set("origin", "featured")
  //   if (host === 'NHB') {
  //     router.push(`${process.env.NHB_REDIRECT_URL}/preference/${params.toString()}`)

  //   } else {
  //     router.push(`/booking?${params.toString()}`)

  //   }
  // }

  const handleBookOnly = () => {
    if (!selectedHairstyle) return

    console.log('hey', selectedHairstyle);


    const id = String((selectedHairstyle as any).id)
    const name = (selectedHairstyle as any).name || ""
    const imageUrl =
      (selectedHairstyle as any).image_url || (selectedHairstyle as any).thumbnail?.url || ""

    // For local booking keep existing query format
    const localQ = new URLSearchParams()
    localQ.set("hairstyleId", id)
    if (name) localQ.set("hairstyleName", name)
    if (imageUrl) localQ.set("image", imageUrl)
    localQ.set("origin", "featured")



    if (host === "NHB") {
      // External NHB redirect: /preference/:id?data={...}
      const nhbBase = ("https://nhb-booking-platform.vercel.app").replace(/\/$/, "")
      const payload = {
        hairstyleId: id,
        hairstyleName: name,
        image: imageUrl,
        origin: "featured",
      }
      const dataParam = encodeURIComponent(JSON.stringify(payload))
      const target = `${nhbBase}/preference/${encodeURIComponent(id)}?data=${dataParam}`
      router.push(target)
    } else {
      router.push(`/booking?${localQ.toString()}`)
    }
  }



  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera not supported on this device. Please upload from your gallery.")
      return
    }

    setCameraError(null)
    setFormMessage(null)
    setIsCaptureReady(false)

    try {
      stopCamera(streamRef, videoRef, setIsCameraActive, setIsCaptureReady)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 720 },
          height: { ideal: 960 },
        },
        audio: false,
      })

      streamRef.current = stream
      setIsCameraActive(true)
    } catch (error) {
      console.error("Camera error", error)
      setCameraError("Unable to access camera. Please check permissions or try uploading instead.")
      stopCamera(streamRef, videoRef, setIsCameraActive, setIsCaptureReady)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    if (!video) {
      setFormMessage("Camera feed not ready yet. Please try again.")
      return
    }

    const width = video.videoWidth || 720
    const height = video.videoHeight || 960
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) {
      setFormMessage("Unable to capture photo. Please retry.")
      return
    }

    context.drawImage(video, 0, 0, width, height)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95)
    setCapturedPhoto(dataUrl)
    setFormMessage(null)
    setIsCaptureReady(false)
    stopCamera(streamRef, videoRef, setIsCameraActive, setIsCaptureReady)
  }, [])

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result
      if (typeof result === "string") {
        setCapturedPhoto(result)
        setFormMessage(null)
        setCameraError(null)
      }
    }
    reader.readAsDataURL(file)

    // reset input so same file can be re-selected
    event.target.value = ""
    setIsCaptureReady(false)
    stopCamera(streamRef, videoRef, setIsCameraActive, setIsCaptureReady)
  }

  const handleRetake = () => {
    setCapturedPhoto(null)
    void startCamera()
  }

  const handleGenerate = async () => {
    if (isSelectedFromNHB) {
      setFormMessage("This hairstyle is provided by NHB. Please use 'Book Appointment' to continue.")
      return
    }

    if (!selectedHairstyle) {
      setFormMessage("Select a featured hairstyle to continue.")
      return
    }

    if (!capturedPhoto) {
      setFormMessage("Capture or upload a selfie to get started.")
      return
    }

    // if (user && user.try_ons <= 0) {
    //   setFormMessage("You have no try-ons remaining. Please contact support to refresh your balance.")
    //   return
    // }

    setFormMessage(null)
    setIsGenerating(true)

    try {
      const selfieFile = dataUrlToFile(capturedPhoto, "selfie.jpg")
      const hairstyleIdForApi = (selectedHairstyle as any).id
      const resultBlob = await TryOnService.applyHairstyleById(hairstyleIdForApi, selfieFile)
      const resultDataUrl = await blobToDataUrl(resultBlob)

      if (generationIntervalRef.current !== null) {
        window.clearInterval(generationIntervalRef.current)
        generationIntervalRef.current = null
      }
      const totalElapsedSeconds =
        generationStartTimeRef.current !== null
          ? Math.floor((Date.now() - generationStartTimeRef.current) / 1000)
          : generationElapsedSeconds
      setGenerationElapsedSeconds(Math.min(totalElapsedSeconds, 35))
      setGenerationProgress(100)
      generationStartTimeRef.current = null

      await refreshUser().catch(() => undefined)

      stopCamera(streamRef, videoRef, setIsCameraActive, setIsCaptureReady)

      const params = new URLSearchParams({
        hairstyleId: String((selectedHairstyle as any).id),
        hairstyleName: String((selectedHairstyle as any).name || ""),
      })

      if (typeof window !== "undefined") {
        const imageKey = `jorra-generated-${Date.now()}`
        try {
          sessionStorage.setItem(imageKey, resultDataUrl)
          params.set("imageKey", imageKey)
        } catch (error) {
          console.warn("Unable to persist generated image in session storage:", error)
          params.set("image", resultDataUrl)
        }
      } else {
        params.set("image", resultDataUrl)
      }

      router.push(`/booking?${params.toString()}`)
    } catch (error) {
      console.error("Failed to generate hairstyle:", error)
      setFormMessage(
        error instanceof Error ? error.message : "We could not generate your hairstyle. Please try again shortly.",
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const actionButtonLabel = useMemo(() => {
    if (isCameraActive) {
      return isCaptureReady ? "Take photo" : "Camera warming up…"
    }
    if (capturedPhoto) {
      return "Retake with camera"
    }
    return "Open camera"
  }, [capturedPhoto, isCameraActive, isCaptureReady])

  // const isGenerateDisabled =
  //   !capturedPhoto || !selectedHairstyle || isGenerating || (user ? user.try_ons <= 0 : false)

  // If the selected hairstyle is from NHB (other hairstyles), we only allow booking (no selfie/generation required).
  const isGenerateDisabled = isSelectedFromNHB
    ? !selectedHairstyleId || isGenerating
    : !capturedPhoto || !selectedHairstyle || isGenerating

  const progressPercentage = Math.min(Math.round(generationProgress), 100)
  const displayedElapsedSeconds = Math.min(generationElapsedSeconds, 35)
  const isProgressComplete = progressPercentage >= 100

  return (
    <div className="space-y-12">
      {isGenerating && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[min(320px,82vw)] space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_18px_40px_rgba(241,61,212,0.25)] backdrop-blur">
            <div className="flex flex-col items-center gap-5">
              <Image
                src="/header/logo-pink.svg"
                alt="Jorra loader"
                width={96}
                height={96}
                className="animate-[spin_2.4s_linear_infinite] drop-shadow-[0_12px_30px_rgba(241,61,212,0.45)]"
                priority
              />
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">Generating your hairstyle…</p>
                {selectedHairstyle?.name && (
                  <p className="text-sm text-white/80">
                    Applying the <span className="font-medium">{selectedHairstyle.name}</span> look with Jorra magic.
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="bg-white/20" />
              <p className="text-xs font-medium text-white">
                {progressPercentage}% complete · {displayedElapsedSeconds}s / 35s
              </p>
              {isProgressComplete && (
                <p className="text-xs text-white/70">Hang tight—adding the final touches.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#F13DD4]">
          {username ? `Hi ${username}` : "Welcome"}
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1C1C1C] sm:text-4xl">Jorra Try-On Studio</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Frame your face, pick your look, and get matched with a stylist in minutes.
        </p>
      </header>

      <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,0.52fr)_minmax(0,1fr)]">
        <section className="flex flex-col items-center gap-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!capturedPhoto) {
                void startCamera()
              }
            }}
            onKeyDown={(event) => {
              if ((event.key === "Enter" || event.key === " ") && !capturedPhoto) {
                event.preventDefault()
                void startCamera()
              }
            }}
            className="relative w-full max-w-sm focus:outline-none"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-5 shadow-lg transition hover:shadow-xl">
              <div className="relative aspect-square">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-[88%] w-[88%] max-h-[420px] max-w-[420px]">
                    <div className="absolute inset-0 rounded-full bg-neutral-900" />
                    <div className="absolute inset-[6%] rounded-full bg-black/95" />
                    <div className="absolute inset-[6%] overflow-hidden rounded-full bg-black">
                      {isCameraActive && !capturedPhoto ? (
                        <video
                          ref={videoRef}
                          className="h-full w-full object-cover"
                          playsInline
                          muted
                          autoPlay
                        />
                      ) : capturedPhoto ? (
                        <Image src={capturedPhoto} alt="Captured selfie" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white/70">
                          <Camera className="h-10 w-10" />
                          <div className="space-y-1 text-center text-sm">
                            <p className="font-semibold text-white">Tap to open camera</p>
                            <p>Let's Slayy w/ Jorra</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="pointer-events-none absolute inset-[6%] rounded-full border border-white/15 ring-1 ring-white/15" />
                  </div>
                </div>
              </div>
            </div>

            {!capturedPhoto && !isCameraActive && (
              <p className="mt-3 text-center text-xs text-muted-foreground">Tap the lens to launch the camera.</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button
              onClick={() => {
                if (!isCameraActive) {
                  void startCamera()
                } else if (isCaptureReady) {
                  capturePhoto()
                }
              }}
              disabled={isCameraActive && !isCaptureReady}
              className="flex h-12 items-center gap-2 rounded-full bg-[#F13DD4] px-6 text-base font-semibold hover:bg-[#E034C8] disabled:cursor-not-allowed disabled:bg-[#F8B3EC] disabled:text-white/60"
            >
              <Camera className="h-5 w-5" />
              {actionButtonLabel}
            </Button>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[#F13DD4]/40 bg-white text-[#F13DD4] shadow-sm transition hover:border-[#F13DD4] hover:bg-[#FFF2FB]"
              >
                <UploadCloud className="h-5 w-5" />
                <span className="sr-only">Upload from device</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (capturedPhoto || isCameraActive) {
                    handleRetake()
                  } else {
                    void startCamera()
                  }
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50"
              >
                <RefreshCw className="h-5 w-5" />
                <span className="sr-only">Retake or reframe</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!capturedPhoto || isGenerating) return
                  void handleGenerate()
                }}
                disabled={!capturedPhoto || isGenerating}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition",
                  capturedPhoto && !isGenerating
                    ? "bg-[#F13DD4] text-white hover:bg-[#E034C8]"
                    : "cursor-not-allowed border border-neutral-200 bg-white text-muted-foreground",
                )}
              >
                <Check className="h-5 w-5" />
                <span className="sr-only">Approve and generate</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use the controls to open the camera, upload, retake, or approve your look.
            </p>
            {cameraError && (
              <p className="flex items-center gap-1 text-xs text-amber-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {cameraError}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-10">
          <div className="space-y-4">
            <div>
              <div className="flex gap-4">
                <h2 className="text-lg font-semibold text-[#1F1F1F] sm:text-xl">Featured Afro Hairstyles </h2>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-600 border border-pink-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  AI
                </span>
              </div>

              <p className="text-sm text-muted-foreground">Select a style to preview on your captured photo.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {loadingHairstyles && loadingNHB
                ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`hairstyle-skeleton-${index}`}
                    className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[#F13DD4]/20 p-4"
                  >
                    <div className="h-20 w-20 animate-pulse rounded-full bg-[#F9E6FF]" />
                    <div className="h-3 w-20 animate-pulse rounded-full bg-[#F9E6FF]" />
                  </div>
                ))
                : displayedHairstyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setSelectedHairstyleId(style.id)
                      setFormMessage(null)
                    }}
                    className={`flex flex-col items-center gap-3 rounded-3xl border p-4 transition ${selectedHairstyleId === style.id
                      ? "border-[#F13DD4] bg-[#FFF2FB] shadow-lg"
                      : "border-transparent bg-white/60 hover:border-[#F13DD4]/40"
                      }`}
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white shadow-inner">
                      <Image
                        src={resolveImageUrl(style.image_url)}
                        alt={style.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#2E2E2E] text-center">{style.name}</span>
                  </button>
                ))}
            </div>


          </div>

          <div className="space-y-4">
            <div>
              <div >
                <h2 className="text-lg font-semibold text-[#1F1F1F] sm:text-xl">Other Hairstyles </h2>

              </div>

              <p className="text-sm text-muted-foreground">Select a style to preview on your captured photo.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {loadingHairstyles && loadingNHB
                ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`hairstyle-skeleton-${index}`}
                    className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[#F13DD4]/20 p-4"
                  >
                    <div className="h-20 w-20 animate-pulse rounded-full bg-[#F9E6FF]" />
                    <div className="h-3 w-20 animate-pulse rounded-full bg-[#F9E6FF]" />
                  </div>
                ))
                : nhbHairStyles.map((style: any) => {
                  const imageSrc =
                    style.image_url ||
                    (style.thumbnail && (style.thumbnail.url || style.thumbnail.path)) ||
                    "/placeholder.svg"

                  return (
                    <button
                      key={(style.id)}
                      type="button"
                      onClick={() => {
                        setSelectedHairstyleId(style.id)
                        setFormMessage(null)
                      }}
                      className={`flex flex-col items-center gap-3 rounded-3xl border p-4 transition ${selectedHairstyleId === style.id
                        ? "border-[#F13DD4] bg-[#FFF2FB] shadow-lg scale-105"
                        : "border-transparent bg-white/60 hover:border-[#F13DD4]/40"
                        }`}
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white shadow-inner">
                        <Image
                          src={imageSrc}
                          alt={style.name || "hairstyle"}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#2E2E2E] text-center">
                        {style.name}
                      </span>
                      {style.category && (
                        <span className="text-[10px] text-muted-foreground">{style.category}</span>
                      )}
                    </button>
                  )
                })}
            </div>


          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1F1F1F] sm:text-xl">Featured Makeup Products</h2>
              <p className="text-sm text-muted-foreground">Complete the look with these expert picks.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {FEATURED_PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSelectedProductId(product.id)
                    setFormMessage(null)
                  }}
                  className={`flex flex-col items-center gap-3 rounded-3xl border p-4 text-center transition ${selectedProductId === product.id
                    ? "border-[#F13DD4] bg-[#FFF2FB] shadow-lg"
                    : "border-dashed border-[#F13DD4]/20 bg-white/60 hover:border-[#F13DD4]/40"
                    }`}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F9F5FF]">
                    <Image src={product.image} alt={product.name} width={48} height={48} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#1F1F1F]">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1F1F1F] sm:text-xl">Colours</h2>
              <p className="text-sm text-muted-foreground">Tap a swatch to preview a matching colour palette.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {HAIR_COLORS.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColorIndex(index)
                    setFormMessage(null)
                  }}
                  aria-label={`Select colour ${color}`}
                  className={`h-12 w-12 rounded-full border-2 transition ${selectedColorIndex === index ? "border-[#F13DD4] scale-110" : "border-transparent"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col items-center gap-3">
        {formMessage && (
          <div className="flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            {formMessage}
          </div>
        )}
        <Button
          size="lg"
          // disabled={isGenerateDisabled}
          onClick={isSelectedFromNHB ? handleBookOnly : handleGenerate}
          className="h-14 w-full max-w-xs rounded-full bg-[#F13DD4] text-base font-semibold shadow-[0_20px_40px_rgba(241,61,212,0.35)] hover:bg-[#E034C8] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          {isSelectedFromNHB ? (
            <>
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </>
          ) : isGenerating ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate &amp; Book
            </>
          )}
        </Button>
        {user && user.try_ons <= 0 && (
          <p className="text-xs text-muted-foreground">No try-ons remaining. Contact support to reset your count.</p>
        )}
        <p className="text-xs text-muted-foreground">Need adjustments? Retake your photo with the star icon.</p>
      </div>
    </div>
  )
}

function stopCamera(
  streamRef: MutableRefObject<MediaStream | null>,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  setIsCameraActive: (value: boolean) => void,
  setIsCaptureReady: (value: boolean) => void,
) {
  streamRef.current?.getTracks().forEach((track) => track.stop())
  streamRef.current = null
  setIsCameraActive(false)
  setIsCaptureReady(false)
  const video = videoRef.current
  if (video) {
    video.pause()
    video.srcObject = null
  }
}
