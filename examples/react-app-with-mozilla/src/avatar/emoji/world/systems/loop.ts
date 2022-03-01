import { Camera, Clock, Scene, WebGLRenderer } from 'three'

const clock = new Clock()

export interface TickUpdateable {
  tick(delta: number): void
}

export class WebGLLoop {
  renderer: WebGLRenderer
  canvas: HTMLCanvasElement
  isRunning: boolean = false

  scene?: Scene
  camera?: Camera

  updatables: TickUpdateable[] = []

  constructor({
    renderer,
    canvas,
    scene,
    camera
  } : {
    renderer: WebGLRenderer,
    canvas: HTMLCanvasElement,
    scene?: Scene,
    camera?: Camera
  }) {
    this.renderer = renderer
    this.canvas = canvas
    this.scene = scene
    this.camera = camera
  }

  start() {
    this.isRunning = true
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick()

      this.renderer.setClearColor(0xffffff)
      this.renderer.clear()

      if (!this.scene || !this.camera) return

      this.renderer.render(this.scene, this.camera)
    })
  }

  stop() {
    this.isRunning = false
    this.renderer.setAnimationLoop(null)
  }

  tick() {
    // Only do this once per frame
    const delta = clock.getDelta()

    for (const object of this.updatables) {
      object.tick(delta)
    }
  }
}
