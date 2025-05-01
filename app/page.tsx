"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Music,
  Volume2,
  VolumeX,
  Gift,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react"
import confetti from "canvas-confetti"
import Image from "next/image"
import dynamic from "next/dynamic"
import Fireworks from "@/components/fireworks"

// Dynamically import the 3D heart component to avoid SSR issues
const HeartBeat3D = dynamic(() => import("@/components/heart-beat-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 flex items-center justify-center">
      <Heart className="w-12 h-12 text-rose-500 animate-pulse" fill="currentColor" />
      <span className="ml-2 text-rose-600">Loading heart...</span>
    </div>
  ),
})

export default function BirthdayPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideshowPlaying, setSlideshowPlaying] = useState(true)
  const [showFireworks, setShowFireworks] = useState(false)

  const slideshowImages = [
    {
      src: "/placeholder.svg?height=400&width=600&text=Our+First+Date",
      alt: "Our First Date",
      caption: "Where it all began - our first date at that cute café",
    },
    {
      src: "/placeholder.svg?height=400&width=600&text=Summer+Vacation",
      alt: "Summer Vacation",
      caption: "That amazing summer trip where we watched the sunset every evening",
    },
    {
      src: "/placeholder.svg?height=400&width=600&text=Winter+Together",
      alt: "Winter Together",
      caption: "Keeping each other warm during our winter adventure",
    },
    {
      src: "/placeholder.svg?height=400&width=600&text=Birthday+Last+Year",
      alt: "Birthday Last Year",
      caption: "Celebrating your special day last year - look how far we've come!",
    },
    {
      src: "/placeholder.svg?height=400&width=600&text=Our+Favorite+Place",
      alt: "Our Favorite Place",
      caption: "The spot where we always feel at home together",
    },
  ]

  const sections = [
    {
      id: "greeting",
      title: "Happy Birthday, My Love",
      content: "On this special day, I want to celebrate the most amazing person in my life.",
    },
    {
      id: "memories",
      title: "Our Beautiful Memories",
      content: "Each moment with you becomes a treasured memory I keep close to my heart.",
    },
    {
      id: "photo-gallery",
      title: "Our Journey Together",
      content: "Every photo tells a story of our love. Here are some of my favorite moments with you.",
    },
    {
      id: "digital-card",
      title: "A Special Card For You",
      content: "Click the card to open it and reveal a special message inside.",
    },
    {
      id: "slideshow",
      title: "Our Story in Pictures",
      content: "A journey through our most precious moments together.",
    },
    {
      id: "3d-heart",
      title: "My Heart Beats For You",
      content: "Every beat of my heart belongs to you. Interact with the heart to see how you make it race.",
    },
    {
      id: "message",
      title: "A Letter From My Heart",
      content:
        "Words cannot express how much you mean to me. You've brought so much joy, laughter, and love into my life. Your smile brightens my darkest days, and your love gives me strength I never knew I had.",
    },
    {
      id: "wishes",
      title: "My Wishes For You",
      content:
        "I wish you endless happiness, health, success, and all the wonderful things you deserve in life. May all your dreams come true, and may we create countless more beautiful memories together.",
    },
    {
      id: "celebration",
      title: "Let's Celebrate!",
      content:
        "Today is all about you. I hope this little surprise brings a smile to your face. I love you more than words can say.",
    },
  ]

  // Slideshow auto-advance
  useEffect(() => {
    let slideshowTimer: NodeJS.Timeout | null = null

    if (slideshowPlaying && currentSection === 4) {
      slideshowTimer = setTimeout(() => {
        setCurrentSlide((prev) => (prev === slideshowImages.length - 1 ? 0 : prev + 1))
      }, 4000) // Change slide every 4 seconds
    }

    return () => {
      if (slideshowTimer) clearTimeout(slideshowTimer)
    }
  }, [currentSlide, slideshowPlaying, currentSection, slideshowImages.length])

  useEffect(() => {
    const newAudio = new Audio("/ANDMESH-ANUGERAH-TERINDAH.mp3")
    newAudio.loop = true
    setAudio(newAudio)

    return () => {
      newAudio.pause()
      newAudio.src = ""
    }
  }, [])

  useEffect(() => {
    // Show fireworks when on the celebration section
    setShowFireworks(currentSection === sections.length - 1)

    if (currentSection === sections.length - 1) {
      triggerConfetti()
    }

    // Reset card state when changing sections
    setIsCardOpen(false)

    // Reset slideshow to first image when navigating to slideshow section
    if (currentSection === 4) {
      setCurrentSlide(0)
      setSlideshowPlaying(true)
    }
  }, [currentSection, sections.length])

  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const toggleAudio = () => {
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }

    setIsPlaying(!isPlaying)
  }

  const toggleCard = () => {
    setIsCardOpen(!isCardOpen)
    if (!isCardOpen) {
      // Trigger mini confetti when card opens
      const defaults = { startVelocity: 15, spread: 360, ticks: 50, zIndex: 0 }
      confetti({
        ...defaults,
        particleCount: 30,
        origin: { x: 0.5, y: 0.6 },
      })
    }
  }

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slideshowImages.length - 1 ? 0 : prev + 1))
  }, [slideshowImages.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slideshowImages.length - 1 : prev - 1))
  }, [slideshowImages.length])

  const toggleSlideshow = useCallback(() => {
    setSlideshowPlaying((prev) => !prev)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex flex-col items-center justify-center overflow-hidden text-rose-900 relative">
      {/* Background floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-200"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 2 + 1}rem`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          >
            <Heart fill="currentColor" />
          </div>
        ))}
      </div>

      {/* Fireworks animation */}
      {showFireworks && <Fireworks active={showFireworks} />}

      {/* Audio control */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-10 p-2 rounded-full bg-white/30 backdrop-blur-sm border border-pink-200 text-rose-600 hover:bg-white/50 transition-all"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Music note icon when playing */}
      {isPlaying && (
        <div className="fixed top-4 left-4 z-10 text-rose-600 animate-bounce">
          <Music size={20} />
        </div>
      )}

      {/* Navigation indicator */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSection === index ? "bg-rose-500 scale-125" : "bg-rose-200 hover:bg-rose-300"
            }`}
            onClick={() => setCurrentSection(index)}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="w-full max-w-4xl min-h-screen flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 border border-pink-200 w-full max-w-2xl"
          >
            {currentSection === 1 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  width={200}
                  height={200}
                  alt="Our memory"
                  className="rounded-lg object-cover border-2 border-pink-200 shadow-md transform rotate-[-3deg]"
                />
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  width={200}
                  height={200}
                  alt="Our memory"
                  className="rounded-lg object-cover border-2 border-pink-200 shadow-md transform rotate-[3deg]"
                />
              </div>
            )}

            {currentSection === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 z-10">
                      <p className="text-white text-sm font-medium text-center">
                        {
                          [
                            "Our first date",
                            "Summer vacation",
                            "Your birthday last year",
                            "That perfect sunset",
                            "When we laughed for hours",
                            "The day I knew",
                          ][i]
                        }
                      </p>
                    </div>
                    <Image
                      src={`/placeholder.svg?height=200&width=200&text=Memory+${i + 1}`}
                      width={200}
                      height={200}
                      alt={`Memory ${i + 1}`}
                      className="w-full h-32 md:h-40 object-cover rounded-lg border-2 border-pink-200 shadow-md transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {currentSection === 3 && (
              <div className="flex justify-center items-center mb-8">
                <div className="perspective-1000 w-full max-w-md">
                  <motion.div
                    className="relative w-full cursor-pointer"
                    animate={{ rotateY: isCardOpen ? 180 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onClick={toggleCard}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Card Front */}
                    <motion.div
                      className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden border-4 border-pink-300 shadow-xl ${isCardOpen ? "pointer-events-none" : ""}`}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="bg-gradient-to-br from-rose-300 to-pink-500 h-full w-full p-6 flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                          {[...Array(15)].map((_, i) => (
                            <Heart
                              key={i}
                              className="absolute text-white"
                              style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                fontSize: `${Math.random() * 2 + 1}rem`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                              }}
                              size={Math.random() * 20 + 10}
                            />
                          ))}
                        </div>
                        <Gift className="w-16 h-16 text-white mb-4" />
                        <h3 className="text-2xl font-bold text-white text-center mb-2">Happy Birthday!</h3>
                        <p className="text-white text-center">Click to open your special card</p>
                        <div className="absolute bottom-4 right-4">
                          <Heart className="w-6 h-6 text-white animate-pulse" fill="white" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Card Inside */}
                    <motion.div
                      className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-4 border-pink-300 shadow-xl bg-white"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="h-full w-full p-6 flex flex-col items-center justify-center relative">
                        <div className="absolute top-0 left-0 w-full h-12 bg-pink-100 flex items-center justify-center">
                          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-300 via-pink-200 to-pink-100"></div>
                        </div>

                        <div className="z-10 text-center px-4 py-8">
                          <h3 className="text-2xl font-bold text-rose-600 mb-4">To My Sweetheart</h3>
                          <p className="text-rose-800 mb-6 leading-relaxed">
                            Another year of loving you has been the greatest gift. Your smile, your laugh, your heart -
                            everything about you makes my life complete.
                          </p>
                          <p className="text-rose-800 mb-6 leading-relaxed">
                            May this birthday bring you as much joy as you bring to me every single day.
                          </p>
                          <p className="text-rose-600 font-bold">Forever Yours,</p>
                          <p className="italic text-rose-500">With all my love</p>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-12 bg-pink-100">
                          <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-pink-300 via-pink-200 to-pink-100"></div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-3 right-3">
                          <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            )}

            {currentSection === 4 && (
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-xl border-2 border-pink-200 shadow-lg aspect-video">
                  {/* Slideshow */}
                  <div className="relative w-full h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={slideshowImages[currentSlide].src || "/placeholder.svg"}
                          alt={slideshowImages[currentSlide].alt}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                          <p className="text-center font-medium">{slideshowImages[currentSlide].caption}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation arrows */}
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-all"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-all"
                      aria-label="Next slide"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Play/Pause button */}
                    <button
                      onClick={toggleSlideshow}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-all"
                      aria-label={slideshowPlaying ? "Pause slideshow" : "Play slideshow"}
                    >
                      {slideshowPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>

                    {/* Progress indicators */}
                    <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
                      {slideshowImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentSlide === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 5 && (
              <div className="mb-8 w-full">
                <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border-2 border-pink-200 shadow-lg">
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading...</div>}>
                    <HeartBeat3D />
                  </Suspense>
                </div>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-rose-600 relative">
              <span className="relative z-10">{sections[currentSection].title}</span>
              <span className="block h-3 bg-pink-200/50 absolute bottom-1 left-0 right-0 z-0 transform -rotate-1"></span>
            </h2>

            <div className="mt-8 text-lg text-center leading-relaxed">{sections[currentSection].content}</div>

            {currentSection === sections.length - 1 && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <button
                  onClick={triggerConfetti}
                  className="px-6 py-3 bg-rose-500 text-white rounded-full font-bold shadow-lg hover:bg-rose-600 transition-all transform hover:scale-105"
                >
                  Celebrate Again! 🎉
                </button>
                <p className="text-rose-500 text-sm">Watch the fireworks light up the sky for your special day!</p>
              </div>
            )}

            <div className="flex justify-between mt-10">
              <button
                onClick={prevSection}
                className={`p-3 rounded-full ${
                  currentSection === 0 ? "text-rose-300 cursor-not-allowed" : "text-rose-600 hover:bg-pink-100"
                }`}
                disabled={currentSection === 0}
                aria-label="Previous section"
              >
                <ChevronUp size={24} />
              </button>

              <div className="text-rose-400 font-medium">
                {currentSection + 1} / {sections.length}
              </div>

              <button
                onClick={nextSection}
                className={`p-3 rounded-full ${
                  currentSection === sections.length - 1
                    ? "text-rose-300 cursor-not-allowed"
                    : "text-rose-600 hover:bg-pink-100"
                }`}
                disabled={currentSection === sections.length - 1}
                aria-label="Next section"
              >
                <ChevronDown size={24} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
