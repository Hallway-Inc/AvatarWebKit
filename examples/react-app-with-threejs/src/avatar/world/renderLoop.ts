import { Clock, WebGLRenderer } from 'three'
import { isGlobalCanvas } from './globalCanvas'
import { createDefaultWebGLRenderer } from './systems/webGLRenderer'

const clock = new Clock()

export interface Updateable {
  tick(delta: number): void
}

export interface Renderable {
  render(renderer: WebGLRenderer): void
  getContainerRect(): DOMRect
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
      this.webGLRenderer.setClearColor(0xffffff)
      this.webGLRenderer.clear()

      // Draw things
      for (const renderable of this.renderables) {
        this._withScissoredViewport(renderable, () => {
          renderable.render(this.webGLRenderer)
        })
      }
    })
  }

  private _isRenderableOffscreen(renderable: Renderable): boolean {
    const { top, left, bottom, right } = renderable.getContainerRect()
  
    return bottom < 0 ||                  // above
      top > this.canvas.clientHeight ||   // below
      right < 0 ||                        // left
      left > this.canvas.clientWidth      // right
  }

  private _withScissoredViewport(renderable: Renderable, render: () => void) {
    if (!isGlobalCanvas(this.canvas)) {
      render()
      return
    }

    // For global canvas, we do some optimization to skip item drawing when offscreen
    if (this._isRenderableOffscreen(renderable)) {
      return
    }

    // For global canvas, we use scissoring technique to draw scenes to different locations on the canvas
    this.webGLRenderer.setScissorTest(true)

    const { width, height, left, bottom } = renderable.getContainerRect()
    
    const xPos = left
    const yPos = this.canvas.clientHeight - bottom

    this.webGLRenderer.setViewport(xPos, yPos, width, height)
    this.webGLRenderer.setScissor(xPos, yPos, width, height)

    render()

    this.webGLRenderer.setScissorTest(false)
  }

  stop() {
    this.isRunning = false
    this.webGLRenderer.setAnimationLoop(null)
  }
}
