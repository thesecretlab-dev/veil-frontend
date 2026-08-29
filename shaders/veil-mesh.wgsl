import { simplex2d } from "@vgpu/wgsl-std/noise/simplex";

struct Params {
  resolution: vec2f,
  time: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

@fragment fn fs_main(@location(0) uv_in: vec2f) -> @location(0) vec4f {
  let uv = vec2f(uv_in.x, 1.0 - uv_in.y);
  let t = params.time * 0.12;
  let n1 = simplex2d(uv * vec2f(2.1, 1.6) + vec2f(t * 0.35, t * 0.22));
  let n2 = simplex2d(uv * vec2f(3.4, 2.8) - vec2f(t * 0.18, t * 0.28));
  let field = clamp(0.5 + 0.42 * n1 + 0.18 * n2, 0.0, 1.0);
  var col = vec3f(0.0);
  col = mix(col, vec3f(0.024, 0.306, 0.231), smoothstep(0.18, 0.52, field));
  col = mix(col, vec3f(0.063, 0.725, 0.506), smoothstep(0.38, 0.78, field));
  col = mix(col, vec3f(0.85, 0.95, 0.92), smoothstep(0.82, 1.0, field) * 0.35);
  let wire = abs(fract((uv.x * 1.4 + uv.y) * 14.0 + n2 * 0.4 + t) - 0.5);
  col += vec3f(0.063, 0.725, 0.506) * (1.0 - smoothstep(0.0, 0.035, wire)) * 0.12 * field;
  return vec4f(col, 1.0);
}
