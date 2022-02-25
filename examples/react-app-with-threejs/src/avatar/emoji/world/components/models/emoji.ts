import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

async function loadEmoji() {
  const loader = new GLTFLoader()

  const [emojiData] = await Promise.all([loader.loadAsync('../Smiley_eye.glb')])

  const emoji = emojiData.scene
  emoji.position.set(0, 0, 0)

  return emoji
}

export { loadEmoji }
