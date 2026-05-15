"use client"
import RouletteWheel from "@/components/RouletteWheel"
import SpinButton from "@/components/SpinButton"
import WinnerDisplay from "@/components/WinnerDisplay"
import SectionEditor from "@/components/SectionEditor"
import PasteInput from "@/components/PasteInput"
import { useRoulette } from "@/hooks/useRoulette"

export default function Home() {
  const {
    sections,
    addSection,
    removeSection,
    updateSection,
    addSectionsFromText,
    spin,
    resetSpin,
    winner,
    spinState,
    currentAngle,
    canAdd,
    canRemove,
  } = useRoulette()

  return (
    <main className="min-h-screen bg-[#0f0f1a] text-white px-4 py-8">
      <h1 className="text-center text-3xl font-extrabold mb-8 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
        🎡 Cat Spin
      </h1>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Wheel */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[480px]">
            <RouletteWheel sections={sections} currentAngle={currentAngle} size={480} />
          </div>
          <SpinButton spinState={spinState} onSpin={spin} onReset={resetSpin} />
          <WinnerDisplay winner={winner} spinState={spinState} />
        </div>

        {/* Right: Editor */}
        <div className="flex flex-col gap-6 bg-slate-900 rounded-2xl p-5 border border-slate-700/50">
          <PasteInput onAdd={addSectionsFromText} />
          <hr className="border-slate-700" />
          <SectionEditor
            sections={sections}
            onUpdate={updateSection}
            onRemove={removeSection}
            onAdd={addSection}
            canAdd={canAdd}
            canRemove={canRemove}
          />
        </div>
      </div>
    </main>
  )
}
