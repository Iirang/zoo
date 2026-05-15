"use client"
import { useEffect, useRef } from "react"

interface Props {
  trigger: number  // increments to re-fire effect
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  vRot: number
  life: number
  shape: "rect" | "circle"
}

const COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#CC5DE8", "#FF922B", "#20C997", "#F06595",
]

export default function Confetti({ trigger }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (trigger === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.scale(dpr, dpr)

    // Spawn particles from two side bursts and a top fall
    const w = window.innerWidth
    const h = window.innerHeight
    particlesRef.current = []

    // Left burst
    for (let i = 0; i < 80; i++) {
      const angle = (-Math.PI / 4) + (Math.random() - 0.5) * (Math.PI / 3)
      const speed = 12 + Math.random() * 10
      particlesRef.current.push({
        x: 0,
        y: h * 0.7,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3,
        life: 1.0,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })
    }

    // Right burst
    for (let i = 0; i < 80; i++) {
      const angle = (-3 * Math.PI / 4) + (Math.random() - 0.5) * (Math.PI / 3)
      const speed = 12 + Math.random() * 10
      particlesRef.current.push({
        x: w,
        y: h * 0.7,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3,
        life: 1.0,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })
    }

    // Center top fall
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        x: w * 0.3 + Math.random() * w * 0.4,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        size: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3,
        life: 1.0,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0 && p.y < h + 40)

      for (const p of particlesRef.current) {
        p.vy += 0.35  // gravity
        p.vx *= 0.99  // air drag
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.vRot
        p.life -= 0.005

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillStyle = p.color
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size * 2) / 3)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, w, h)
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  )
}
