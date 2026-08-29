#!/usr/bin/env node
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { resolveShader } from "@vgpu/wgsl/runtime"
import { effect, init, target } from "vgpu/mock"

const here = dirname(fileURLToPath(import.meta.url))
const entries = ["veil-blobs.wgsl", "veil-mesh.wgsl"].map((name) =>
  resolve(here, "../shaders", name),
)

for (const entry of entries) {
  const result = await resolveShader({
    entry,
    rootDir: dirname(entry),
    validate: "off",
  })
  const errs = (result.diagnostics ?? []).filter((d) => d.severity === "error")
  if (errs.length) {
    console.error(entry, errs)
    process.exit(1)
  }
  if (!result.wgsl.includes("@fragment fn fs_main")) {
    console.error("missing fs_main", entry)
    process.exit(1)
  }
  const gpu = await init()
  const off = target(gpu, { size: [64, 32] })
  const fx = effect(gpu, result.wgsl, {
    set: { params: { resolution: [64, 32], time: 0.4 } },
  })
  await fx.compile(off)
  fx.draw(off)
  await gpu.settled()
  gpu.dispose()
  console.log("PASS", entry, `${result.deps.length} modules`, `${result.wgsl.length} bytes`)
}
