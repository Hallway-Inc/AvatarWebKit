import { PerspectiveCamera } from 'three'

export const createCamera = (zoom = 3.75) => {
  const camera = new PerspectiveCamera(50, 1, 0.1, 100)

  camera.position.set(0, 0, zoom)

  return camera
}
