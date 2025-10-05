'use client'
import React, { useState } from 'react';
// import SuperHeader from './SuperHeader';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Featured from './featured-hairStyles'
import TestimonialsSection from './testimonials';
import FAQSection from './faq-section';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';


const LandingPage = () => {

    const { user, login } = useAuth()
    const [loading, setLoading] = useState({
        guest: false,
        user: false
    })
    const features = [
        {
            bgColor: "#FFDBB0",
            title: "Try Before You Book 😊",
            description: "No more guessing. Instantly see how any style looks on you in just a tap.",
        },
        {
            bgColor: "#7943FF",
            title: "Your Personal Hair Bestie 💕",
            description: "Ask Jorra anything via voice; from product tips to protective style suggestions. She's always on.",
        },
        {
            bgColor: "#FFA848",
            title: "Book with Confidence ✨",
            description: "Found your perfect look? Book your appointment directly at Niyo Hair & Beauty, where innovation meets luxury service, tailored for textured hair.",
        },
        {
            bgColor: "#E099F7",
            title: "No More Hair Disasters 🚫",
            description: "Say goodbye to hairstyle mishaps and last-minute changes. Jorra helps you make confident choices that suit your vibe before you commit.",
        },
    ];

    const processSteps = [
        {
            step: 1,
            bgColor: "#F13DD4",
            textColor: "text-white",
            title: "Upload your photo or chat with your voice",
            description:
                "Take a photo of yourself or chat via voice to get all the help you need for your chosen hairstyle",
        },
        {
            step: 2,
            bgColor: "#FFD6F1",
            textColor: "text-black",
            title: "Select a Hairstyle",
            description:
                "Browse through a variety of our featured hairstyles and select the one that suits your face and look",
        },
        {
            step: 3,
            bgColor: "#FFD6F1", // Tailwind's pink-500
            textColor: "text-black",
            title: "Save & share the Hairstyle",
            description:
                "If you are happy with the hairstyle you can save it to share with your friends and family 😊",
        },
        {
            step: 4,
            bgColor: "#FFD6F1", // Tailwind's pink-500
            textColor: "text-black",
            title: "Book at Appointment at Niyo Hair Salon",
            description:
                "After you have decided you can book a hair session at the salon at a preferred time and date with the hairstyle saved",
        },
    ];

    const products = [
        {
            name: "Pre-stretched Hair",
            image: "/landing-page/st1.svg",
            alt: "Woman with blonde pre-stretched braids",
        },
        {
            name: "River Locs",
            image: "/landing-page/st2.svg",
            alt: "Woman with dark river locs hairstyle",
        },
        {
            name: "Twists Locs",
            image: "/landing-page/st3.svg",
            alt: "Woman with dark twisted locs hairstyle",
        },
        {
            name: "Nulocs",
            image: "/landing-page/st4.svg",
            alt: "Woman with shorter nulocs hairstyle",
        },
    ]

    const [error, setError] = useState("")

    const handleGuestLogin = async () => {

        setLoading({ ...loading, guest: true })
        setError("")

        try {
            await login('Guest', 'Guest123')
            localStorage.setItem('isGuest', 'true');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
        } finally {
            setLoading({ ...loading, guest: false })
        }

    }

    return (
        <>
            <section className="  " >
                <div className="container mx-auto  2xl:px-12 xl:px-12 lg:px-12 md:px-12 max-sm:px-6 py-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div className="space-y-8 lg:space-y-8">
                            <div className="space-y-2">
                                <h1 className="text-4xl  lg:text-4xl xl:text-6xl max-sm:text-3xl font-medium text-[#232323] leading-snug">
                                    Revamp your Look
                                    <br />
                                    in seconds with <span className="text-[#f5b4cc] italic">Jorra</span>
                                </h1>
                                <h2 className="text-4xl max-sm:text-3xl  lg:text-5xl xl:text-6xl font-bold leading-normal
 text-[#232323] ">
                                    Virtual <span className="bg-gradient-to-r from-[#FCA422] to-[#F13DD4] bg-clip-text text-transparent italic px-[7.5px] py-2 overflow-visible inline-block">
                                        Hair try-on tool
                                    </span>


                                </h2>
                            </div>

                            <p className="text-[#212429] text-sm leading-loose">
                                See every style on your textured hair in seconds from silk presses to braids to wigs. Powered by AI, Jorra
                                lets you try on your next look, ask expert hair questions with your voice, and book seamlessly at Niyo
                                Hair & Beauty our luxury tech-powered salon designed with you in mind.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-md font-normal rounded-sm"
                                    onClick={() => {
                                        handleGuestLogin()
                                    }}
                                    disabled={loading.guest}
                                >
                                    {loading.guest ?
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Try On a Hairstyle"}
                                </Button>
                                <Button asChild className="bg-[#F13DD4] hover:bg-[#F13DD4] text-white px-8 py-6 text-md font-normal rounded-sm">
                                    <Link href="/auth">Book Hair Appointment</Link>
                                </Button>
                            </div>

                            <div className="">
                                <p className="text-[#616161] text-sm font-normal tracking-wider uppercase">FEATURED IN</p>
                                <Image
                                    src="/landing-page/glam-logo.svg"
                                    alt="glam-logo"
                                    width={40}
                                    height={40}
                                    className="w-20 h-20"
                                />
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="relative">
                            {/* Main Image Container */}
                            <div className="relative">
                                {/* Gradient Border */}


                                <div className="relative w-full h-[600px] lg:h-[700px]">
                                    <Image
                                        src="/landing-page/hero-people.svg"
                                        alt="Beautiful woman with long black hair"
                                        fill
                                    />
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 2xl:left-[1090px] lg:left-[400px] xl:left-[620px] md:left-[680px]  transform -translate-x-1/ w-80 h-60 pointer-events-none z-[-1]"
                        style={{
                            background: 'conic-gradient(from 180deg, #F7CB84, #FFCAF1, #CF7FEE, #F7CB84)',
                            opacity: 0.6,
                            filter: 'blur(40px)'
                        }}>
                    </div>


                </div>
            </section>

            <Featured />

            <section className="bg-black text-white py-24 px-8 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-white text-sm mb-4">Benefits you will love</p>
                        <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#E099F7] to-[#FC9B34] bg-clip-text text-transparent">
                            At the Heart of <span className="text-pink-500">Jorra</span> is <span className="text-orange-400">You</span>
                        </h2>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {features.map((item, index) => (
                            <div key={index} className="bg-white text-black rounded-lg p-8">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div
                                            className="w-12 h-12 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: item.bgColor }}
                                        ></div>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                    </div>
                                    <div>
                                        <p className="text-[#333333] leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-24 left-1/4">
                        <Image src='/landing-page/star.svg' className="w-4 h-4" alt="star" width={20} height={20} />
                    </div>
                    <div className="absolute bottom-40 right-[90px]">
                        <Image src='/landing-page/star.svg' className="w-6 h-6" alt="star" width={20} height={20} />
                    </div>
                </div>
            </section>

            <section className="bg-[#fff] py-16 px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-gray-600 text-sm mb-4">Simple Approach</p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 max-w-4xl mx-auto">
                            How we give you the best hair & beauty experience
                        </h2>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Side - Image */}
                        <div className="order-2 lg:order-1">
                            <div className=" overflow-hidden">
                                <Image
                                    src="/landing-page/process.svg"
                                    alt="Two women in hair salon, one styling the other's hair"
                                    width={600}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Right Side - Process Steps */}
                        <div className="order-1 lg:order-2 space-y-7">
                            {processSteps.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${item.textColor}`}
                                        style={{ backgroundColor: item.bgColor }}
                                    >
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-normal text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-[#717171] text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}



                            {/* CTA Button */}
                            <div className="pt-6 px-12">
                                <Button className="bg-black hover:bg-black text-white px-8 py-6  text-sm font-medium rounded-sm">
                                    Book Hair Appointment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className=" py-16 px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#161616] mb-4">Shop Hair Products</h2>
                        <p className="text-[#333333] text-md max-w-2xl mx-auto font-medium">
                            Now that you have used <span className="italic font-bold">Jorra</span>, you can shop hair products and
                            extensions
                        </p>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="relative  overflow-hidden bg-gradient-to-b from-pink-200 to-pink-300 aspect-[4/5] hover:shadow-lg transition-shadow">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.alt}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-16 px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-[#434343] text-sm mb-4">Lastest Items</p>
                        <h2 className="text-3xl lg:text-4xl font-semibold text-[#161616]">Shop our Hair & Beauty Products</h2>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Left Column - Two stacked cards */}
                        <div className="space-y-6">
                            {/* Hair Products Card */}
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br  aspect-[4/3] group cursor-pointer">
                                <Image
                                    src="/landing-page/b1.svg"
                                    alt="Hair styling tools and products"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-6 left-4 text-white">
                                    <h3 className="text-xl font-bold mb-4">Hair Products</h3>
                                    <p className="text-sm opacity-90">Check out amazing new hair products</p>
                                </div>
                            </div>

                            {/* Woman with Curly Hair Card */}
                            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br  aspect-[4/3] group cursor-pointer">
                                <Image
                                    src="/landing-page/b2.svg"
                                    alt="Woman with beautiful curly natural hair"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        {/* Right Column - Large Gift Box Card */}
                        <div className="lg:col-span-2">
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br  aspect-[13/10] group cursor-pointer">
                                <Image
                                    src="/landing-page/b3.svg"
                                    alt="Gift box with hair and beauty products"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <TestimonialsSection />

            <FAQSection />
        </>
    );
}

export default LandingPage;
