"use client"

import { useEffect } from "react"

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return
    }

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch((error) => {
            console.log("[v0] Service Worker unregister failed:", error)
          })
        })
      })
      return
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[v0] Service Worker registered:", registration)
      })
      .catch((error) => {
        console.log("[v0] Service Worker registration failed:", error)
      })
  }, [])

  return null
}
