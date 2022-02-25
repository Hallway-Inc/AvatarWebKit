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
  Texture
} from 'three'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// eslint-disable-next-line
import { ActionUnits } from '@quarkworks-inc/avatar-webkit'

import { emojiKeyMap } from '../utils/emojiKeyMap'

import { createCamera } from './components/camera'
import { loadEmoji } from './components/models/emoji'
import { loadHeadphones } from './components/models/headphones'
import { createLights } from './components/lights'
import { createScene } from './components/scene'
import { createControls, UpdateableControls } from './systems/controls'
import { WebGLLoop } from './systems/loop'
import { createRenderer } from './systems/renderer'

const sceneBackgroundColor = new Color(0xffffff)

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

  private headphones?: Group

  // Model mesh components
  private face!: Mesh
  private mouth!: Mesh
  private tongue!: Mesh
  private teeth!: Mesh
  private rightEye!: Mesh
  private leftEye!: Mesh

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
    const emoji = await loadEmoji()

    this.setUpEmoji(emoji)
  }

  setUpEmoji(model: Group) {
    // console.log('seting up emoji...')

    this.camera.position.x = 0
    this.camera.position.z = 1
    this.camera.position.y = 0

    this.controls.target.copy(model.position)

    this.head = model

    this.leftEye = this.head.children[0] as Mesh
    this.rightEye = this.head.children[1] as Mesh
    const smileyGroup = this.head.children[2]

    this.face = smileyGroup.children[0] as Mesh
    this.mouth = smileyGroup.children[1] as Mesh
    this.tongue = smileyGroup.children[2] as Mesh
    this.teeth = smileyGroup.children[3] as Mesh

    if (this.face.material instanceof MeshStandardMaterial) {
      this.face.material.metalness = 0.1
      this.face.material.roughness = 0.5
      this.face.material.needsUpdate = true
    }

    this.updateEnvironment()
    this.scene.add(this.head)
  }

  setUpHeadphones(model: Group) {
    if (this.headphones === undefined) {
      this.headphones = model
      this.head.add(this.headphones)
    }
  }

  removeHeadphones() {
    if (this.headphones) {
      this.head.remove(this.headphones)
    }
  }

  updateMorphTargets(targets: ActionUnits) {
    if (!this.face) return

    for (const key in targets) {
      let value = targets[key]

      if (key === 'browDownLeft' || key === 'browDownRight') {
        value = Math.min(Math.max(value - 0.0, 0), 1)
      }

      // Morph index for emoji doesn't quite match up with ARKit keys
      const morphIndex = this.face.morphTargetDictionary[emojiKeyMap[key]]

      this.face.morphTargetInfluences[morphIndex] = value
      this.mouth.morphTargetInfluences[morphIndex] = value
      this.teeth.morphTargetInfluences[morphIndex] = value
      this.tongue.morphTargetInfluences[morphIndex] = value
    }

    const eulerRight = [
      targets.eyeLookDownLeft + -targets.eyeLookUpLeft,
      targets.eyeLookOutLeft + -targets.eyeLookInLeft,
      0.0
    ]
    const eulerLeft = [
      targets.eyeLookDownRight + -targets.eyeLookUpRight,
      -targets.eyeLookOutRight + targets.eyeLookInRight,
      0.0
    ]
    const maxAngle = (1 / 57.3) * 30

    this.rightEye.rotation.x = eulerRight[0] * maxAngle
    this.rightEye.rotation.y = eulerRight[1] * maxAngle
    this.rightEye.rotation.z = eulerRight[2] * maxAngle

    this.leftEye.rotation.x = eulerLeft[0] * maxAngle
    this.leftEye.rotation.y = eulerLeft[1] * maxAngle
    this.leftEye.rotation.z = eulerLeft[2] * maxAngle
  }

  async initWithEmoji() {
    return loadEmoji().then(emoji => this.setUpEmoji(emoji))
  }

  async addHeadphones() {
    return loadHeadphones().then(headphones => this.setUpHeadphones(headphones))
  }

  updateEyeGaze(value: number) {
    this.leftEye.rotation.y = -MathUtils.degToRad(value)
    this.rightEye.rotation.y = -MathUtils.degToRad(value)
  }

  updateHeadRotation(pitch: number, yaw: number, roll: number) {
    if (!this.head) return

    this.head.rotation.x = pitch

    // Inverse yaw & roll effects for yourself to give mirror effect
    this.head.rotation.y = this.isMe ? -yaw : yaw
    this.head.rotation.z = this.isMe ? roll : -roll
  }

  updatePosition(x: number, y: number, z: number) {
    this.head.position.x = x
    this.head.position.y = y
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
