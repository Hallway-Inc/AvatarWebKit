import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

async function loadHeadphones() {
  const loader = new GLTFLoader()
  const [headphoneData] = await Promise.all([loader.loadAsync('../headphones_2.glb')])

  const headphones = headphoneData.scene
  return headphones
}

export { loadHeadphones }
