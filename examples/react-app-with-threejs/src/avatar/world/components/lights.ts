import { DirectionalLight, HemisphereLight, AmbientLight } from 'three'

function createLights() {
  const hemisphereLight = new HemisphereLight()
  const ambientLight = new AmbientLight(0xffffff, 0.1)

  const mainLight = new DirectionalLight(0xffffff, 0.2)
  mainLight.position.set(0.5, 0, 0.866)

  return { hemisphereLight, ambientLight, mainLight }
}

export { createLights }
