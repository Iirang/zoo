"use client"
import { useState, useCallback } from "react"
import { Section, SpinState } from "@/types"
import { assignColor } from "@/lib/colors"
import { pickWinner, computeTargetAngle } from "@/lib/wheelMath"
import { useWheelAnimation } from "./useWheelAnimation"

const MIN_SECTIONS = 2
const MAX_SECTIONS = 16

function makeSection(name: string, usedColors: string[]): Section {
  return {
    id: crypto.randomUUID(),
    name,
    weight: 1,
    color: assignColor(usedColors),
  }
}

const defaultSections: Section[] = (() => {
  const s1 = makeSection("항목 1", [])
  const s2 = makeSection("항목 2", [s1.color])
  return [s1, s2]
})()

export function useRoulette() {
  const [sections, setSections] = useState<Section[]>(defaultSections)
  const [winner, setWinner] = useState<Section | null>(null)
  const { currentAngle, spinState, startSpin, reset } = useWheelAnimation()

  const addSection = useCallback((name = "") => {
    setSections((prev) => {
      if (prev.length >= MAX_SECTIONS) return prev
      const usedColors = prev.map((s) => s.color)
      const label = name || `항목 ${prev.length + 1}`
      return [...prev, makeSection(label, usedColors)]
    })
  }, [])

  const removeSection = useCallback((id: string) => {
    setSections((prev) => {
      if (prev.length <= MIN_SECTIONS) return prev
      return prev.filter((s) => s.id !== id)
    })
  }, [])

  const updateSection = useCallback((id: string, patch: Partial<Omit<Section, "id">>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const weight = patch.weight !== undefined
          ? (isNaN(patch.weight) || patch.weight <= 0 ? 1 : patch.weight)
          : s.weight
        return { ...s, ...patch, weight }
      })
    )
  }, [])

  const addSectionsFromText = useCallback((raw: string) => {
    const names = raw.trim().split(/\s+/).filter(Boolean)
    if (names.length === 0) return
    setSections((prev) => {
      const slots = MAX_SECTIONS - prev.length
      if (slots <= 0) return prev
      const toAdd = names.slice(0, slots)
      const usedColors = prev.map((s) => s.color)
      const newSections: Section[] = []
      for (const name of toAdd) {
        const colors = [...usedColors, ...newSections.map((s) => s.color)]
        newSections.push(makeSection(name, colors))
      }
      return [...prev, ...newSections]
    })
  }, [])

  const spin = useCallback(() => {
    if (spinState !== "idle" && spinState !== "done") return
    setWinner(null)
    const picked = pickWinner(sections)
    const target = computeTargetAngle(sections, picked, currentAngle)
    startSpin(target, () => {
      setWinner(picked)
    })
  }, [sections, currentAngle, spinState, startSpin])

  const resetSpin = useCallback(() => {
    setWinner(null)
    reset()
  }, [reset])

  return {
    sections,
    addSection,
    removeSection,
    updateSection,
    addSectionsFromText,
    spin,
    resetSpin,
    winner,
    spinState: spinState as SpinState,
    currentAngle,
    canAdd: sections.length < MAX_SECTIONS,
    canRemove: sections.length > MIN_SECTIONS,
  }
}
