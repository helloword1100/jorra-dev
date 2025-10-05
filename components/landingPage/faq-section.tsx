"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQSection() {
    const [openFAQ, setOpenFAQ] = useState(5) // Pre-open the 6th FAQ (index 5)

    const faqs = [
        {
            question: "How does the Hair try on feature work?",
            answer:
                "Our AI-powered hair try-on feature uses advanced computer vision technology to map your facial features and apply different hairstyles in real-time. Simply upload a photo or use your camera, and you can instantly see how various hairstyles look on you.",
        },
        {
            question: "Can I also try on different hairstyles?",
            answer:
                "Yes! You can try on a wide variety of hairstyles including braids, locs, wigs, weaves, silk presses, and many more. Our extensive library features styles specifically curated for textured hair.",
        },
        {
            question: "Will the hair try on work on my mobile device?",
            answer:
                "Our hair try-on feature is fully optimized for mobile devices. You can use it on your smartphone or tablet through your web browser for the best on-the-go experience.",
        },
        {
            question: "How accurate is the virtual hairstry on",
            answer:
                "Our virtual try-on technology provides highly accurate results by analyzing your face shape, skin tone, and hair texture. While results may vary slightly from real-life application, our AI provides a very realistic preview of how each style will look on you.",
        },
        {
            question: "How can I contact Niyo Hair & Beauty team?",
            answer:
                "You can reach our team through multiple channels: email us at hello@niyohair.com, call us at (555) 123-4567, or use the contact form on our website. We're here to help with any questions about our services.",
        },
        {
            question: "Where is the Hair saloon located ?",
            answer:
                "Lorem ipsum dolor sit amet consectetur. Nulla pharetra commodo vulputate vitae morbi at donec sagittis. Vel tristique malesuada ut tortor purus mauris accumsan.",
        },
        {
            question: "Do I need to pay to use the hair try on feature?",
            answer:
                "The basic hair try-on feature is completely free to use! You can try on multiple hairstyles and colors without any cost. Premium features and booking appointments may have associated fees.",
        },
    ]

    const toggleFAQ = (index: any) => {
        setOpenFAQ(openFAQ === index ? null : index)
    }

    return (
        <section className="bg-[#FFE9D0] mt-44 px-8 py-32">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4">
                    {/* Left Side - Header */}
                    <div className="lg:pr-8">
                        <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Your Questions, Answered
                        </h2>
                        <p className="text-[#333333] text-sm">You can't find what you're looking for?</p>
                        <button className="text-[#333333] font-medium underline hover:no-underline transition-all duration-200">
                            Contact us Now
                        </button>
                    </div>

                    {/* Right Side - FAQ Accordion */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-black">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full py-4 flex items-center justify-between text-left hover:text-gray-600 transition-colors duration-200"
                                >
                                    <span className="text-lg font-medium text-[#333333] pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${openFAQ === index ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? "max-h-96 pb-4" : "max-h-0"
                                        }`}
                                >
                                    <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
