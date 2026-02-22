"use client"

import { useEffect, useRef } from "react"

export function AppShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")
    if (!gl) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const vsSource = `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0,1);}`
    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      void main(){
        vec2 uv=(gl_FragCoord.xy)/u_res;
        float d1=length(uv-vec2(0.3+sin(u_time*0.15)*0.15,0.6+cos(u_time*0.12)*0.2));
        float d2=length(uv-vec2(0.7+cos(u_time*0.1)*0.2,0.3+sin(u_time*0.18)*0.15));
        float d3=length(uv-vec2(0.5+sin(u_time*0.08)*0.25,0.5+cos(u_time*0.14)*0.25));
        float blob=exp(-d1*3.5)*0.06+exp(-d2*3.0)*0.05+exp(-d3*4.0)*0.04;
        vec3 col=vec3(0.063,0.725,0.506)*blob;
        col+=vec3(0.024)*smoothstep(1.0,0.0,length(uv-0.5)*1.2);
        gl_FragColor=vec4(col,1.0);
      }
    `
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSource))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSource))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, "u_time")
    const uRes = gl.getUniformLocation(prog, "u_res")

    let frame: number
    const t0 = performance.now()
    const loop = () => {
      gl.uniform1f(uTime, (performance.now() - t0) / 1000)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      frame = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10" style={{ background: "#060606" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/60 via-transparent to-[#060606]/80" />
    </div>
  )
}
