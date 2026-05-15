"use client"
import { useRef, useEffect, useCallback } from "react"
import { Section } from "@/types"
import { computeSegments } from "@/lib/wheelMath"

interface Props {
  sections: Section[]
  currentAngle: number
  size?: number
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function darken(hex: string, amount = 40): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`
}

export default function RouletteWheel({ sections, currentAngle, size = 480 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cx = size / 2
    const cy = size / 2
    const radius = size / 2 - 8
    const innerRadius = 28

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const segments = computeSegments(sections, currentAngle)

    // Draw segments
    for (const seg of segments) {
      ctx.beginPath()
      ctx.moveTo(cx * dpr, cy * dpr)
      ctx.arc(cx * dpr, cy * dpr, radius * dpr, seg.startAngle, seg.endAngle)
      ctx.closePath()
      ctx.fillStyle = seg.section.color
      ctx.fill()
      ctx.strokeStyle = "rgba(255,255,255,0.6)"
      ctx.lineWidth = 1.5 * dpr
      ctx.stroke()

      // Draw label if segment is wide enough (> 15 degrees)
      const arcSpan = seg.endAngle - seg.startAngle
      if (arcSpan > (15 * Math.PI) / 180) {
        ctx.save()
        ctx.translate(cx * dpr, cy * dpr)
        ctx.rotate(seg.midAngle)
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"
        ctx.fillStyle = darken(seg.section.color, 80)
        const fontSize = Math.max(10, Math.min(16, (arcSpan * 180) / Math.PI * 0.7))
        ctx.font = `600 ${fontSize * dpr}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
        const maxWidth = (radius - innerRadius - 16) * dpr
        const name = seg.section.name || "?"
        ctx.fillText(name, (radius - 16) * dpr, 0, maxWidth)
        ctx.restore()
      }
    }

    // Outer ring shadow
    ctx.beginPath()
    ctx.arc(cx * dpr, cy * dpr, radius * dpr, 0, 2 * Math.PI)
    ctx.strokeStyle = "rgba(0,0,0,0.15)"
    ctx.lineWidth = 3 * dpr
    ctx.stroke()

    // Center hub
    ctx.beginPath()
    ctx.arc(cx * dpr, cy * dpr, innerRadius * dpr, 0, 2 * Math.PI)
    ctx.fillStyle = "#1e1e2e"
    ctx.fill()
    ctx.strokeStyle = "rgba(255,255,255,0.3)"
    ctx.lineWidth = 2 * dpr
    ctx.stroke()

    // Center dot
    ctx.beginPath()
    ctx.arc(cx * dpr, cy * dpr, 6 * dpr, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.fill()
  }, [sections, currentAngle, size])

  // Initialize canvas with correct DPR
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
  }, [size])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} className="rounded-full" />
      {/* Pointer needle at top */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 z-10"
        style={{ marginTop: -2 }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "28px solid #ef4444",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
          }}
        />
      </div>
    </div>
  )
}
