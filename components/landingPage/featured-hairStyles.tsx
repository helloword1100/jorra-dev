"use client"

import GlobalApi from "@/lib/globalApi"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function HairStyleSelector() {
    const [currentPage, setCurrentPage] = useState(0)
    const fallbackHairstyles = [
        { id: 0, name: "Textured Bob", image: "/hair-styles/empty.svg" },
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
    ] as any

    const [hairstyles, setHairstyles] = useState([])
    const [loading, setLoading] = useState(true)

    const getHairs = async () => {
        try {
            setLoading(true)
            const response = await GlobalApi.getHairStyles();

            if (response?.status === "success" && Array.isArray(response?.data)) {
                setHairstyles(response.data)
                console.log('hairstyles', response.data);
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

    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedHairstyle, setSelectedHairstyle] = useState(null)
    const [HairStyle, setHairStyle] = useState(null)
    const [color, setColor] = useState(null);

    const hairColors = ["#8B4513", "#D2691E", "#2F1B14", "#C0C0C0", "#DEB887", "#F4A460", "#CD853F", "#A0522D", "#800080"]

    const itemsPerPage = 8;
    const totalPages = Math.ceil(hairstyles.length / itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
    }

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    }

    // Calculate current hairstyles for pagination
    const startIndex = currentPage * itemsPerPage;
    const currentHairstyles = hairstyles.slice(startIndex, startIndex + itemsPerPage);

    return (
        <section className="min-h-screen relative overflow-hidden pt-12 2xl:px-0 xl:px-0 lg:px-12 md:px-12 max-sm:px-6 ">
            {/* Top-right gradient only */}
            <div className="absolute top-0 right-0 w-80 h-44 z-[-1] pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, #fef6ff, #fbdcff, #eed9ff)',
                    opacity: 0.9,
                    filter: 'blur(40px)'
                }}>
            </div>

            <div
                className="absolute top-0 right-0 w-1/3 h-1/3 opacity-60"
                style={{
                    background: "radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, transparent 70%)",
                }}
            ></div>

            <div className="max-w-7xl mx-auto  py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Side - Main Image */}
                    <div className="flex justify-center lg:justify-start">
                        <Image
                            src="/landing-page/girl.svg"
                            alt="Woman with braided hairstyle"
                            width={399}
                            height={200}
                            className=""
                        />
                    </div>

                    {/* Right Side - Selection Interface */}
                    <div className="space-y-6">
                        {/* Featured HairStyles */}
                        <div>
                            <div className="mb-8 ml-6">
                                <h2 className="text-2xl font-bold text-[#222222] mb-1">Featured HairStyles</h2>
                                <p className="text-[#535353] text-sm font-normal">Choose a hairstyle that suits you</p>
                            </div>

                            <div className="relative">
                                {/* Navigation Arrows */}
                                <button
                                    onClick={prevPage}
                                    disabled={loading || hairstyles.length === 0}
                                    className="absolute 2xl:-left-4 xl:-left-4 lg:-left-4 md:-left-4 max-sm:left-12 top-1/2 -translate-y-1/2 -translate-x-6 disabled:opacity-50"
                                >
                                    <Image src='/landing-page/left.svg' width={20} height={20} alt="left" className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={loading || hairstyles.length === 0}
                                    className="absolute 2xl:-right-4 xl:-right-4 lg:-right-4 md:-right-4 max-sm:right-12 top-1/2 -translate-y-1/2 translate-x-6 w-8 h-8 disabled:opacity-50"
                                >
                                    <Image src='/landing-page/right.svg' width={20} height={20} alt="right" className="w-8 h-8" />
                                </button>

                                {/* Hairstyle Grid */}
                                <div className="relative overflow-hidden">
                                    <div
                                        className="transition-all duration-500 ease-in-out transform"
                                        style={{
                                            transform: `translateX(-${currentPage * 100}%)`
                                        }}
                                    >
                                        <div className="flex">
                                            {Array.from({ length: totalPages || 1 }, (_, pageIndex) => {
                                                const pageStartIndex = pageIndex * itemsPerPage;
                                                const pageItems = hairstyles.slice(pageStartIndex, pageStartIndex + itemsPerPage);

                                                return (
                                                    <div key={pageIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full flex-shrink-0">
                                                        {loading ? (
                                                            [...Array(8).keys()].map((index) => (
                                                                <div key={index} className="animate-pulse flex flex-col items-center space-y-2">
                                                                    <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                                                                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            pageItems.map((style: any, index: any) => (
                                                                <button
                                                                    key={style.id || `${pageIndex}-${index}`}
                                                                    onClick={() => {
                                                                        setSelectedHairstyle(style.id)
                                                                        setHairStyle(style?.name)
                                                                    }}
                                                                    className={`group relative flex flex-col justify-center space-y-1 items-center rounded-lg 
                                                               transition-transform duration-300 ease-in-out hover:scale-90 `}
                                                                >
                                                                    <div className={`${selectedHairstyle === style.id ? "ring-2 ring-pink-500 rounded-full ring-offset-2" : "hover:scale-105"}`}>
                                                                        <div className="w-24 h-24 rounded-full overflow-hidden">
                                                                            <Image
                                                                                src={style.thumbnail?.url || style.image || "/placeholder.svg"}
                                                                                alt={style.name}
                                                                                width={96}
                                                                                height={96}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="">
                                                                        <p className="text-medium text-[#222222] font-normal text-center">{style.name}</p>
                                                                    </div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Colours Section */}
                        <div className="md:px-0 px-6">
                            <h2 className="text-2xl font-semibold text-[#222222] mb-2">Colours</h2>
                            <p className="text-[#535353] mb-2 font-normal">Choose a hair color that suits your face</p>

                            <div className="flex flex-wrap gap-3">
                                {hairColors?.map((color: any, index: any) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedColor(index)
                                            setColor(color)
                                        }}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === index
                                            ? "border-pink-500 ring-2 ring-pink-200"
                                            : "border-none"
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}