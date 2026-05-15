"use client"
import { useRef, useState, useCallback } from "react"
import { SpinState } from "@/types"

const PHASE_SPINUP = 0.1   // first 10%: accelerate
const PHASE_DECEL = 0.85   // last 15%: decelerate to exact stop

function easeIn(t: number): number {
  return t * t * t
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function useWheelAnimation() {
  const [currentAngle, setCurrentAngle] = useState(0)
  const [spinState, setSpinState] = useState<SpinState>("idle")

  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef(0)
  const totalDurationRef = useRef(0)
  const startAngleRef = useRef(0)
  const targetAngleRef = useRef(0)
  const decelStartAngleRef = useRef(0)
  const angleAtDecelRef = useRef(0)
  const maxVelocityRef = useRef(0)  // radians per ms

  const cancel = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startSpin = useCallback((targetAngle: number, onComplete: () => void) => {
    cancel()

    const totalDuration = 3000 + Math.random() * 2000  // 3–5 seconds
    const startAngle = currentAngle

    startTimeRef.current = performance.now()
    totalDurationRef.current = totalDuration
    startAngleRef.current = startAngle
    targetAngleRef.current = targetAngle
    angleAtDecelRef.current = 0
    decelStartAngleRef.current = 0

    // Max velocity: enough to cover most of the arc during constant phase
    const totalArc = targetAngle - startAngle
    // Rough estimate: constant phase covers ~75% of total arc
    const constantPhase = PHASE_DECEL - PHASE_SPINUP
    const constantDuration = totalDuration * constantPhase
    maxVelocityRef.current = (totalArc * 0.75) / constantDuration

    setSpinState("spinning")

    let decelStartAngleSet = false

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / totalDurationRef.current, 1)

      let angle: number

      if (progress < PHASE_SPINUP) {
        // Ease-in phase: velocity increases from 0 to max
        const t = progress / PHASE_SPINUP
        const velocity = maxVelocityRef.current * easeIn(t)
        const spinupDuration = totalDurationRef.current * PHASE_SPINUP
        angle = startAngleRef.current + velocity * elapsed * 0.5
        void spinupDuration
      } else if (progress < PHASE_DECEL) {
        // Constant phase
        const spinupEnd = startAngleRef.current + maxVelocityRef.current * (totalDurationRef.current * PHASE_SPINUP) * 0.5
        const constantElapsed = elapsed - totalDurationRef.current * PHASE_SPINUP
        angle = spinupEnd + maxVelocityRef.current * constantElapsed
        if (!decelStartAngleSet) {
          decelStartAngleRef.current = angle
          decelStartAngleSet = true
        }
        angleAtDecelRef.current = angle
        setSpinState("spinning")
      } else {
        // Ease-out phase: interpolate to exact target
        if (!decelStartAngleSet) {
          decelStartAngleRef.current = angleAtDecelRef.current
          decelStartAngleSet = true
        }
        const t = (progress - PHASE_DECEL) / (1 - PHASE_DECEL)
        angle = decelStartAngleRef.current + (targetAngleRef.current - decelStartAngleRef.current) * easeOut(t)
        setSpinState("decelerating")
      }

      setCurrentAngle(angle)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCurrentAngle(targetAngleRef.current)
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
