"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Sparkles } from "lucide-react"
import Image from "next/image"

const INSPIRATIONAL_QUOTES = [
  "Beauty begins the moment you decide to be yourself. - Coco Chanel",
  "The only true wisdom is in knowing you know nothing. - Socrates",
  "Style is a way to say who you are without having to speak. - Rachel Zoe",
  "Confidence is the best accessory you can wear.",
  "Your hair is your crown - wear it proudly.",
  "Change is the only constant in life. - Heraclitus",
  "Be yourself; everyone else is already taken. - Oscar Wilde",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Life is what happens to you while you're busy making other plans. - John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "In the middle of difficulty lies opportunity. - Albert Einstein",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
]

interface InspirationalProgressProps {
  isActive: boolean
  duration?: number
  onComplete?: () => void
}

export function InspirationalProgress({
  isActive,
  duration = 20000, // 20 seconds
  onComplete,
}: InspirationalProgressProps) {
  const [progress, setProgress] = useState(0)
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      setCurrentQuote(0)
      return
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration / 100)
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          onComplete?.()
          return 100
        }
        return newProgress
      })
    }, 100)

    // Change quote every 1 second
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(quoteInterval)
    }
  }, [isActive, duration, onComplete])

  if (!isActive) return null

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl border border-primary/10">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold text-foreground">Creating Your Perfect Look</h3>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>

        <div className="space-y-3">

          {/* Logo with circular progress overlay */}
          <div className="relative flex items-center justify-center animate-float">
            <div className="relative">
              {/* Circular progress ring */}
              <svg className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200/50"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  className="text-pink-500 transition-all duration-500 ease-out drop-shadow-sm"
                  strokeLinecap="round"
                />
                {/* Glowing effect */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  className="text-pink-300 transition-all duration-500 ease-out opacity-60"
                  strokeLinecap="round"
                />
              </svg>

              {/* Logo in center with floating animation */}
              <div className="flex items-center justify-center w-32 h-32 md:w-40 md:h-40 ">
                <Image
                  src="/header/logo-pink.svg"
                  alt="Menu"
                  width={120}
                  height={60}
                  className="md:h-36 h-12 w-auto drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes float {
              0%, 100% { 
                transform: translateY(0px) scale(1);
              }
              50% { 
                transform: translateY(-8px) scale(1.02);
              }
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
          `}</style>
          <p className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete •{" "}
            {Math.max(0, Math.round((duration - (progress * duration) / 100) / 1000))}s remaining
          </p>
        </div>
      </div>

      <div className="text-center min-h-[60px] flex items-center justify-center">
        <blockquote className="text-sm italic text-muted-foreground max-w-md leading-relaxed">
          "{INSPIRATIONAL_QUOTES[currentQuote]}"
        </blockquote>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <span>AI is working its magic</span>
      </div>
    </div>
  )
}
