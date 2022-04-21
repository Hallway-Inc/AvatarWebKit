import { AvatarPrediction, BlendShapes } from "@quarkworks-inc/avatar-webkit";
import { Group, SkinnedMesh, Scene } from "three";
import { Model, ModelType, object3DChildNamed, setMorphTarget } from ".";
import { loadModel } from "../systems/loadModel";

const Y_OFFSET = -0.55

export class MozillaModel implements Model {
  readonly type: ModelType = 'mozilla'
  
  private model: Group
  private combinedMesh: SkinnedMesh

  static async init(url: string): Promise<MozillaModel> {
    const model = new MozillaModel()
    return model.load(url)
  }

  private constructor() {}

  private async load(url: string): Promise<MozillaModel> {
    this.model = await loadModel(url)

    this.model.position.y = Y_OFFSET
    
    const object = this.model.children[0]
    this.combinedMesh = object3DChildNamed(object, "CombinedMesh") as SkinnedMesh

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
    
    const blink = (blendShapes.eyeBlink_L + blendShapes.eyeBlink_R) / 2
    setMorphTarget(this.combinedMesh, 'Blink', blink)

    const eyeRotation = (blendShapes.browDown_L + blendShapes.browDown_R) / 2
    setMorphTarget(this.combinedMesh, 'Eye Rotation', eyeRotation)
    
    setMorphTarget(this.combinedMesh, 'MouthFlap', blendShapes.jawOpen)
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