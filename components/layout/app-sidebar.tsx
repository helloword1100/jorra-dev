"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Battery as Gallery, History, Upload, Settings, LogOut, Crown, Zap, CreditCard } from "lucide-react"
import Image from "next/image"

export function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  if (!user) return null

  const memberSince = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center ">
            <Image src="/header/logo-pink.svg" alt="Menu" width={40} height={40} className="
        md:h-5
        h-8 w-auto" />
            <Image src="/jorra-logo.png" alt="Jorra" width={40} height={32} className="md:h-4
        h-6 w-auto" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">by Docwyn AI x Niyo</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 shadow-sm">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarFallback className="
                bg-[#F13DD4] text-primary-foreground text-sm font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="font-medium">{user.try_ons} try-ons left</span>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-0 bg-border/50" />

        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/dashboard")}
                  className="h-10 px-3 rounded-lg hover:bg-sidebar-accent transition-colors duration-200"
                >
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/gallery")}
                  className="h-10 px-3 rounded-lg hover:bg-sidebar-accent transition-colors duration-200"
                >
                  <Gallery className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Style Gallery</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/history")}
                  className="h-10 px-3 rounded-lg hover:bg-sidebar-accent transition-colors duration-200"
                >
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">My History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/upload")}
                  className="h-10 px-3 rounded-lg hover:bg-sidebar-accent transition-colors duration-200"
                >
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Upload Style</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/pricing")}
                  className="h-10 px-3 rounded-lg hover:bg-sidebar-accent transition-colors duration-200"
                >
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Pricing</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-0 bg-border/50" />

        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Account Status
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 p-3 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Status</span>
                <div className="flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-primary" />
                  <span className="text-foreground font-semibold">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Member Since</span>
                <span className="text-foreground font-semibold">{memberSince}</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton className="h-10 px-3 rounded-lg hover:bg-sidebar-accent transition-colors duration-200">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-10 px-3 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
