struct Params {
  resolution: vec2f,
  time: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

@fragment fn fs_main(@location(0) uv_in: vec2f) -> @location(0) vec4f {
  let uv = vec2f(uv_in.x, 1.0 - uv_in.y);
  let t = params.time;
  let d1 = length(uv - vec2f(0.3 + sin(t * 0.15) * 0.15, 0.6 + cos(t * 0.12) * 0.2));
  let d2 = length(uv - vec2f(0.7 + cos(t * 0.1) * 0.2, 0.3 + sin(t * 0.18) * 0.15));
  let d3 = length(uv - vec2f(0.5 + sin(t * 0.08) * 0.25, 0.5 + cos(t * 0.14) * 0.25));
  let blob = exp(-d1 * 3.5) * 0.06 + exp(-d2 * 3.0) * 0.05 + exp(-d3 * 4.0) * 0.04;
  var col = vec3f(0.063, 0.725, 0.506) * blob;
  col += vec3f(0.024) * smoothstep(1.0, 0.0, length(uv - vec2f(0.5)) * 1.2);
  return vec4f(col, 1.0);
}
