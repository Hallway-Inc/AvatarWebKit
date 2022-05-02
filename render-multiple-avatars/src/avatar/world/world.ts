import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'

// eslint-disable-next-line
import { AvatarPrediction } from '@quarkworks-inc/avatar-webkit'

import { createCamera } from './components/camera'
import { createLights } from './components/lights'
import { createScene } from './components/scene'
import { createControls, UpdateableControls } from './systems/controls'
import { Renderable, Updateable } from './renderLoop'
import { EnvironmentLoader } from './systems/environmentLoader'
import { Model } from './models'

const sceneBackgroundColor = new Color(0xffffff)

export class AvatarWorld implements Updateable, Renderable {
  private container: HTMLElement
  private isMe: boolean
  private enableControls: boolean
  private environmentLoader: EnvironmentLoader

  private scene: Scene
  private camera: PerspectiveCamera
  private controls: UpdateableControls

  private controlsEnabled = true

  private model?: Model

  constructor({
    container,
    isMe,
    enableControls,
    environmentLoader,
  }: {
    container: HTMLElement
    isMe?: boolean
    enableControls?: boolean
    environmentLoader: EnvironmentLoader
  }) {
    this.container = container
    this.isMe = isMe ?? true
    this.enableControls = enableControls ?? false
    this.environmentLoader = environmentLoader

    this.camera = createCamera()
    this.scene = createScene()
    this.scene.background = sceneBackgroundColor

    this.scene.rotateY((Math.PI / 180) * 0)

    this.controls = createControls(this.camera, this.container)
    this.controls.enabled = this.enableControls

    const { hemisphereLight, ambientLight, mainLight } = createLights()
    this.scene.add(hemisphereLight)
    this.camera.add(ambientLight, mainLight)

    this.scene.add(this.camera)

    this.resize()
  }

  async loadScene(model: Model) {
    this.model = model
    this.model.addToScene(this.scene)

    this.camera.position.x = 0
    this.camera.position.z = model.type === 'emoji' ? 1 : 0.6
    this.camera.position.y = 0

    this.environmentLoader.load('../backgrounds/venice_sunset_1k.hdr').then(envMap => {
      this.scene.environment = envMap
      this.scene.background = envMap
    })
  }

  cleanUp() {
    this.setAvatarEnabled(false)
    this.model = undefined
  }

  setAvatarEnabled(enabled: boolean) {
    if (enabled) {
      this.model?.addToScene(this.scene)
    } else {
      this.model?.removeFromScene(this.scene)
    }
  }

  resize() {
    if (!this.camera) return

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()
  }

  tick(delta: number): void {
    this.controls.tick(delta)
  }

  containerIsOffscreen(screenWidth: number, screenHeight: number): boolean {
    const { left, right, top, bottom } = this.container.getBoundingClientRect()

    return bottom < 0 ||      // above
      top > screenHeight ||   // below
      right < 0 ||            // left
      left > screenWidth      // right
  }

  render(renderer: WebGLRenderer): void {

    const rendererWidth = renderer.domElement.clientWidth
    const rendererHeight = renderer.domElement.clientHeight

    if (this.containerIsOffscreen(rendererWidth, rendererHeight)) {
      return
    }

    renderer.setScissorTest(true)

    const { width, height, left, bottom } = this.container.getBoundingClientRect()

    const xPos = left
    const yPos = rendererHeight - bottom

    renderer.setViewport(xPos, yPos, width, height)
    renderer.setScissor(xPos, yPos, width, height)

    renderer.render(this.scene, this.camera)

    renderer.setScissorTest(false)
  }

  updateFromResults(results: AvatarPrediction) {
    this.model?.updateFromResults(results)
  }
}
