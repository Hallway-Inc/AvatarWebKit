import { AvatarPrediction, ActionUnits } from "@quarkworks-inc/avatar-webkit";
import { Group, Scene, Mesh, MeshStandardMaterial, MathUtils } from "three";
import { Model, ModelType } from ".";
import { emojiKeyMap } from "../../utils/emojiKeyMap";
import { loadModel } from "../systems/loadModel";

const Y_OFFSET = -0.55

export class EmojiModel implements Model {
  readonly type: ModelType = 'emoji'
  
  // Groups
  private model: Group
  private headphones?: Group

  // Model mesh components
  private face: Mesh
  private mouth: Mesh
  private tongue: Mesh
  private teeth: Mesh
  private rightEye: Mesh
  private leftEye: Mesh

  // TODO: fix dis
  private isMe = true

  static async init(): Promise<EmojiModel> {
    const model = new EmojiModel()
    return model.load()
  }

  private constructor() {}

  private async load(): Promise<EmojiModel> {
    this.model = await loadModel('../models/Smiley_eye.glb')
    this.headphones = await loadModel('../models/headphones_2.glb')

    this.model.add(this.headphones)

    this.model.position.y = Y_OFFSET
    
    this.leftEye = this.model.children[0] as Mesh
    this.rightEye = this.model.children[1] as Mesh
    const smileyGroup = this.model.children[2]

    this.face = smileyGroup.children[0] as Mesh
    this.mouth = smileyGroup.children[1] as Mesh
    this.tongue = smileyGroup.children[2] as Mesh
    this.teeth = smileyGroup.children[3] as Mesh

    if (this.face.material instanceof MeshStandardMaterial) {
      this.face.material.metalness = 0.1
      this.face.material.roughness = 0.5
      this.face.material.needsUpdate = true
    }

    return this
  }
  
  addToScene(scene: Scene) {
    scene.add(this.model)
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.model)
  }

  getPosition = () => this.model.position

  updateFromResults(results: AvatarPrediction) {
    if (!this.model) return

    this.updateMorphTargets(results.actionUnits)
    this.updateHeadRotation(-results.rotation.pitch, -results.rotation.yaw, -results.rotation.roll)
    this.updatePosition(results.transform.x, results.transform.y, results.transform.z)
  }

  private updateMorphTargets(targets: ActionUnits) {
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

  updateEyeGaze(value: number) {
    this.leftEye.rotation.y = -MathUtils.degToRad(value)
    this.rightEye.rotation.y = -MathUtils.degToRad(value)
  }

  updateHeadRotation(pitch: number, yaw: number, roll: number) {
    if (!this.model) return

    this.model.rotation.x = pitch

    // Inverse yaw & roll effects for yourself to give mirror effect
    this.model.rotation.y = this.isMe ? -yaw : yaw
    this.model.rotation.z = this.isMe ? roll : -roll
  }

  updatePosition(x: number, y: number, z: number) {
    this.model.position.x = x
    this.model.position.y = y
    // this.head.position.z = z
  }
}