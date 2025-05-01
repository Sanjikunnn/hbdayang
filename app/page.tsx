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
    <div className="w-full h-full flex items-center justify-center">
      <Heart className="w-12 h-12 text-rose-500 animate-pulse" fill="currentColor" />
      <span className="ml-2 text-rose-600">Loading bentar...</span>
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
      src: "/memories/IMG-20250501-WA0008.jpg",
      alt: "Our First Date",
      caption: "Di sinilah semua bermula — saat pertama kali kita saling menatap dan tahu bahwa ini bukan pertemuan biasa.",
    },
    {
      src: "/memories/IMG-20250501-WA0005.jpg",
      alt: "Summer Vacation",
      caption: "Musim panas tak akan pernah sama sejak kau hadir di sisiku.",
    },
    {
      src: "/memories/IMG-20250501-WA0006.jpg",
      alt: "Winter Together",
      caption: "Dalam dingin musim hujan, hangatnya cintamu jadi selimut terbaik.",
    },
    {
      src: "/memories/IMG-20250501-WA0007.jpg",
      alt: "Your Last Birthday",
      caption: "Hari ulang tahunmu jadi pengingat betapa bersyukurnya aku memiliki kamu di dunia ini.",
    },
    {
      src: "/memories/IMG-20250501-WA0009.jpg",
      alt: "Our Favorite Place",
      caption: "Bukan tentang tempatnya, tapi tentang siapa yang ada bersamaku di sana.",
    },
    {
      src: "/memories/IMG-20250501-WA0010.jpg",
      alt: "Morning Coffee",
      caption: "Secangkir kopi dan tatapan matamu — cukup untuk menghangatkan seluruh hariku.",
    },
    {
      src: "/memories/IMG-20250501-WA0011.jpg",
      alt: "Candlelight Dinner",
      caption: "Cahaya lilin tak pernah seindah saat memantul di matamu.",
    },
    {
      src: "/memories/IMG-20250501-WA0012.jpg",
      alt: "Rainy Day Together",
      caption: "Hujan tak lagi kelabu jika kita berteduh di pelukan satu sama lain.",
    },
    {
      src: "/memories/IMG-20250501-WA0013.jpg",
      alt: "Long Walks",
      caption: "Langkah demi langkah, aku ingin terus menyusuri hidup ini bersamamu.",
    },
    {
      src: "/memories/IMG-20250501-WA0014.jpg",
      alt: "Your Smile",
      caption: "Senyummu adalah alasan kenapa aku selalu ingin pulang.",
    },
    {
      src: "/memories/IMG-20250501-WA0015.jpg",
      alt: "Picnic Moment",
      caption: "Langit biru, angin sejuk, dan kamu — definisi bahagia yang sederhana.",
    },
    {
      src: "/memories/IMG-20250501-WA0016.jpg",
      alt: "Cooking Together",
      caption: "Masakan kita mungkin sederhana, tapi cinta di dalamnya selalu luar biasa.",
    },
    {
      src: "/memories/IMG-20250501-WA0017.jpg",
      alt: "Movie Night",
      caption: "Filmnya boleh apa aja, asalkan pelukannya tetap kamu.",
    },
    {
      src: "/memories/IMG-20250501-WA0018.jpg",
      alt: "Random Selfie",
      caption: "Dalam semua candaan dan wajah lucu itu, aku menemukan kenyamanan yang tak terganti.",
    },
    {
      src: "/memories/IMG-20250501-WA0019.jpg",
      alt: "Sunset View",
      caption: "Matahari tenggelam pun iri melihat betapa indahnya kamu saat tersenyum.",
    },
    {
      src: "/memories/IMG-20250501-WA0020.jpg",
      alt: "Surprise Gift",
      caption: "Bukan soal hadiahnya, tapi perhatianmu yang selalu hangatkan hati.",
    },
    {
      src: "/memories/IMG-20250501-WA0021.jpg",
      alt: "Late Night Talks",
      caption: "Obrolan larut malam kita adalah tempat di mana semua luka disembuhkan.",
    },
    {
      src: "/memories/IMG-20250501-WA0022.jpg",
      alt: "Holding Hands",
      caption: "Genggaman ini — aku tak pernah ingin melepaskannya.",
    },
    {
      src: "/memories/IMG-20250501-WA0023.jpg",
      alt: "Hiking Adventure",
      caption: "Mendaki bukit bersama, seperti menaklukkan rintangan hidup — selangkah demi selangkah, bersama.",
    },
    {
      src: "/memories/IMG-20250501-WA0024.jpg",
      alt: "Sleepy Face",
      caption: "Bahkan dalam lelahmu, aku melihat kedamaian yang selalu kurindukan.",
    },
    {
      src: "/memories/IMG-20250501-WA0025.jpg",
      alt: "Beach Day",
      caption: "Pasir di kaki kita, ombak di depan kita — dan kamu di sampingku.",
    },
    {
      src: "/memories/IMG-20250501-WA0026.jpg",
      alt: "Our Laugh",
      caption: "Tawa kita, musik paling indah dalam hidupku.",
    },
    {
      src: "/memories/IMG-20250501-WA0027.jpg",
      alt: "Hug Moment",
      caption: "Pelukanmu adalah rumah — tempat paling aman yang pernah kutemukan.",
    },
    {
      src: "/memories/IMG-20250501-WA0028.jpg",
      alt: "Just Us",
      caption: "Tak butuh apa-apa lagi kalau sudah ada 'kita'.",
    },
    {
      src: "/memories/IMG-20250501-WA0029.jpg",
      alt: "Look Into Eyes",
      caption: "Dalam matamu, aku melihat masa depan yang ingin kujaga selamanya.",
    },
    {
      src: "/memories/IMG-20250501-WA0030.jpg",
      alt: "Bicycle Ride",
      caption: "Bersepeda bersamamu, seperti perjalanan cinta kita — sederhana tapi penuh tawa.",
    },
    {
      src: "/memories/IMG-20250501-WA0031.jpg",
      alt: "First Trip",
      caption: "Perjalanan pertama kita, kenangan yang tak pernah pudar.",
    },
    {
      src: "/memories/IMG-20250501-WA0032.jpg",
      alt: "Matching Outfits",
      caption: "Kita mungkin dua orang berbeda, tapi hati kita selalu seirama.",
    },
    {
      src: "/memories/IMG-20250501-WA0005.jpg",
      alt: "One More Kiss",
      caption: "Satu ciuman lagi, dan aku jatuh cinta untuk kesekian kalinya padamu.",
    },
  ];
  
  const memoryPhotos = [
    {
      title: "Our first date",
      image: "/memories/IMG-20250501-WA0008.jpg",
    },
    {
      title: "Summer vacation",
      image: "/memories/IMG-20250501-WA0016.jpg",
    },
    {
      title: "Your birthday last year",
      image: "/memories/IMG-20250501-WA0015.jpg",
    },
    {
      title: "That perfect sunset",
      image: "/memories/IMG-20250501-WA0005.jpg",
    },
    {
      title: "When we laughed for hours",
      image: "/memories/IMG-20250501-WA0022.jpg",
    },
    {
      title: "The day I knew",
      image: "/memories/IMG-20250501-WA0026.jpg",
    },
  ];
  
  const sections = [
    {
      id: "greeting",
      title: "Halooo, Riska Anggraini 💗",
      content:
        "Waktu berjalan begitu cepat, tapi rasa sayang ini tak pernah terburu-buru. Hari ini kamu bertambah usia, dan aku bersyukur bisa menyaksikannya, lagi dan lagi hingga seterusnya.",
    },
    {
      id: "memories",
      title: "Jejak Cerita Kita",
      content:
        "Bukan tentang seberapa sering kita bersama, tapi tentang seberapa dalam setiap pertemuan itu tinggal dalam ingatan.",
    },
    {
      id: "photo-gallery",
      title: "Foto, Tapi Penuh Rasa",
      content:
        "Foto mungkin diam, tapi perasaan yang tertangkap di dalamnya tetap hidup. Terima kasih sudah jadi bagian dari semua itu.",
    },
    {
      id: "digital-card",
      title: "Sebuah Surat, Banyak Makna",
      content:
        "Sering kali, hal yang sederhana justru menyimpan ketulusan yang paling dalam. Bukalah kartu ini, karena ada sesuatu yang ingin kusampaikan—tulus, jujur, dan berasal dari hati",
    },
    {
      id: "slideshow",
      title: "Cerita Lewat Gambar",
      content:
        "Setiap potret punya cara sendiri untuk bercerita. Tapi semuanya mengarah ke satu hal: betapa berartinya kamu untukku.",
    },
    {
      id: "3d-gift-box",
      title: "Kejutan Dari Hati",
      content:
        "Cinta itu seperti hadiah yang tak selalu tampak sempurna, tapi selalu penuh makna. Seperti kotak kado ini, yang meski sederhana, menyimpan segala harapan dan kebahagiaan. Selamat ulang tahun, semoga tahun ini membawa lebih banyak kebahagiaan dan cinta di setiap langkah kita.",
    },    
    {
      id: "message",
      title: "Sepatah Kata Dari Aku",
      content:
        "Kamu tidak sempurna, aku juga. Tapi aku percaya, kita bisa saling belajar dan tumbuh bareng. Terima kasih sudah bersama sejauh ini.",
    },
    {
      id: "wishes",
      title: "Harapan Yang Tulus",
      content:
        "Semoga langkahmu selalu ringan, hatimu selalu lapang, dan apa pun yang kamu impikan bisa satu per satu jadi nyata. Aku di sini, mendukung tanpa banyak suara.",
    },
    {
      id: "celebration",
      title: "Bukan Tentang Pestanya",
      content:
        "Hari ini bukan soal perayaan besar, tapi soal rasa yang besar. Semoga hari-hari kamu riang, dan senyum mu tak cepat hilang.",
    },
  ];
  
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
  
    // Reset card state only if not in card section
    if (currentSection !== 3) {
      setIsCardOpen(false)
    }
  
    // Reset slideshow to first image when navigating to slideshow section
    if (currentSection === 4) {
      setCurrentSlide(0)
      setSlideshowPlaying(true)
    }
  }, [currentSection, sections.length])
  
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
  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

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
      <div className="w-full max-w-6xl min-h-screen flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 border border-pink-200 w-full max-w-2xl"
          >
            {currentSection === 0 && (
              <div className="flex flex-col items-center gap-4 mb-2 ">
                <Image
                  src="/memories/home.jpg"
                  width={350}
                  height={300}
                  alt="Foto Keren gw"
                  className="rounded-xl object-cover border-4 border-pink-200 shadow-lg"
                />
              </div>
            )}

            {currentSection === 1 && (
              <div className="grid grid-cols-2 gap-4 mb-8 text-justify">
                <Image
                  src="/memories/IMG-20250501-WA0009.jpg?height=200&width=200"
                  width={200}
                  height={200}
                  alt="Our memory"
                  className="rounded-lg object-cover border-2 border-pink-200 shadow-md transform rotate-[-3deg]"
                />
                <Image
                  src="/memories/IMG-20250501-WA0010.jpg?height=200&width=200"
                  width={200}
                  height={200}
                  alt="Our memory"
                  className="rounded-lg object-cover md:ml-10 border-2 border-pink-200 shadow-md transform rotate-[3deg]"
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
                {memoryPhotos.map((memory, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 z-10">
                      <p className="text-white text-sm font-medium text-center">
                        {memory.title}
                      </p>
                    </div>
                    <Image
                      src={memory.image}
                      width={200}
                      height={200}
                      alt={memory.title}
                      className="w-full h-32 md:h-40 object-cover rounded-lg border-2 border-pink-200 shadow-md transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}


{currentSection === 3 && (
  <div className="flex justify-center items-center mb-8">
    <div className="relative w-full cursor-pointer" onClick={toggleCard}>
      <motion.div
        key={isCardOpen ? "inside" : "front"} // penting biar motion animate dijalankan tiap ganti
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6 }}
        className="relative w-full rounded-xl overflow-hidden border-4 border-pink-300 shadow-xl"
      >
        {!isCardOpen ? (
          // Tampilan depan kartu
          <div className="bg-gradient-to-br from-rose-300 to-pink-500 h-full w-full p-6 flex flex-col items-center justify-center relative">
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
        ) : (
          // Tampilan dalam kartu
          <div className="bg-white h-full w-full p-6 flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-12 bg-pink-100">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-300 via-pink-200 to-pink-100" />
            </div>

            <div className="z-10 text-center px-4 py-8">
              <h3 className="text-xl font-bold text-rose-600 mb-1">Untukmu yang Teristimewa</h3>
              <h4 className="text-2xl font-bold text-rose-600 mb-4">Riska Anggraini</h4>
              <p className="text-rose-800 mb-6 leading-relaxed">
                Setiap detik yang kita lewati bersama adalah anugerah terindah. Cintamu, perhatianmu, dan cara kau membuat setiap hari menjadi lebih berarti, semuanya adalah keajaiban yang aku syukuri setiap saat. Aku tak pernah merasa seutuhnya hidup hingga aku memilikimu di sisi.
              </p>
              <p className="text-rose-800 mb-6 leading-relaxed">
                Di hari ulang tahunmu ini, izinkan aku mengucapkan betapa besar rasa terima kasihku atas segala yang telah kau beri. Semoga kebahagiaanmu selalu mekar seperti bunga yang tak pernah layu, dan cinta kita semakin kokoh, tak tergoyahkan oleh waktu.
              </p>
              <p className="text-rose-600 font-bold">Pria dengan penuh cinta,</p>
              <p className="italic text-rose-500">Faizal Muhamad Iqbal</p>
            </div>


            <div className="absolute bottom-0 left-0 w-full h-12 bg-pink-100">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-pink-300 via-pink-200 to-pink-100" />
            </div>

            {/* Decorative hearts */}
            <div className="absolute top-3 right-3">
              <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
            </div>
            <div className="absolute bottom-3 left-3">
              <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
            </div>
          </div>
        )}
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
