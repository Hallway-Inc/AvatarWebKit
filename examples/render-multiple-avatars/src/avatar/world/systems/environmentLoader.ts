import { PMREMGenerator, Texture, WebGLRenderer } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export class EnvironmentLoader {
  private pmremGenerator: PMREMGenerator

  constructor(renderer: WebGLRenderer) {
    this.pmremGenerator = new PMREMGenerator(renderer)
    this.pmremGenerator.compileEquirectangularShader()
  }

  load(url: string): Promise<Texture | null> {
    // no envmap
    if (!url) return Promise.resolve(null)

    return new Promise((resolve, reject) => {
      new RGBELoader().load(
        url,
        texture => {
          const envMap = this.pmremGenerator.fromEquirectangular(texture).texture
          this.pmremGenerator.dispose()

          resolve(envMap)
        },
        undefined,
        reject
      )
    })
  }
}