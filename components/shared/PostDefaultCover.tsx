"use client"

interface PostDefaultCoverProps {
  title?: string
  className?: string
  size?: "card" | "hero"
}

const GRID_SIZE = 28

export function PostDefaultCover({ title = "", className = "", size = "card" }: PostDefaultCoverProps) {
  // Create a stable "seed" from the title so each post gets a slightly different color accent
  const seed = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hues = [210, 240, 260, 200, 220, 270]
  const hue = hues[seed % hues.length]

  const accent = `hsl(${hue}, 90%, 60%)`
  const accentDim = `hsl(${hue}, 80%, 40%)`
  const accentGlow = `hsl(${hue}, 90%, 55%)`

  return (
    <div
      className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none ${className}`}
      style={{ background: `linear-gradient(135deg, #050d1e 0%, #080f22 60%, #0a1428 100%)` }}
    >
      {/* Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${seed}`} width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke={accent} strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${seed})`} />
      </svg>

      {/* Glows */}
      <div
        className="absolute top-0 left-1/3 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
        style={{ background: accentGlow }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-36 h-36 rounded-full blur-[60px] opacity-15 pointer-events-none"
        style={{ background: `hsl(${hue + 30}, 90%, 55%)` }}
      />

      {/* Central SVG Illustration */}
      <div className="relative flex flex-col items-center gap-3 z-10 px-6">
        {/* Code bracket / terminal icon */}
        <svg
          width={size === "hero" ? 80 : 56}
          height={size === "hero" ? 80 : 56}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer rounded square */}
          <rect x="1" y="1" width="54" height="54" rx="14" stroke={accent} strokeWidth="1.5" fill={`hsl(${hue},60%,10%)`} fillOpacity="0.6" />
          {/* Terminal dots */}
          <circle cx="13" cy="15" r="2.5" fill="#ef4444" opacity="0.8" />
          <circle cx="21" cy="15" r="2.5" fill="#f59e0b" opacity="0.8" />
          <circle cx="29" cy="15" r="2.5" fill="#22c55e" opacity="0.8" />
          {/* Divider line */}
          <line x1="8" y1="22" x2="48" y2="22" stroke={accent} strokeWidth="0.7" opacity="0.4" />
          {/* Code lines */}
          <rect x="10" y="27" width="18" height="2.5" rx="1.25" fill={accent} opacity="0.7" />
          <rect x="14" y="33" width="24" height="2.5" rx="1.25" fill={accent} opacity="0.5" />
          <rect x="14" y="39" width="14" height="2.5" rx="1.25" fill={accent} opacity="0.4" />
          <rect x="10" y="45" width="20" height="2.5" rx="1.25" fill={accent} opacity="0.3" />
          {/* Cursor blink rect */}
          <rect x="32" y="27" width="6" height="2.5" rx="1.25" fill="white" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0;0.9" dur="1.1s" repeatCount="indefinite" />
          </rect>
        </svg>

        {/* Decorative code text */}
        <div className="font-mono text-center space-y-1">
          <p
            className="text-[10px] font-bold tracking-widest uppercase opacity-60"
            style={{ color: accent }}
          >
            Blog Post
          </p>
          {title && (
            <p
              className={`font-bold leading-snug line-clamp-2 text-center text-white/80 ${size === "hero" ? "text-base max-w-xs" : "text-[11px] max-w-[180px]"}`}
            >
              {title}
            </p>
          )}
        </div>

        {/* Bottom tag */}
        <div
          className="absolute bottom-3 right-4 font-mono opacity-30"
          style={{ fontSize: 9, color: accent }}
        >
          &lt;enemer-tech /&gt;
        </div>
      </div>

      {/* Corner decorations */}
      <div
        className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl-md"
        style={{ borderColor: accentDim, opacity: 0.5 }}
      />
      <div
        className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr-md"
        style={{ borderColor: accentDim, opacity: 0.5 }}
      />
      <div
        className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl-md"
        style={{ borderColor: accentDim, opacity: 0.5 }}
      />
      <div
        className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br-md"
        style={{ borderColor: accentDim, opacity: 0.5 }}
      />
    </div>
  )
}
