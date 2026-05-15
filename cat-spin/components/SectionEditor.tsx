"use client"
import { Section } from "@/types"

interface Props {
  sections: Section[]
  onUpdate: (id: string, patch: Partial<Omit<Section, "id">>) => void
  onRemove: (id: string) => void
  onAdd: () => void
  canAdd: boolean
  canRemove: boolean
}

export default function SectionEditor({ sections, onUpdate, onRemove, onAdd, canAdd, canRemove }: Props) {
  const totalWeight = sections.reduce((s, x) => s + x.weight, 0)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          구간 설정 ({sections.length}/16)
        </h2>
        <button
          onClick={onAdd}
          disabled={!canAdd}
          className="text-sm px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          + 추가
        </button>
      </div>

      <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1">
        {sections.map((section) => {
          const pct = ((section.weight / totalWeight) * 100).toFixed(1)
          return (
            <div key={section.id} className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
              {/* Color swatch */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
                style={{ background: section.color }}
              />

              {/* Name input */}
              <input
                type="text"
                value={section.name}
                onChange={(e) => onUpdate(section.id, { name: e.target.value })}
                placeholder="이름"
                className="flex-1 min-w-0 bg-slate-700 text-white text-sm rounded px-2 py-1 border border-slate-600 focus:border-violet-500 focus:outline-none"
              />

              {/* Weight input */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <input
                  type="number"
                  value={section.weight}
                  min={0.1}
                  step={0.1}
                  onChange={(e) => onUpdate(section.id, { weight: parseFloat(e.target.value) })}
                  className="w-16 bg-slate-700 text-white text-sm rounded px-2 py-1 border border-slate-600 focus:border-violet-500 focus:outline-none text-center"
                />
                <span className="text-slate-400 text-xs w-10 text-right">{pct}%</span>
              </div>

              {/* Delete */}
              <button
                onClick={() => onRemove(section.id)}
                disabled={!canRemove}
                className="text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none flex-shrink-0"
                aria-label="삭제"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
