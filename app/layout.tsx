import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { Suspense } from "react"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { RegisterServiceWorker } from "./register-sw"

export const metadata: Metadata = {
  title: "Jorra - AI Hairstyle Transfer",
  description: "Try on different hairstyles with AI-powered virtual styling by Docwyn AI x Niyo",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jorra",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <RegisterServiceWorker />
        <InstallPrompt />
        <Analytics />
      </body>
    </html>
  )
}
