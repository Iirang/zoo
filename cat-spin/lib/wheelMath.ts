import { Section, SegmentLayout } from "@/types"

export function computeSegments(sections: Section[], offsetAngle: number): SegmentLayout[] {
  const totalWeight = sections.reduce((s, x) => s + x.weight, 0)
  const layouts: SegmentLayout[] = []
  let current = offsetAngle

  for (const section of sections) {
    const span = (section.weight / totalWeight) * 2 * Math.PI
    const startAngle = current
    const endAngle = current + span
    const midAngle = current + span / 2
    layouts.push({ section, startAngle, endAngle, midAngle })
    current = endAngle
  }

  return layouts
}

export function normalizeAngle(a: number): number {
  return ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
}

// Pointer is at top (−π/2 = 270°). Finds which segment the pointer lands on.
export function getWinnerAtAngle(segments: SegmentLayout[], wheelAngle: number): Section {
  const pointer = normalizeAngle(-Math.PI / 2 - wheelAngle)
  for (const seg of segments) {
    const start = normalizeAngle(seg.startAngle)
    const end = normalizeAngle(seg.endAngle)
    if (start <= end) {
      if (pointer >= start && pointer < end) return seg.section
    } else {
      // wraps around 0
      if (pointer >= start || pointer < end) return seg.section
    }
  }
  return segments[0].section
}

export function pickWinner(sections: Section[]): Section {
  const total = sections.reduce((s, x) => s + x.weight, 0)
  let r = Math.random() * total
  for (const s of sections) {
    r -= s.weight
    if (r <= 0) return s
  }
  return sections[sections.length - 1]
}

// Returns the wheel angle needed so the pointer lands on the winner's midpoint,
// after N full rotations.
export function computeTargetAngle(
  sections: Section[],
  winner: Section,
  currentAngle: number,
  rotations = 7
): number {
  const segments = computeSegments(sections, 0)
  const winnerSeg = segments.find((s) => s.section.id === winner.id)!
  // We want: normalizeAngle(-π/2 - targetAngle) == winnerSeg.midAngle
  // → targetAngle = -π/2 - winnerSeg.midAngle
  const base = -Math.PI / 2 - winnerSeg.midAngle
  // Add enough rotations so we spin forward from currentAngle
  const minAngle = currentAngle + rotations * 2 * Math.PI
  let target = base
  while (target < minAngle) {
    target += 2 * Math.PI
  }
  return target
}
