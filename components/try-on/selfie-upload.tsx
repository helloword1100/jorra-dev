"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, RotateCcw } from "lucide-react"
import Image from "next/image"
import { CameraCapture } from "@/components/upload/camera-capture"

interface SelfieUploadProps {
  onImageSelect: (file: File) => void
  selectedImage?: File
  onRemoveImage?: () => void
  className?: string
}

export function SelfieUpload({ onImageSelect, selectedImage, onRemoveImage, className = "" }: SelfieUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [showCameraCapture, setShowCameraCapture] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onImageSelect(file)

        // Create preview
        const reader = new FileReader()
        reader.onload = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageSelect],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  })

  const handleRemove = () => {
    setPreview(null)
    onRemoveImage?.()
  }

  const handleCameraCapture = (file: File) => {
    onImageSelect(file)
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const hasError = fileRejections.length > 0
  const errorMessage = fileRejections[0]?.errors[0]?.message

  if (selectedImage && preview) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Your Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image src={preview || "/placeholder.svg"} alt="Your selfie" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleRemove}
                className="bg-white/90 hover:bg-white text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Change
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Make sure your face is clearly visible and well-lit
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {showCameraCapture && (
        <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCameraCapture(false)} />
      )}

      <Card className={`${className} ${hasError ? "border-destructive" : ""}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Upload Your Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
            aspect-square flex flex-col items-center justify-center p-6 cursor-pointer
            transition-colors duration-200 border-2 border-dashed rounded-lg
            ${
              isDragActive
                ? "border-primary bg-primary/5"
                : hasError
                  ? "border-destructive bg-destructive/5"
                  : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
            }
          `}
          >
            <input {...getInputProps()} />

            <div className="text-center space-y-4">
              <div
                className={`
              mx-auto w-16 h-16 rounded-full flex items-center justify-center
              ${isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
            `}
              >
                {isDragActive ? <Upload className="h-8 w-8" /> : <Camera className="h-8 w-8" />}
              </div>

              <div>
                <p className="font-medium text-foreground mb-2">
                  {isDragActive ? "Drop your photo here" : "Take or upload a selfie"}
                </p>
                <p className="text-sm text-muted-foreground mb-1">Drag & drop or click to browse</p>
                <p className="text-xs text-muted-foreground">For best results, use a clear front-facing photo</p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCameraCapture(true)
                }}
                className="mt-2"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>

          {hasError && (
            <div className="mt-3 p-3 text-xs text-destructive bg-destructive/5 rounded-md">{errorMessage}</div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
