export interface Section {
  id: string
  name: string
  weight: number
  color: string
}

export type SpinState = "idle" | "spinning" | "decelerating" | "done"

export interface SegmentLayout {
  section: Section
  startAngle: number
  endAngle: number
  midAngle: number
}
