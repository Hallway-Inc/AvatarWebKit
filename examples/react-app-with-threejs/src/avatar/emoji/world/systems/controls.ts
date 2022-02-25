import { PerspectiveCamera } from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { TickUpdateable } from './loop'

export class UpdateableControls extends OrbitControls implements TickUpdateable {
  tick(_delta: number): void {
    throw new Error('Method not implemented.')
  }

  test() {
    this.update()
  }
}

export const createControls = (camera: PerspectiveCamera, canvas: HTMLCanvasElement) => {
  const controls = new UpdateableControls(camera, canvas)

  controls.enableDamping = true
  //controls.enableRotate = true

  // for each frame tick, tell controls to update
  controls.tick = () => controls.test()

  return controls
}
