"use client"

import Image from "next/image"
import { useState } from "react"

export default function TestimonialsSection() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)

    const testimonials = [
        {
            id: 1,
            image: "/landing-page/test.svg",
            name: "Sarah Johnson",
            quote:
                "Using Jora made it so easy to try on the hairstyle that I wasn't sure about. I was able to see what the cut would look like on me before committing to it.",
            title: "JORA made it easier to try a new hairstyle",
        },
        {
            id: 2,
            image: "/landing-page/test.svg",
            name: "Maya Williams",
            quote:
                "The virtual try-on feature saved me from a potential hair disaster. I could experiment with different colors and styles before making my decision.",
            title: "JORA helped me find my perfect look",
        },
        {
            id: 3,
            image: "/landing-page/test.svg",
            name: "Zara Ahmed",
            quote:
                "I love how I can chat with Jora about hair care tips and get personalized recommendations. It's like having a hair expert in my pocket.",
            title: "JORA is my personal hair consultant",
        },
    ]

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const goToTestimonial = (index: any) => {
        setCurrentTestimonial(index)
    }

    return (
        <section className="bg-gray-50  px-8 relative overflow-hidden">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <p className="text[#2C2C2C] text-sm font-medium tracking-wider uppercase mb-6">TESTIMONIALS</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#2C2C2C] max-w-md leading-4 mx-auto ">
                        Get inside Scoop from our customers
                    </h2>
                </div>

                {/* Testimonial Carousel Container */}
                <div className="relative flex items-center justify-center">
                    {/* Left Navigation Button */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute 2xl:-left-28
                        xl:-left-28
                        lg:-left-10
                        md:-left-2
                        top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 "
                        aria-label="Previous testimonial"
                    >
                        <Image src='/landing-page/left.svg' width={20} height={20} alt="left" className="w-8 h-8" />
                    </button>

                    {/* Right Navigation Button */}
                    <button
                        onClick={nextTestimonial}
                        className="absolute 
                        2xl:-right-28
                        xl:-right-28
                        lg:-right-12
                        md:-right-2
                        
                        top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 "
                        aria-label="Next testimonial"
                    >
                        <Image src='/landing-page/right.svg' width={20} height={20} alt="left" className="w-8 h-8" />
                    </button>

                    {/* Testimonial Cards Container */}
                    <div className="w-full mb-4 max-w-4xl mx-auto overflow-hidden rounded-lg ">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={testimonial.id} className="w-full flex-shrink-0">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#2C2C2C] rounded-2xl overflow-hidden shadow-xl">
                                        {/* Left Side - Image */}
                                        <div className="relative aspect-square lg:aspect-auto">
                                            <Image
                                                src={testimonial.image || "/placeholder.svg"}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover  rounded-2xl"
                                            />
                                        </div>

                                        {/* Right Side - Content */}
                                        <div className="bg-[#2C2C2C] text-white p-8 lg:p-12 flex flex-col justify-center">
                                            <h3 className="text-lg lg:text-xl font-bold mb-2 leading-tight">
                                                <span className="italic font-medium">JORA</span> made it easier to try a new hairstyle
                                            </h3>
                                            <blockquote className="text-lg lg:text-lg leading-relaxed text-gray-200">
                                                "Using <span className="italic font-medium text-white">Jora</span>{" "}
                                                {testimonial.quote.replace("Using Jora ", "")}"
                                            </blockquote>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center space-x-3">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToTestimonial(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? "bg-[#2C2C2C] " : "bg-[#D9D9D9] hover:bg-gray-600"
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>


            </div>
        </section>
    )
}
