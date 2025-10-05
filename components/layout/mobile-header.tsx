"use client"

import Image from "next/image"

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-center border-b bg-background px-4 md:hidden">
      <div className="flex items-center ">
        <Image src="/header/logo-pink.svg" alt="Menu" width={84} height={40} className="
        md:h-12
        h-8 w-auto" />
        <Image src="/jorra-logo.png" alt="Jorra" width={80} height={32} className="md:h-12
        h-6 w-auto" />
      </div>
    </header>
  )
}
