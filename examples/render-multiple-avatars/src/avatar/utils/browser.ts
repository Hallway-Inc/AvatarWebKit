// Source: https://github.com/w-okada/image-analyze-workers/blob/728898121e5062fdfc639c99e8cf2d1e1935fd2e/002_facemesh-worker-js/src/BrowserUtil.ts

export enum BrowserType {
  'MSIE',
  'EDGE',
  'CHROME',
  'SAFARI',
  'FIREFOX',
  'OPERA',
  'BRAVE',
  'OTHER'
}

export const getBrowserType = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()

  // @ts-expect-error non-supported
  if (navigator?.brave) {
    return BrowserType.BRAVE
  } else if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
    return BrowserType.MSIE
  } else if (userAgent.indexOf('opera') !== -1 || userAgent.indexOf('opr') !== -1) {
    return BrowserType.OPERA
  } else if (userAgent.indexOf('edge') !== -1) {
    return BrowserType.EDGE
  } else if (userAgent.indexOf('chrome') !== -1) {
    return BrowserType.CHROME
  } else if (userAgent.indexOf('safari') !== -1) {
    return BrowserType.SAFARI
  } else if (userAgent.indexOf('firefox') !== -1) {
    return BrowserType.FIREFOX
  } else {
    return BrowserType.OTHER
  }
}

export const avatarsAvailable = () => {
  const types = [BrowserType.CHROME, BrowserType.OPERA, BrowserType.BRAVE, BrowserType.FIREFOX, BrowserType.SAFARI]

  return types.includes(getBrowserType())
}

export const gestureDetectionDefault = () => {
  const types = [BrowserType.CHROME, BrowserType.OPERA, BrowserType.BRAVE, BrowserType.FIREFOX, BrowserType.SAFARI]

  return types.includes(getBrowserType())
}
