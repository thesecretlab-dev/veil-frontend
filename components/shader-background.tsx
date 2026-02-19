"use client"

import { useRef } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

export function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-black -z-10">
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#10b981", "#ffffff", "#064e3b", "#059669"]}
        speed={0.3}
        backgroundColor="#000000"
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#000000", "#ffffff", "#10b981", "#000000"]}
        speed={0.2}
        wireframe="true"
        backgroundColor="transparent"
      />
    </div>
  )
}

export default ShaderBackground
