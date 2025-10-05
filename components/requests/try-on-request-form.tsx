"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Send } from "lucide-react"
import { TryOnService } from "@/lib/api"
import { toast } from "sonner"

interface TryOnRequestFormProps {
  onRequestSubmitted?: () => void
}

export function TryOnRequestForm({ onRequestSubmitted }: TryOnRequestFormProps) {
  const [requestedAmount, setRequestedAmount] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount = Number.parseInt(requestedAmount)
    if (!amount || amount <= 0 || amount > 100) {
      toast.error("Please enter a valid amount between 1 and 100")
      return
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for your request")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await TryOnService.requestTryOnIncrease(amount, reason.trim())

      setSubmitted(true)
      toast.success(`Request submitted successfully! Request ID: ${result.request_id}`)

      // Reset form
      setRequestedAmount("")
      setReason("")

      onRequestSubmitted?.()
    } catch (error) {
      console.error("Request submission failed:", error)
      toast.error("Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Request Submitted!</h3>
              <p className="text-sm text-green-700 mt-1">
                Your try-on increase request has been submitted for admin review. You'll be notified once it's
                processed.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Submit Another Request
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          Request More Try-Ons
        </CardTitle>
        <CardDescription>
          Need more try-ons? Submit a request with your reason and our team will review it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Requested Amount</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max="100"
              placeholder="e.g., 50"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Maximum 100 try-ons per request</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Request</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you need additional try-ons..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Be specific about your use case (e.g., content creation, testing, special event)
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Request"}
            <Send className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
