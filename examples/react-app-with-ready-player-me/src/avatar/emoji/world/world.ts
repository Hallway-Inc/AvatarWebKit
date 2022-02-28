import {
  Color,
  Group,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  PMREMGenerator,
  MeshStandardMaterial,
  Texture,
  SkinnedMesh,
  Bone,
  Object3D
} from 'three'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// eslint-disable-next-line
import { ActionUnits } from '@quarkworks-inc/avatar-webkit'

import { createCamera } from './components/camera'
import { loadModel } from './components/models/model'
import { createLights } from './components/lights'
import { createScene } from './components/scene'
import { createControls, UpdateableControls } from './systems/controls'
import { WebGLLoop } from './systems/loop'
import { createRenderer } from './systems/renderer'

const sceneBackgroundColor = new Color(0xffffff)
const Y_OFFSET = -0.55
const Z_OFFSET = 0.1

export class EmojiWorld {
  private container: HTMLElement
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private scene: Scene
  private webGLLoop: WebGLLoop
  private controls: UpdateableControls
  private pmremGenerator: PMREMGenerator

  controlsEnabled = true

  // Model group
  private head!: Group
  private avatarRoot!: Object3D
  private wolf3D_Avatar: SkinnedMesh
  private hips!: Bone

  private isMe: boolean

  constructor({
    canvas,
    isMe,
  }: {
    canvas: HTMLCanvasElement
    isMe: boolean
  }) {
    this.container = canvas
    this.renderer = createRenderer(canvas)
    this.camera = createCamera()
    this.scene = createScene()
    this.scene.background = sceneBackgroundColor
    this.isMe = isMe


    this.webGLLoop = new WebGLLoop({
      renderer: this.renderer,
      canvas
    })

    this.scene.rotateY((Math.PI / 180) * 0)
    this.pmremGenerator = new PMREMGenerator(this.renderer)
    this.pmremGenerator.compileEquirectangularShader()

    this.webGLLoop.scene = this.scene
    this.webGLLoop.camera = this.camera

    this.controls = createControls(this.camera, this.renderer.domElement)
    this.controls.enabled = true

    const { hemisphereLight, ambientLight, mainLight } = createLights()
    this.scene.add(hemisphereLight)
    this.camera.add(ambientLight, mainLight)

    this.scene.add(this.camera)

    this.webGLLoop.updatables.push(this.controls)

    this.resize()
  }

  getCubeMapTexture(path: any): Promise<Texture | null> {
    // no envmap
    if (!path) return Promise.resolve(null)

    return new Promise((resolve, reject) => {
      new RGBELoader().load(
        path,
        texture => {
          const envMap = this.pmremGenerator.fromEquirectangular(texture).texture
          this.pmremGenerator.dispose()

          resolve(envMap)
        },
        undefined,
        reject
      )
    })
  }

  updateEnvironment() {
    this.getCubeMapTexture('../venice_sunset_1k.hdr').then(envMap => {
      this.scene.environment = envMap
      this.scene.background = envMap
    })
  }

  async init() {
    const model = await loadModel()

    this.setUpRPM(model)
  }

  setUpRPM(model: Group) {
    // console.log('seting up emoji...')

    this.camera.position.x = 0
    this.camera.position.z = 0.6
    this.camera.position.y = 0

    this.controls.target.copy(model.position)
    
    this.head = model
    this.head.position.y = Y_OFFSET
    
    this.avatarRoot = model.children.filter(child => child.name === "AvatarRoot")[0]
    this.wolf3D_Avatar = this.avatarRoot.children.filter(child => child.name === "Wolf3D_Avatar")[0] as any
    this.hips = this.avatarRoot.children.filter(child => child.name === "Hips")[0] as any
    
    this.updateEnvironment()
    this.scene.add(this.head)
  }

  updateMorphTargets(targets: ActionUnits) {
    for (const key in targets) {
      let value = targets[key]
      const morphTargetInfluencesIndex = this.wolf3D_Avatar.morphTargetDictionary[key]
      this.wolf3D_Avatar.morphTargetInfluences[morphTargetInfluencesIndex] = value
    }
  }

  async initWithRPM() {
    return loadModel().then(rpm => this.setUpRPM(rpm))
  }


  updateHeadRotation(pitch: number, yaw: number, roll: number) {
    if (!this.head) return

    // this.head.rotation.x = pitch

    // // Inverse yaw & roll effects for yourself to give mirror effect
    // this.head.rotation.y = this.isMe ? -yaw : yaw
    // this.head.rotation.z = this.isMe ? roll : -roll
  }

  updatePosition(x: number, y: number, z: number) {
    // this.head.position.x = x
    // this.head.position.y = Y_OFFSET + y
    // this.head.position.z = z
  }

  start() {
    this.webGLLoop.start()
  }

  stop() {
    this.webGLLoop.stop()
  }

  cleanUp() {
    this.setAvatarEnabled(false)
    this.head = null
  }

  setAvatarEnabled(enabled: boolean) {
    if (enabled) {
      this.scene.add(this.head)
    } else {
      this.scene.remove(this.head)
    }
  }

  resize() {
    if (!this.camera) return

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(1280, 720)
  }
}
