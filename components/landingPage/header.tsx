"use client"

import Image from "next/image"
import Link from "next/link"

export default function SuperHeader() {
    return (
        <header className="bg-white 
         pt-4 2xl:px-12 xl:px-12 lg:px-12 md:px-12 max-sm:px-6">
            <div className="container mx-auto ">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Image src={'/header/jora-black.svg'} width={100} height={100} alt='jora-ai-logo' />

                    {/* Shop Now Button */}
                    <div>
                        <Link href={'/auth'}>
                            <button className="bg-black underline hover:bg-gray-800 text-white px-6 py-2.5 rounded-sm transition-colors font-semibold text-sm hover:cursor-pointer">
                                Shop Now
                            </button></Link>
                    </div>
                </div>


            </div>
        </header>
    )
}
