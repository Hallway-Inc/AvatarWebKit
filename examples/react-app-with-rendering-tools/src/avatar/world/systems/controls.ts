import { PerspectiveCamera } from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Updateable } from '../renderLoop'

export class UpdateableControls extends OrbitControls implements Updateable {
  tick(_delta: number): void {
    this.update()
  }
}

export const createControls = (camera: PerspectiveCamera, domElement?: HTMLElement) => {
  const controls = new UpdateableControls(camera, domElement)

  controls.enableDamping = true
  //controls.enableRotate = true

  return controls
}
