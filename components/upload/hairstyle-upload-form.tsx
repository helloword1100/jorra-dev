"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "./image-upload"
import { HairstyleService } from "@/lib/api"
import { Loader2, Plus, X, ImageIcon, FileText, Tag } from "lucide-react"
import { useRouter } from "next/navigation"

const CATEGORIES = [
  "short",
  "medium",
  "long",
  "curly",
  "straight",
  "wavy",
  "braids",
  "updo",
  "bangs",
  "layers",
  "bob",
  "pixie",
  "vintage",
  "modern",
  "casual",
  "formal",
]

const SUGGESTED_TAGS = [
  "trendy",
  "classic",
  "edgy",
  "elegant",
  "fun",
  "professional",
  "romantic",
  "bold",
  "natural",
  "glamorous",
  "chic",
  "sporty",
  "bohemian",
  "minimalist",
  "dramatic",
  "youthful",
  "sophisticated",
]

export function HairstyleUploadForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags((prev) => [...prev, trimmedTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage || !formData.name || !formData.category) {
      setError("Please fill in all required fields and select an image")
      return
    }

    setLoading(true)
    setError("")

    try {
      await HairstyleService.addHairstyle({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags,
        image: selectedImage,
      })

      router.push("/gallery")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload hairstyle")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F13DD4]">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <Label className="text-base md:text-lg font-semibold text-foreground">Hairstyle Image *</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Upload a clear, high-quality image of the hairstyle
              </p>
            </div>
          </div>
          <ImageUpload
            onImageSelect={setSelectedImage}
            selectedImage={selectedImage || undefined}
            onRemoveImage={() => setSelectedImage(null)}
            showCamera={true}
          />
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F13DD4]">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Hairstyle Details</CardTitle>
                  <CardDescription>Provide information about this hairstyle</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Layered Bob with Bangs"
                  className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the hairstyle, styling tips, or who it suits best..."
                  rows={4}
                  className="border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tags</CardTitle>
                  <CardDescription>Add tags to help others discover this hairstyle</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Current Tags */}
              {tags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Selected Tags ({tags.length}/10)</Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Custom Tag */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Add Custom Tag</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a custom tag..."
                    className="h-10 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(newTag)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(newTag)}
                    disabled={!newTag.trim() || tags.length >= 10}
                    className="h-10 px-4 border-border/50 hover:bg-muted/50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Suggested Tags */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Suggested Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TAGS.filter((tag) => !tags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(tag)}
                        disabled={tags.length >= 10}
                        className="text-xs h-8 px-3 border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        {tag}
                      </Button>
                    ))}
                </div>
              </div>

              {tags.length >= 10 && (
                <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">Maximum 10 tags allowed</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="h-11 px-6 border-border/50 hover:bg-muted/50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Hairstyle"
          )}
        </Button>
      </div>
    </form>
  )
}
