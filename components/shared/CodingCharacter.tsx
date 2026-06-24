"use client"

import { useEffect, useState } from "react"

const CODE_LINES = [
  "const me = new Developer()",
  "me.skills = ['Next.js','FastAPI']",
  "me.passion = 'Building things'",
  "await me.deploy({ env: 'prod' })",
  "console.log(me.toString())",
  "// Output: 'Abdurasul N.'",
  "export default me",
]

export function CodingCharacter() {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [charIndex, setCharIndex] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(true)

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const line = CODE_LINES[currentLine]
    if (!isTyping) return

    if (charIndex < line.length) {
      const id = setTimeout(() => {
        setDisplayedText(line.slice(0, charIndex + 1))
        setCharIndex((i) => i + 1)
      }, 42)
      return () => clearTimeout(id)
    } else {
      // Pause then move to next line
      setIsTyping(false)
      const id = setTimeout(() => {
        setCurrentLine((l) => (l + 1) % CODE_LINES.length)
        setDisplayedText("")
        setCharIndex(0)
        setIsTyping(true)
      }, 1400)
      return () => clearTimeout(id)
    }
  }, [charIndex, currentLine, isTyping])

  const completedLines = CODE_LINES.slice(
    Math.max(0, currentLine - 3),
    currentLine
  )

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(#60a5fa, transparent 70%)" }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-3">
        {/* ── Character SVG ─────────────────────────────────── */}
        <div className="relative">
          <svg
            width="160"
            height="170"
            viewBox="0 0 160 170"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-xl"
          >
            {/* Chair */}
            <rect x="52" y="148" width="56" height="6" rx="3" fill="#1e3a5f" />
            <rect x="60" y="154" width="10" height="14" rx="2" fill="#1e3a5f" />
            <rect x="90" y="154" width="10" height="14" rx="2" fill="#1e3a5f" />
            <rect x="50" y="158" width="60" height="4" rx="2" fill="#152c47" />

            {/* Desk */}
            <rect x="18" y="120" width="124" height="7" rx="3.5" fill="#1e3a5f" />
            <rect x="24" y="127" width="8" height="22" rx="2" fill="#152c47" />
            <rect x="128" y="127" width="8" height="22" rx="2" fill="#152c47" />

            {/* Laptop base on desk */}
            <rect x="38" y="110" width="84" height="12" rx="3" fill="#0f2140" />
            {/* Laptop screen */}
            <rect x="40" y="68" width="80" height="44" rx="4" fill="#0a192f" />
            <rect x="42" y="70" width="76" height="40" rx="3" fill="#0d2137" />
            {/* Screen glow lines */}
            <rect x="47" y="75" width="45" height="2" rx="1" fill="#005fe8" opacity="0.7" />
            <rect x="47" y="80" width="35" height="2" rx="1" fill="#38bdf8" opacity="0.5" />
            <rect x="47" y="85" width="50" height="2" rx="1" fill="#005fe8" opacity="0.6" />
            <rect x="47" y="90" width="28" height="2" rx="1" fill="#a855f7" opacity="0.5" />
            <rect x="47" y="95" width="40" height="2" rx="1" fill="#38bdf8" opacity="0.4" />
            {/* Cursor blink on screen */}
            <rect
              x="92"
              y="75"
              width="2"
              height="8"
              rx="1"
              fill="#60a5fa"
              opacity={cursorVisible ? 0.9 : 0}
            />
            {/* Laptop hinge */}
            <rect x="38" y="108" width="84" height="4" rx="2" fill="#1a3356" />

            {/* Body */}
            <rect x="60" y="100" width="40" height="22" rx="8" fill="#2563eb" />
            {/* Hoodie pocket */}
            <rect x="70" y="112" width="20" height="10" rx="4" fill="#1d4ed8" />

            {/* Head */}
            <ellipse cx="80" cy="82" rx="20" ry="21" fill="#f5c5a3" />
            {/* Hair */}
            <path
              d="M60 76 Q62 54 80 56 Q98 54 100 76"
              fill="#1a1a2e"
              stroke="none"
            />
            <ellipse cx="80" cy="56" rx="20" ry="8" fill="#1a1a2e" />
            {/* Eyes */}
            <ellipse cx="73" cy="80" rx="3" ry="3.5" fill="#1a1a2e" />
            <ellipse cx="87" cy="80" rx="3" ry="3.5" fill="#1a1a2e" />
            {/* Eye shine */}
            <circle cx="74.5" cy="78.5" r="1" fill="white" />
            <circle cx="88.5" cy="78.5" r="1" fill="white" />
            {/* Nose */}
            <ellipse cx="80" cy="85" rx="1.5" ry="1" fill="#e8a882" />
            {/* Smile */}
            <path d="M74 89 Q80 94 86 89" stroke="#c47b52" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Glasses */}
            <rect x="67" y="76" width="11" height="8" rx="3" stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.6" />
            <rect x="82" y="76" width="11" height="8" rx="3" stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.6" />
            <line x1="78" y1="80" x2="82" y2="80" stroke="#1e3a5f" strokeWidth="1.5" opacity="0.6" />

            {/* Left arm - pointing at keyboard */}
            <path
              d="M60 108 Q42 114 46 120"
              stroke="#2563eb"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left hand */}
            <ellipse cx="46" cy="122" rx="5" ry="4" fill="#f5c5a3" />

            {/* Right arm - typing animation */}
            <path
              d="M100 108 Q118 114 114 120"
              stroke="#2563eb"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right hand */}
            <ellipse cx="114" cy="122" rx="5" ry="4" fill="#f5c5a3" />

            {/* Floating particles / code symbols */}
            <text x="18" y="88" fontSize="10" fill="#60a5fa" opacity="0.4" className="font-mono">{`{}`}</text>
            <text x="128" y="75" fontSize="9" fill="#a855f7" opacity="0.4" className="font-mono">{`</>`}</text>
            <text x="22" y="65" fontSize="8" fill="#38bdf8" opacity="0.3" className="font-mono">0x1</text>
          </svg>

          {/* Typing animation dots above head */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 items-end">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>

        {/* ── Typewriter Terminal ─────────────────────────────── */}
        <div className="w-[260px] rounded-xl border border-blue-900/40 bg-[#060f1e]/90 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#0a1628] border-b border-blue-900/30">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 text-[9px] text-neutral-500 font-mono">abdurasul@enemer-tech ~ </span>
          </div>

          {/* Terminal body */}
          <div className="p-3 font-mono text-[10px] space-y-0.5 min-h-[80px]">
            {completedLines.map((line, i) => (
              <div key={i} className="text-neutral-500 truncate">
                <span className="text-green-400/50 mr-1">›</span>
                {line}
              </div>
            ))}
            <div className="text-blue-300 truncate">
              <span className="text-green-400 mr-1">›</span>
              {displayedText}
              <span
                className="inline-block w-[5px] h-[11px] bg-blue-400 ml-0.5 align-[-1px]"
                style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Corner label */}
      <div className="absolute bottom-4 right-4 text-[9px] text-brand/50 font-mono">
        &lt;enemer-tech /&gt;
      </div>
    </div>
  )
}
