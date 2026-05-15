"use client"
import { Section, SpinState } from "@/types"

interface Props {
  winner: Section | null
  spinState: SpinState
}

export default function WinnerDisplay({ winner, spinState }: Props) {
  const show = spinState === "done" && winner !== null

  return (
    <div
      className={`mt-5 transition-all duration-500 overflow-hidden ${
        show ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
      }`}
    >
      {winner && (
        <div
          className="rounded-2xl px-6 py-4 text-center shadow-xl border border-white/10"
          style={{ background: `linear-gradient(135deg, ${winner.color}33, ${winner.color}55)` }}
        >
          <p className="text-sm text-white/70 font-medium mb-1">당첨!</p>
          <p
            className="text-3xl font-extrabold"
            style={{ color: winner.color, textShadow: `0 0 20px ${winner.color}88` }}
          >
            {winner.name || "?"}
          </p>
        </div>
      )}
    </div>
  )
}
