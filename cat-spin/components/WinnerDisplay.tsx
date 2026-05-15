"use client"
import { useEffect, useState } from "react"
import { Section, SpinState } from "@/types"

interface Props {
  winner: Section | null
  spinState: SpinState
}

export default function WinnerDisplay({ winner, spinState }: Props) {
  const show = spinState === "done" && winner !== null
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (show) setAnimKey((k) => k + 1)
  }, [show, winner?.id])

  return (
    <div
      className={`mt-5 transition-all duration-500 overflow-hidden ${
        show ? "opacity-100 max-h-60" : "opacity-0 max-h-0"
      }`}
    >
      {winner && (
        <div
          key={animKey}
          className="winner-card rounded-2xl px-8 py-5 text-center shadow-2xl border-2 relative"
          style={{
            background: `linear-gradient(135deg, ${winner.color}40, ${winner.color}80)`,
            borderColor: `${winner.color}cc`,
            boxShadow: `0 0 40px ${winner.color}88, 0 0 80px ${winner.color}44`,
          }}
        >
          <div className="text-sm text-white/80 font-bold tracking-widest mb-2 winner-tagline">
            🎉 당첨! 🎉
          </div>
          <p
            className="text-4xl font-black winner-name"
            style={{
              color: "#fff",
              textShadow: `0 0 20px ${winner.color}, 0 0 40px ${winner.color}88, 0 2px 4px rgba(0,0,0,0.5)`,
            }}
          >
            {winner.name || "?"}
          </p>
        </div>
      )}
      <style jsx>{`
        .winner-card {
          animation: winner-pop 600ms cubic-bezier(0.34, 1.56, 0.64, 1),
            winner-glow 2s ease-in-out infinite alternate 600ms;
        }
        .winner-tagline {
          animation: winner-shake 600ms ease-in-out 100ms;
        }
        .winner-name {
          animation: winner-zoom 800ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms backwards;
        }
        @keyframes winner-pop {
          0% { transform: scale(0.3) rotate(-8deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes winner-zoom {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes winner-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px) rotate(-2deg); }
          40% { transform: translateX(4px) rotate(2deg); }
          60% { transform: translateX(-3px) rotate(-1deg); }
          80% { transform: translateX(3px) rotate(1deg); }
        }
        @keyframes winner-glow {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.15); }
        }
      `}</style>
    </div>
  )
}
