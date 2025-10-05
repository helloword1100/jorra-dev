"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, User, Calendar, MessageSquare } from "lucide-react"
import { AdminService, type TryOnRequest } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

export function RequestManagement() {
  const [requests, setRequests] = useState<TryOnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    loadRequests()
  }, [activeTab])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const status = activeTab === "all" ? undefined : (activeTab as "pending" | "approved" | "denied")
      const response = await AdminService.getTryOnRequests({ status, limit: 50 })
      setRequests(response.requests)
    } catch (error) {
      console.error("Failed to load requests:", error)
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: number) => {
    setProcessingId(requestId)
    try {
      const result = await AdminService.approveTryOnRequest(requestId)
      toast.success(`Request approved! User now has ${result.new_try_ons} try-ons.`)
      loadRequests()
    } catch (error) {
      console.error("Failed to approve request:", error)
      toast.error("Failed to approve request")
    } finally {
      setProcessingId(null)
    }
  }

  const handleDeny = async (requestId: number) => {
    setProcessingId(requestId)
    try {
      await AdminService.denyTryOnRequest(requestId)
      toast.success("Request denied.")
      loadRequests()
    } catch (error) {
      console.error("Failed to deny request:", error)
      toast.error("Failed to deny request")
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "denied":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "denied":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length
  const deniedCount = requests.filter((r) => r.status === "denied").length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Try-On Request Management</CardTitle>
        <CardDescription>Review and manage user requests for additional try-ons</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
            <TabsTrigger value="denied">Denied ({deniedCount})</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {request.username || `User #${request.user_id}`}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-lg">Requesting {request.requested_amount} try-ons</p>
                          <p className="text-muted-foreground mt-1">{request.reason}</p>
                        </div>

                        {request.reviewed_at && (
                          <p className="text-xs text-muted-foreground">
                            Reviewed {formatDistanceToNow(new Date(request.reviewed_at), { addSuffix: true })}
                            {request.reviewed_by && ` by admin #${request.reviewed_by}`}
                          </p>
                        )}
                      </div>

                      {request.status === "pending" && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(request.id)}
                            disabled={processingId === request.id}
                            className="border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {processingId === request.id ? "Approving..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeny(request.id)}
                            disabled={processingId === request.id}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {processingId === request.id ? "Denying..." : "Deny"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
