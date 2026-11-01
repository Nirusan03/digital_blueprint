// How much the 3D may cost on this device.
// high: full scene. low: reduced scene, 30fps. still: pre-rendered frames and no WebGL at all.
let cached = null;

function graphicsRenderer() {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return null;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return String(name);
  } catch {
    return null;
  }
}

export default function quality() {
  if (cached) return cached;
  const forced = new URLSearchParams(location.search).get("quality");
  if (["high", "low", "still"].includes(forced)) return (cached = forced);
  const renderer = graphicsRenderer();
  if (renderer === null || navigator.connection?.saveData) return (cached = "still");
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return (cached = "still");
  const weakGraphics = /intel.*\b(hd|uhd)\b/i.test(renderer);
  const small = matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  return (cached = weakGraphics || small ? "low" : "high");
}
