"use client"
import { useState } from "react"

interface Props {
  onAdd: (text: string) => void
}

export default function PasteInput({ onAdd }: Props) {
  const [value, setValue] = useState("")

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text")
    if (pasted.trim()) {
      onAdd(pasted)
      e.preventDefault()
      setValue("")
    }
  }

  const handleSubmit = () => {
    if (value.trim()) {
      onAdd(value)
      setValue("")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
        텍스트 붙여넣기
      </h2>
      <p className="text-xs text-slate-500">
        공백(스페이스·탭·줄바꿈)으로 구분된 이름들을 붙여넣으면 자동으로 분리됩니다.
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={handlePaste}
        placeholder={"예: 사과 바나나 딸기\n(붙여넣으면 즉시 추가됩니다)"}
        rows={3}
        className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-violet-500 focus:outline-none resize-none placeholder-slate-500"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="self-end text-sm px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
      >
        항목 추가
      </button>
    </div>
  )
}
