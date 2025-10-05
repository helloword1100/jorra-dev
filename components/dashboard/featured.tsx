"use client"

import GlobalApi from "@/lib/globalApi"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { HairstyleService } from "@/lib/api"
type HairStyle = {
    id?: string | number
    name?: string
    image?: string
    thumbnail?: { url?: string }
    image_url?: { url?: string }
}

export default function Featured() {
    const [currentPage, setCurrentPage] = useState(0)



    const [hairstyles, setHairstyles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const getHairs = async () => {
        try {
            setLoading(true)
            const response = await HairstyleService.getHairstyles({
                search: "",
                limit: 20,
            })
            console.log('eekme', response);

            setHairstyles(response.hairstyles)

        } catch (error) {
            console.log('error getting hair styles', error);
            setHairstyles([])
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
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setUploadedPhoto(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRetakePhoto = () => {
        setUploadedPhoto(null)
    }

    return (
        <section className="py-12">
            <div className="max-w-12xl bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col md:flex-col gap-8 items-center">
                    {/* Photo Upload Area */}
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="relative">
                            <div className="rounded-full w-44 h-44 md:w-56 md:h-56 overflow-hidden shadow-inner bg-gradient-to-br from-pink-50 to-white flex items-center justify-center border-2 border-dashed border-pink-300 hover:border-pink-400 transition-colors">
                                {uploadedPhoto ? (
                                    <Image
                                        src={uploadedPhoto}
                                        alt="Uploaded photo"
                                        width={220}
                                        height={220}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Upload Your Photo</p>
                                            <p className="text-xs text-slate-500">Choose from library or camera</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upload/Retake Controls */}
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {!uploadedPhoto ? (
                                    <>
                                        {/* Library Upload */}
                                        <label className="bg-white border-2 border-pink-400 rounded-full p-2 shadow-lg hover:bg-pink-50 cursor-pointer transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                            />
                                            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </label>

                                        {/* Camera Capture */}
                                        {/* <label className="bg-white border-2 border-pink-400 rounded-full p-2 shadow-lg hover:bg-pink-50 cursor-pointer transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="user"
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                            />
                                            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </label> */}
                                    </>
                                ) : (
                                    <>
                                        {/* Retake Photo */}
                                        <button
                                            onClick={handleRetakePhoto}
                                            className="bg-white border-2 border-pink-400 rounded-full p-2 shadow-lg hover:bg-pink-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>

                                        {/* Upload New */}
                                        <label className="bg-white border-2 border-pink-400 rounded-full p-2 shadow-lg hover:bg-pink-50 cursor-pointer transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                            />
                                            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right - Controls */}
                    <div className="w-full ">
                        {/* Header */}
                        <div className="flex items-center md:justify-start justify-center mb-4">
                            <div>
                                <h3 className="md:text-2xl  text-lg font-semibold text-slate-900 text-center ">Featured Hairstyles</h3>
                                <p className="text-sm text-slate-500">Browse and pick a look you love</p>
                            </div>

                        </div>

                        {/* Hairstyles grid + navigation */}
                        <div className="relative">
                            <div className="overflow-hidden relative rounded-lg">
                                {/* Prev/Next buttons placed inside this overflow box so they don't overlap the next sections */}
                                {/* <button
                                    aria-label="Previous page"
                                    onClick={prevPage}
                                    disabled={loading || hairstyles.length === 0}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow-sm hover:scale-105 disabled:opacity-50 z-10 "
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
                                </button> */}

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-400 p-3 bg-transparent">
                                    {loading ? (
                                        [...Array(itemsPerPage)].map((_, i) => (
                                            <div key={i} className="animate-pulse p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-2">
                                                <div className="w-20 h-20 rounded-full bg-slate-200" />
                                                {/* <div className="w-16 h-3 rounded bg-slate-200" /> */}
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
                                                className="p-3 rounded-xl flex flex-col items-center gap-2 text-center bg-white focus:outline-none transition hover:bg-gray-50"
                                            >
                                                <div className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 ${selectedHairstyle === style.id ? 'ring-4 ring-pink-500 bg-pink-100 shadow-lg scale-105' : 'hover:ring-2 hover:ring-pink-200'}`}>
                                                    <Image
                                                        src={style?.image_url || style.image_url || "/placeholder.svg"}
                                                        alt={style.name || 'hairstyle'}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full rounded-full"
                                                    />
                                                </div>
                                                <div className="text-sm text-slate-800 truncate max-w-[96px]">{style.name}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Pagination dots */}
                            {
                                !loading && hairstyles.length > itemsPerPage && (
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
                                )
                            }
                        </div>

                        {/* Featured Makeup Products (directly below hairstyles) */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="md:text-lg text-md font-semibold text-slate-900">Featured Makeup Products</h3>
                                    <p className="text-sm text-slate-500">Hand-picked products to complete your look</p>
                                </div>
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
                                        onClick={() => setSelectedProduct(p.id === selectedProduct ? null : p.id)}
                                        className="p-3 bg-white rounded-xl transform hover:-translate-y-1 transition cursor-pointer"
                                        onMouseEnter={() => setHoveredProduct(p.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                    >
                                        <div className="w-full rounded-md mb-2 bg-slate-50 flex items-center justify-center">
                                            {/* Fixed height container for circular thumbnail with selection border */}
                                            <div className={`relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full transition-all duration-300 ${selectedProduct === p.id ? 'ring-4 ring-pink-500 bg-pink-100 shadow-lg scale-105' : 'hover:ring-2 hover:ring-pink-200'}`}>
                                                <Image
                                                    src={(hoveredProduct === p.id && p.imgs[1]) ? p.imgs[1] : p.imgs[0]}
                                                    alt={p.name}
                                                    fill
                                                    sizes="(max-width: 640px) 64px, (max-width: 1024px) 72px, 80px"
                                                    className="object-cover rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-4">
                                            <div>
                                                <div className="text-sm 
                                                
                                                font-medium text-slate-800">{p.name}</div>

                                            </div>
                                            {/* <div className="flex items-center gap-1">
                                                {p.imgs.map((_, i) => (
                                                    <span key={i} className={`w-2 h-2 rounded-full ${hoveredProduct === p.id && i === 1 ? 'bg-pink-500' : 'bg-slate-200'}`} />
                                                ))}
                                            </div> */}
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
                                        className={`w-10 h-10 rounded-full border-2 transition-shadow ${selectedColor === i ? 'ring-2 ring-pink-400 shadow-inner' : 'shadow-sm'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Generate Button centered at bottom */}
                        <div className="mt-6 flex flex-col items-center space-y-3">
                            {(!uploadedPhoto || !selectedHairstyle || !selectedProduct || selectedColor === null) && (
                                <div className="text-center">
                                    <p className="text-sm text-slate-600 font-medium">
                                        {!uploadedPhoto ? "📸 Upload a photo first" :
                                            !selectedHairstyle ? "💇‍♀️ Select a hairstyle" :
                                                !selectedProduct ? "💄 Choose a makeup product" :
                                                    "🎨 Pick a hair color"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Complete all steps to generate your look</p>
                                </div>
                            )}

                            <div className="flex justify-center">
                                {(!uploadedPhoto || !selectedHairstyle || !selectedProduct || selectedColor === null) ? (
                                    <Button
                                        disabled={true}
                                        size="lg"
                                        className="px-8 bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                                    >
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Generate My Look
                                    </Button>
                                ) : (
                                    <Link href={`/try-on?hairstyle=${selectedHairstyle}&photo=${encodeURIComponent(uploadedPhoto)}&product=${selectedProduct}&color=${selectedColor}`}>
                                        <Button
                                            size="lg"
                                            className="px-8 bg-[#F13DD4] hover:bg-[#F13DD4] hover:scale-105 transition-all duration-200 shadow-lg"
                                        >
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Generate My Look
                                        </Button>
                                    </Link>
                                )}
                            </div>
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