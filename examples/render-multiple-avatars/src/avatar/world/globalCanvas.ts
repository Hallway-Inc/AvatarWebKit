/**
 * Creates a shared canvas across the entire screen that is rendered at a Z-depth below
 * everything else in the document body.
 * 
 * This allows us to share one rendering context between multiple avatars. This is useful for 
 * applications such as a video calls where you want to show multiple distinct "scenes",
 * all rendered client-side.
 */
export const tileGlobalCanvasId = 'hallway-tile-global-canvas'

export const createGlobalCanvas = (zIndex: number = 0, prependToBody: boolean = true): HTMLCanvasElement => {
  const oldCanvas = document.getElementById(tileGlobalCanvasId)
  if (oldCanvas) {
    oldCanvas.remove()
  }

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.setAttribute('id', 'hallway-tile-global-canvas')
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.zIndex = `${zIndex}`

  if (prependToBody) {
    document.body.prepend(canvas)
  }

  return canvas
}

export const isGlobalCanvas = (canvas: HTMLCanvasElement) => canvas.id === tileGlobalCanvasId