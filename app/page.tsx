"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import SuperHeader from "@/components/landingPage/header"
import LandingPage from "@/components/landingPage/landing"
import Footer from "@/components/landingPage/footer"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#F13DD4]" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#F13DD4]" />
      </div>
    )
  }

  return (
    <>
      <SuperHeader />
      <LandingPage />
      <Footer />
    </>
  )
}
