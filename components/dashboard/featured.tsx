"use client"

import GlobalApi from "@/lib/globalApi"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"
type HairStyle = {
    id?: string | number
    name?: string
    image?: string
    thumbnail?: { url?: string }
}

export default function Featured() {
    const [currentPage, setCurrentPage] = useState(0)
    const fallbackHairstyles: HairStyle[] = [
        { id: 0, name: "Textured Bob", image: "/hair-styles/hair.png" },
        { id: 1, name: "Textured Bob", image: "/hair-styles/hair.png" },
        { id: 2, name: "Curtain Bangs", image: "/hair-styles/hair.png" },
        { id: 3, name: "Shag Cut", image: "/hair-styles/hair.png" },
        { id: 4, name: "Sleek Straight Hair", image: "/hair-styles/hair.png" },
        { id: 5, name: "Blunt Cut", image: "/hair-styles/hair.png" },
        { id: 6, name: "Soft Waves", image: "/hair-styles/hair.png" },
        { id: 7, name: "French Bob", image: "/hair-styles/hair.png" },
        { id: 8, name: "Pixie Cut", image: "/hair-styles/hair.png" },
        { id: 9, name: "Half-Up", image: "/hair-styles/hair.png" },
        { id: 10, name: "Half-Down ", image: "/hair-styles/hair.png" },
        { id: 11, name: "High Ponytail ", image: "/hair-styles/hair.png" },
    ]

    const [hairstyles, setHairstyles] = useState<HairStyle[]>([])
    const [loading, setLoading] = useState(true)

    const getHairs = async () => {
        try {
            setLoading(true)
            const response = await GlobalApi.getHairStyles();

            if (response?.status === "success" && Array.isArray(response?.data)) {
                setHairstyles(response.data)
            } else {
                setHairstyles(fallbackHairstyles)
            }
        } catch (error) {
            console.log('error getting hair styles', error);
            setHairstyles(fallbackHairstyles)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getHairs()
    }, [])

    const [selectedColor, setSelectedColor] = useState<number | null>(null)
    const [selectedHairstyle, setSelectedHairstyle] = useState<string | number | null>(null)
    const [HairStyleName, setHairStyleName] = useState<string | null>(null)
    const [color, setColor] = useState<string | null>(null)

    const hairColors = ["#8B4513", "#D2691E", "#2F1B14", "#C0C0C0", "#DEB887", "#F4A460", "#CD853F", "#A0522D", "#800080"]

    const itemsPerPage = 8
    const totalPages = Math.max(1, Math.ceil(hairstyles.length / itemsPerPage))

    const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages)
    const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)

    // Calculate current hairstyles for pagination
    const startIndex = currentPage * itemsPerPage
    const currentHairstyles = hairstyles.slice(startIndex, startIndex + itemsPerPage)

    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

    return (
        <section className="py-12">
            <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Left - Illustration */}
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="rounded-full w-44 h-44 md:w-56 md:h-56 overflow-hidden shadow-inner bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
                            <Image src="/landing-page/girl.svg" alt="Woman" width={220} height={220} className="object-cover" />
                        </div>
                    </div>

                    {/* Right - Controls */}
                    <div className="w-full md:w-2/3">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-semibold text-slate-900">Featured Hairstyles</h3>
                                <p className="text-sm text-slate-500">Browse and pick a look you love</p>
                            </div>
                            <div className="text-sm text-slate-500">Page {currentPage + 1} / {totalPages}</div>
                        </div>

                        {/* Hairstyles grid + navigation */}
                        <div className="relative">
                            <div className="overflow-hidden relative rounded-lg">
                                {/* Prev/Next buttons placed inside this overflow box so they don't overlap the next sections */}
                                <button
                                    aria-label="Previous page"
                                    onClick={prevPage}
                                    disabled={loading || hairstyles.length === 0}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow-sm hover:scale-105 disabled:opacity-50 z-10"
                                >
                                    <Image src="/landing-page/left.svg" width={18} height={18} alt="left" />
                                </button>
                                <button
                                    aria-label="Next page"
                                    onClick={nextPage}
                                    disabled={loading || hairstyles.length === 0}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow-sm hover:scale-105 disabled:opacity-50 z-10"
                                >
                                    <Image src="/landing-page/right.svg" width={18} height={18} alt="right" />
                                </button>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-400 p-3 bg-transparent">
                                    {loading ? (
                                        [...Array(itemsPerPage)].map((_, i) => (
                                            <div key={i} className="animate-pulse p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2">
                                                <div className="w-20 h-20 rounded-full bg-slate-200" />
                                                <div className="w-16 h-3 rounded bg-slate-200" />
                                            </div>
                                        ))
                                    ) : (
                                        currentHairstyles.map((style, idx) => (
                                            <button
                                                key={style.id ?? `${startIndex}-${idx}`}
                                                onClick={() => {
                                                    setSelectedHairstyle(style.id ?? `${startIndex}-${idx}`)
                                                    setHairStyleName(style.name ?? null)
                                                }}
                                                className={`p-3 rounded-xl flex flex-col items-center gap-2 text-center 
                                                    
                                                    focus:outline-none transition ${selectedHairstyle === style.id ? 'ring-2 ring-pink-400 bg-pink-50' : 'bg-white'}`}
                                            >
                                                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
                                                    <Image
                                                        src={style.thumbnail?.url || style.image || "/placeholder.svg"}
                                                        alt={style.name || 'hairstyle'}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="text-sm text-slate-800 truncate max-w-[96px]">{style.name}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Pagination dots */}
                            <div className="mt-4 flex items-center justify-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        aria-label={`Go to page ${i + 1}`}
                                        onClick={() => setCurrentPage(i)}
                                        className={`w-2 h-2 rounded-full ${i === currentPage ? 'bg-pink-500' : 'bg-slate-200 hover:bg-slate-300'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Featured Makeup Products (directly below hairstyles) */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Featured Makeup Products</h3>
                                    <p className="text-sm text-slate-500">Hand-picked products to complete your look</p>
                                </div>
                                <div className="text-sm text-slate-500">Trending</div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { id: 'p1', name: 'Matte Lipstick', price: '$19', imgs: ['/beach-waves-generation-result.jpg', '/beach-waves-hairstyle.jpg'] },
                                    { id: 'p2', name: 'Velvet Blush', price: '$24', imgs: ['/beach-waves-hairstyle.jpg', '/classic-bob-hairstyle.jpg'] },
                                    { id: 'p3', name: 'Liquid Liner', price: '$14', imgs: ['/classic-bob-hairstyle.jpg', '/long-layered-hairstyle.jpg'] },
                                    { id: 'p4', name: 'Glow Highlighter', price: '$22', imgs: ['/long-layered-hairstyle.jpg', '/hairstyle-generation-result.jpg'] },
                                ].map((p) => (
                                    <div
                                        key={p.id}
                                        className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-1 transition"
                                        onMouseEnter={() => setHoveredProduct(p.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                    >
                                        <div className="w-full h-24 rounded-md overflow-hidden mb-2 bg-slate-50 flex items-center justify-center">
                                            <Image
                                                src={(hoveredProduct === p.id && p.imgs[1]) ? p.imgs[1] : p.imgs[0]}
                                                alt={p.name}
                                                width={240}
                                                height={160}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-slate-800">{p.name}</div>
                                                <div className="text-xs text-slate-500">{p.price}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {p.imgs.map((_, i) => (
                                                    <span key={i} className={`w-2 h-2 rounded-full ${hoveredProduct === p.id && i === 1 ? 'bg-pink-500' : 'bg-slate-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Colours */}
                        <div className="mt-6">
                            <h4 className="text-base font-medium text-slate-900">Colours</h4>
                            <p className="text-sm text-slate-500">Choose a hair color</p>
                            <div className="mt-3 flex flex-wrap gap-3">
                                {hairColors.map((c, i) => (
                                    <button
                                        key={c + i}
                                        onClick={() => { setSelectedColor(i); setColor(c) }}
                                        aria-pressed={selectedColor === i}
                                        className={`w-10 h-10 rounded-full border-2 transition-shadow ${selectedColor === i ? 'ring-2 ring-pink-200 shadow-inner' : 'shadow-sm'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Generate Button centered at bottom */}
                        <div className="mt-6 flex justify-center">
                            <Link
                                href='/try-on'>
                                <Button


                                    // disabled={!selfieFile || !selectedHairstyle || generating || user.try_ons <= 0}
                                    size="lg"
                                    className="px-8"
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Generate My Look
                                </Button>
                            </Link>


                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-120%); }
                    100% { transform: translateX(120%); }
                }
            `}</style>
        </section>
    )
}