import { WebGLRenderer, LinearToneMapping, sRGBEncoding } from 'three'

export const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
    preserveDrawingBuffer: true
  })

  renderer.setClearColor(0xffffff, 0)
  renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight)
  renderer.physicallyCorrectLights = true
  renderer.toneMapping = LinearToneMapping
  renderer.toneMappingExposure = 0.8
  renderer.outputEncoding = sRGBEncoding

  return renderer
}
