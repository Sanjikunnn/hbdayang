"use client"

import { useRef, useEffect, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
}

interface Firework {
  x: number
  y: number
  targetY: number
  particles: Particle[]
  color: string
  isExploded: boolean
}

export default function Fireworks({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const fireworksRef = useRef<Firework[]>([])
  const animationRef = useRef<number>(0)
  const lastLaunchRef = useRef<number>(0)

  // Colors for the fireworks - romantic theme
  const colors = [
    "#ff6b8e", // Pink
    "#ff4d79", // Darker pink
    "#ff1a5e", // Hot pink
    "#ffb3c6", // Light pink
    "#ff85a1", // Medium pink
    "#ff99ac", // Soft pink
    "#ffffff", // White
    "#ffd1dc", // Baby pink
  ]

  // Initialize canvas dimensions
  useEffect(() => {
    if (!canvasRef.current) return

    const updateDimensions = () => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      setDimensions({ width: rect.width, height: rect.height })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return

      // Clear canvas with a semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Launch new fireworks occasionally
      if (timestamp - lastLaunchRef.current > 800) {
        launchFirework()
        lastLaunchRef.current = timestamp
      }

      // Update and draw fireworks
      updateFireworks(ctx)

      animationRef.current = requestAnimationFrame(animate)
    }

    const launchFirework = () => {
      const x = Math.random() * canvas.width
      const targetY = Math.random() * (canvas.height * 0.5) + 50
      const color = colors[Math.floor(Math.random() * colors.length)]

      fireworksRef.current.push({
        x,
        y: canvas.height,
        targetY,
        particles: [],
        color,
        isExploded: false,
      })
    }

    const updateFireworks = (ctx: CanvasRenderingContext2D) => {
      fireworksRef.current = fireworksRef.current.filter((firework) => {
        // If not exploded yet, move the firework up
        if (!firework.isExploded) {
          firework.y -= 4

          // Draw the firework
          ctx.beginPath()
          ctx.arc(firework.x, firework.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = firework.color
          ctx.fill()

          // Check if reached target height
          if (firework.y <= firework.targetY) {
            explodeFirework(firework)
            firework.isExploded = true
          }

          return true
        } else {
          // Update particles
          firework.particles = firework.particles.filter((particle) => {
            // Apply gravity
            particle.vy += 0.05

            // Move particle
            particle.x += particle.vx
            particle.y += particle.vy

            // Fade out
            particle.alpha -= 0.01

            // Draw particle
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.alpha})`
            ctx.fill()

            return particle.alpha > 0
          })

          // Keep firework if it still has particles
          return firework.particles.length > 0
        }
      })
    }

    const explodeFirework = (firework: Firework) => {
      // Create explosion particles
      const particleCount = 80 + Math.floor(Math.random() * 40)

      for (let i = 0; i < particleCount; i++) {
        // Random angle and velocity
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 3 + 1

        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() < 0.3 ? "#ffffff" : firework.color, // Some white sparks
          size: Math.random() * 2 + 1,
        })
      }
    }

    // Helper to convert hex to rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
        : "255, 255, 255"
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Launch initial fireworks
    for (let i = 0; i < 3; i++) {
      setTimeout(() => launchFirework(), i * 300)
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [active, dimensions])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ background: "transparent" }}
    />
  )
}
