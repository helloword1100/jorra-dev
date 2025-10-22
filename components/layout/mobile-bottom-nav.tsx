"use client"

import { useRouter, usePathname } from "next/navigation"
import { Battery as Gallery, History, Upload, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Gallery",
    icon: Gallery,
    href: "/gallery",
  },
  {
    label: "History",
    icon: History,
    href: "/history",
  },
  {
    label: "Upload",
    icon: Upload,
    href: "/upload",
  },
]

export function MobileBottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const isGuestUser = user?.username?.trim().toLowerCase() === "guest"

  const visibleNavItems = isGuestUser ? navItems.filter((item) => item.href !== "/history") : navItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
