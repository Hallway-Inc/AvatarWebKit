import { WebGLRenderer, LinearToneMapping, sRGBEncoding } from "three"

export const createDefaultWebGLRenderer = (canvas: HTMLCanvasElement) => {

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
    preserveDrawingBuffer: true
  })

  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  renderer.physicallyCorrectLights = true
  renderer.toneMapping = LinearToneMapping
  renderer.toneMappingExposure = 0.8
  renderer.outputEncoding = sRGBEncoding

  return renderer
}