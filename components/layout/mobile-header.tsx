"use client"

import Image from "next/image"

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-center border-b bg-background px-4 md:hidden">
      <div className="flex items-center gap-2">
        <Image src="/jorra-logo.png" alt="Jorra" width={80} height={32} className="h-8 w-auto" />
      </div>
    </header>
  )
}
