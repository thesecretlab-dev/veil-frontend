"use client"

import { useState, useRef } from "react"
import { Play, Pause } from "lucide-react"

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full flex items-center justify-center group"
        style={{
          background: "rgba(255, 255, 255, 0.015)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(16, 185, 129, 0.06)",
          opacity: 0.12,
          transition: "all 1.5s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)" }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.12"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.06)" }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms]"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
            filter: "blur(8px)",
            boxShadow: `
              0 0 20px rgba(16, 185, 129, 0.6),
              0 0 40px rgba(16, 185, 129, 0.4),
              0 0 60px rgba(16, 185, 129, 0.2),
              inset 0 0 20px rgba(16, 185, 129, 0.3)
            `,
          }}
        />
        {isPlaying ? (
          <Pause className="w-4 h-4 text-emerald-300/60 relative z-10 group-hover:text-emerald-200 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-[1500ms]" />
        ) : (
          <Play className="w-4 h-4 text-emerald-300/60 ml-0.5 relative z-10 group-hover:text-emerald-200 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-[1500ms]" />
        )}
        {/* </CHANGE> */}
      </button>

      <audio ref={audioRef} src="/audio/bene-gesserit-litany.mp3" loop />
    </div>
  )
}
