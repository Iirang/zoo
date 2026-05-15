"use client"
import { useRef, useState, useCallback } from "react"
import { SpinState } from "@/types"

// Quintic ease-out: fast start, gradual slow-down, smooth stop
function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5)
}

export function useWheelAnimation() {
  const [currentAngle, setCurrentAngle] = useState(0)
  const [spinState, setSpinState] = useState<SpinState>("idle")

  const rafRef = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startSpin = useCallback((targetAngle: number, onComplete: () => void) => {
    cancel()

    const totalDuration = 4500 + Math.random() * 1500  // 4.5–6 seconds
    const startAngle = currentAngle
    const startTime = performance.now()
    const DECEL_THRESHOLD = 0.6  // last 40% feels like "decelerating"

    setSpinState("spinning")
    let stateChanged = false

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / totalDuration, 1)

      // Single smooth curve: fast at start, slowing toward end
      const eased = easeOutQuint(progress)
      const angle = startAngle + (targetAngle - startAngle) * eased
      setCurrentAngle(angle)

      if (progress > DECEL_THRESHOLD && !stateChanged) {
        stateChanged = true
        setSpinState("decelerating")
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCurrentAngle(targetAngle)
        setSpinState("done")
        rafRef.current = null
        onComplete()
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [currentAngle, cancel])

  const reset = useCallback(() => {
    cancel()
    setSpinState("idle")
  }, [cancel])

  return { currentAngle, spinState, startSpin, reset }
}
