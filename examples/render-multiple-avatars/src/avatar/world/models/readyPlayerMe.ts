import { AvatarPrediction, BlendShapeKeys, BlendShapes } from "@quarkworks-inc/avatar-webkit"
import { Group, Object3D, Scene, SkinnedMesh } from "three"
import { Model, ModelType, object3DChildNamed, setMorphTarget } from "."
import { loadModel } from "../systems/loadModel"

const Y_OFFSET = -0.55

export class ReadyPlayerMeModel implements Model {
  readonly type: ModelType = 'readyPlayerMe'
  
  // Model group
  private model: Group
  private avatarRoot: Object3D

  // Nodes for current RPM version
  private faceNode?: SkinnedMesh
  private teethNode?: SkinnedMesh

  // Nodes for old RPM versions
  private wolf3D_Avatar?: SkinnedMesh
  
  static async init(url: string): Promise<ReadyPlayerMeModel> {
    const model = new ReadyPlayerMeModel()
    return model.load(url)
  }

  private constructor() {}

  private async load(url: string): Promise<ReadyPlayerMeModel> {
    this.model = await loadModel(url)

    this.model.position.y = Y_OFFSET
    
    this.avatarRoot = object3DChildNamed(this.model, "AvatarRoot")

    this.faceNode = object3DChildNamed(this.avatarRoot, "Wolf3D_Head") as SkinnedMesh
    this.teethNode = object3DChildNamed(this.avatarRoot, "Wolf3D_Teeth") as SkinnedMesh

    this.wolf3D_Avatar = object3DChildNamed(this.avatarRoot, "Wolf3D_Avatar") as SkinnedMesh

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

    this.updateBlendShapes(results.blendShapes)
    this.updateHeadRotation(-results.rotation.pitch, -results.rotation.yaw, -results.rotation.roll)
    this.updatePosition(results.transform.x, results.transform.y, results.transform.z)
  }

  private updateBlendShapes(blendShapes: BlendShapes) {
    for (const key in blendShapes) {
      const value = blendShapes[key]

      const arKitKey = BlendShapeKeys.toARKitConvention(key)

      setMorphTarget(this.faceNode, arKitKey, value)
      setMorphTarget(this.teethNode, arKitKey, value)
      setMorphTarget(this.wolf3D_Avatar, arKitKey, value)
    }
  }

  private updateHeadRotation(pitch: number, yaw: number, roll: number) {

    // this.head.rotation.x = pitch

    // // Inverse yaw & roll effects for yourself to give mirror effect
    // this.head.rotation.y = this.isMe ? -yaw : yaw
    // this.head.rotation.z = this.isMe ? roll : -roll
  }

  private updatePosition(x: number, y: number, z: number) {
    // this.head.position.x = x
    // this.head.position.y = Y_OFFSET + y
    // this.head.position.z = z
  }
}