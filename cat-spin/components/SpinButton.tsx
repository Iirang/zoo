"use client"
import { SpinState } from "@/types"

interface Props {
  spinState: SpinState
  onSpin: () => void
  onReset: () => void
}

export default function SpinButton({ spinState, onSpin, onReset }: Props) {
  const isSpinning = spinState === "spinning" || spinState === "decelerating"
  const isDone = spinState === "done"

  return (
    <div className="flex gap-3 justify-center mt-6">
      <button
        onClick={onSpin}
        disabled={isSpinning}
        className="px-10 py-3 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-150
          bg-gradient-to-r from-violet-600 to-fuchsia-600
          hover:from-violet-500 hover:to-fuchsia-500
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isSpinning ? "돌아가는 중..." : "돌려라!"}
      </button>
      {isDone && (
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-lg transition-all active:scale-95"
        >
          초기화
        </button>
      )}
    </div>
  )
}
