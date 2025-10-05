"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, X, RotateCw, Check } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [error, setError] = useState<string>("")
  const [isReady, setIsReady] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      setError("")
      setIsReady(false)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true)
        }
      }
      streamRef.current = mediaStream
    } catch (err) {
      console.error("Camera access error:", err)
      setError("Unable to access camera. Please check permissions.")
    }
  }, [facingMode])

  useEffect(() => {
    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [startCamera])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const imageData = canvas.toDataURL("image/jpeg", 0.9)
    setCapturedImage(imageData)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const confirmPhoto = () => {
    if (!capturedImage) return

    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        })
        onCapture(file)
        stopCamera()
        onClose()
      })
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="relative aspect-[3/4] bg-black rounded-t-lg overflow-hidden">
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center text-destructive p-4 text-center">
                  <p>{error}</p>
                </div>
              ) : capturedImage ? (
                <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                  />
                  {!isReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white">Starting camera...</div>
                    </div>
                  )}
                </>
              )}

              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-center gap-4">
                  {!capturedImage ? (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={switchCamera}
                        className="h-12 w-12 rounded-full bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        <RotateCw className="h-5 w-5 text-white" />
                      </Button>

                      <Button
                        size="icon"
                        onClick={capturePhoto}
                        className="h-16 w-16 rounded-full bg-white hover:bg-white/90"
                        disabled={!isReady}
                      >
                        <Camera className="h-7 w-7 text-black" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleClose}
                        className="h-12 w-12 rounded-full bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        <X className="h-5 w-5 text-white" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={retakePhoto}
                        className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Retake
                      </Button>

                      <Button size="lg" onClick={confirmPhoto} className="bg-primary hover:bg-primary/90">
                        <Check className="h-5 w-5 mr-2" />
                        Use Photo
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
