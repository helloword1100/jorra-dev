"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, Camera } from "lucide-react"
import Image from "next/image"
import { CameraCapture } from "./camera-capture"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  selectedImage?: File
  onRemoveImage?: () => void
  accept?: Record<string, string[]>
  maxSize?: number
  className?: string
  showCamera?: boolean
}

export function ImageUpload({
  onImageSelect,
  selectedImage,
  onRemoveImage,
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  showCamera = false,
}: ImageUploadProps) {
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
    accept,
    maxSize,
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
      <Card className={`relative overflow-hidden ${className}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image src={preview || "/placeholder.svg"} alt="Selected image" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                className="bg-destructive/80 hover:bg-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
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
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`
            aspect-square flex flex-col items-center justify-center p-8 cursor-pointer
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
              mx-auto w-12 h-12 rounded-full flex items-center justify-center
              ${isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
            `}
              >
                {isDragActive ? <Upload className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {isDragActive ? "Drop your image here" : "Upload an image"}
                </p>
                <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>

              {showCamera && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowCameraCapture(true)
                  }}
                  className="mt-3"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              )}
            </div>
          </div>

          {hasError && <div className="p-3 text-xs text-destructive bg-destructive/5 border-t">{errorMessage}</div>}
        </CardContent>
      </Card>
    </>
  )
}
