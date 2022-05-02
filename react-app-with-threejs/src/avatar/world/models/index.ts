import { AvatarPrediction } from "@quarkworks-inc/avatar-webkit";
import { Mesh, Object3D, Scene, Vector3 } from "three";
import { EmojiModel } from "./emoji";
import { MozillaModel } from "./mozilla";
import { ReadyPlayerMeModel } from "./readyPlayerMe";

export interface Model {
  readonly type: ModelType
  addToScene(scene: Scene): void
  removeFromScene(scene: Scene): void
  getPosition(): Vector3
  updateFromResults(results: AvatarPrediction): void
}

export type ModelType = 'emoji' | 'readyPlayerMe' | 'mozilla'

export const modelFactory = (type: ModelType, url?: string): Promise<Model> => {
  switch (type) {
    case 'emoji': return EmojiModel.init()
    case 'readyPlayerMe': return ReadyPlayerMeModel.init(url)
    case 'mozilla': return MozillaModel.init(url)
    default: return Promise.reject(`Unknown model type: ${type}`)
  }
}

export const object3DChildNamed = (object: Object3D, name: string) => object.children.find((child) => child.name === name)

export const setMorphTarget = (mesh: Mesh | undefined, key: string, value: any) => {
  if (!mesh) return
  let idx = mesh.morphTargetDictionary[key]
  if (!idx) return
  mesh.morphTargetInfluences[idx] = value
}
