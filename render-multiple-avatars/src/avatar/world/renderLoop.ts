import { Clock, WebGLRenderer } from 'three'
import { isGlobalCanvas } from './globalCanvas'
import { createDefaultWebGLRenderer } from './systems/webGLRenderer'

const clock = new Clock()

export interface Updateable {
  tick(delta: number): void
}

export interface Renderable {
  render(renderer: WebGLRenderer): void
}

export class RenderLoop {
  webGLRenderer: WebGLRenderer
  canvas: HTMLCanvasElement
  drawWhenOffscreen: boolean
  isRunning: boolean = false

  updatables: Updateable[] = []
  renderables: Renderable[] = []

  constructor({
    canvas,
    webGLRenderer,
  } : {
    canvas: HTMLCanvasElement,
    webGLRenderer?: WebGLRenderer
  }) {
    this.canvas = canvas
    this.webGLRenderer = webGLRenderer || createDefaultWebGLRenderer(canvas)
  }

  start() {
    this.isRunning = true
    this.webGLRenderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      const delta = clock.getDelta()
      for (const updatable of this.updatables) {
        updatable.tick(delta)
      }

      // translate to match scroll on page
      if (isGlobalCanvas(this.canvas)) {
        this.canvas.style.transform = `translate(${window.scrollX}px, ${window.scrollY}px)`
      }

      // Clear canvas
      this.webGLRenderer.clear()

      // Draw things
      for (const renderable of this.renderables) {
        renderable.render(this.webGLRenderer)
      }
    })
  }

  stop() {
    this.isRunning = false
    this.webGLRenderer.setAnimationLoop(null)
  }
}
