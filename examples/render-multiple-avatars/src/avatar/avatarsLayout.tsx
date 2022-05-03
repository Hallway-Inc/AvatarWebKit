import React from 'react'

// eslint-disable-next-line
import { AUPredictor, AvatarPrediction } from '@quarkworks-inc/avatar-webkit'

import { Loader } from './components/loader'
import { Switch } from './components/switch'
import { MenuSelect } from './components/menuSelect'
import { RenderLoop } from './world/renderLoop'
import { EnvironmentLoader } from './world/systems/environmentLoader'
import { AvatarWorld } from './world/world'

import styles from './avatarsLayout.module.scss'
import { createGlobalCanvas } from './world/globalCanvas'
import { modelFactory, ModelType } from './world/models'

const CAMERA_WIDTH = 640
const CAMERA_HEIGHT = 360

const AVATAR_WIDTH = 1280
const AVATAR_HEIGHT = 720

type ComponentState = 'loading' | 'running' | 'paused'

type Props = {}
type State = {
  flipped: boolean
  avatarState: ComponentState
  videoInDevices: MediaDeviceInfo[]
  selectedVideoInDeviceId?: string
}

class AvatarsLayout extends React.Component<Props, State> {
  private renderLoop: RenderLoop
  private environmentLoader: EnvironmentLoader
  private world?: AvatarWorld

  private predictor!: AUPredictor

  private node: HTMLDivElement
  private videoRef = React.createRef<HTMLVideoElement>()
  private avatarContainerRef = React.createRef<HTMLDivElement>()

  // Extra avatars
  private avatar2 = React.createRef<HTMLDivElement>()
  private avatar3 = React.createRef<HTMLDivElement>()
  private avatar4 = React.createRef<HTMLDivElement>()

  // Extra worlds
  private world2?: AvatarWorld
  private world3?: AvatarWorld
  private world4?: AvatarWorld

  state: State = {
    flipped: true,
    avatarState: 'loading',
    videoInDevices: []
  }

  async componentDidMount() {
    this.predictor = new AUPredictor({
      apiToken: process.env.REACT_APP_AVATAR_WEBKIT_AUTH_TOKEN,
      shouldMirrorOutput: true
    })

    const videoInDevices = await this.fetchVideoDevices()
    const selectedVideoInDeviceId = videoInDevices[0]?.deviceId ?? undefined

    this.setState({ videoInDevices, selectedVideoInDeviceId })

    this.start()
  }

  componentWillUnmount() {
      this.stop()
  }

  async start() {
    this.setState({
      avatarState: 'loading'
    })

    const videoElement = this.videoRef.current
    videoElement.width = CAMERA_WIDTH
    videoElement.height = CAMERA_HEIGHT
    videoElement.srcObject = this.predictor.stream
    videoElement.play()

    this.predictor.dataStream.subscribe(this.updateScene.bind(this))

    await this._initWorlds()
    await this._startAvatar()
  }

  async stop() {
    this.renderLoop.stop()
    this.renderLoop.canvas.remove()
    this.predictor.stop()
    this.world = undefined
  }

  async _stopAvatar() {
    this.predictor.stop()
  }

  async _initWorlds() {
    if (this.world) return

    let avatarContainer = this.avatarContainerRef.current
    let avatarContainer2 = this.avatar2.current
    let avatarContainer3 = this.avatar3.current
    let avatarContainer4 = this.avatar4.current
  
    if (!avatarContainer || !avatarContainer2 || !avatarContainer3 || !avatarContainer4) return

    const canvas = createGlobalCanvas()

    this.renderLoop = new RenderLoop({ canvas })
    this.environmentLoader = new EnvironmentLoader(this.renderLoop.webGLRenderer)

    this.world = await this.initWorld(avatarContainer, 'mozilla', '../models/mozilla.glb')
    this.world2 = await this.initWorld(avatarContainer2, 'readyPlayerMe', '../models/hannah.glb')
    this.world3 = await this.initWorld(avatarContainer3, 'emoji')
    this.world4 = await this.initWorld(avatarContainer4, 'readyPlayerMe', '../models/kevin.glb')

    this.renderLoop.start()
  }

  async initWorld(container: HTMLElement, modelType: ModelType, url?: string): Promise<AvatarWorld> {
    const world = new AvatarWorld({
      container,
      environmentLoader: this.environmentLoader
    })

    const model = await modelFactory(modelType, url)
    await world.loadScene(model)

    this.renderLoop.updatables.push(world)
    this.renderLoop.renderables.push(world)

    return world
  }

  private async _startAvatar() {
    const { selectedVideoInDeviceId: deviceId } = this.state

    const constraints = {
      width: 640,
      height: 360,
      deviceId: deviceId ? { exact: deviceId } : undefined
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: constraints })

    await this.predictor.start({ stream })

    const videoElement = this.videoRef.current
    videoElement.srcObject = this.predictor.stream
    videoElement.play()

    // Update device list
    // We may have just asked for video permission for the first time
    const videoInDevices = await this.fetchVideoDevices()
    const selectedVideoInDeviceId = stream.getVideoTracks()[0].getSettings().deviceId

    this.setState({ videoInDevices, selectedVideoInDeviceId })
  }

  async _videoInChange(deviceId: string) {
    this.setState({
      selectedVideoInDeviceId: deviceId
    }, () => {
      this._startAvatar()
    })
  }

  async fetchVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices()

    const videoDevices = []
    devices.forEach(function (device) {
      if (device.kind === 'videoinput') {
        videoDevices.push(device)
      }
    })

    return videoDevices
  }

  updateScene(results: AvatarPrediction) {
    const { avatarState } = this.state
    
    // End loading state
    if (avatarState !== 'running' && avatarState !== 'paused') {
      this.setState({
        avatarState: 'running'
      })
    }

    this.world?.updateFromResults(results)
    this.world2?.updateFromResults(results)
    this.world3?.updateFromResults(results)
    this.world4?.updateFromResults(results)
  }

  handleToggle = () => {
    const newState = this.state.avatarState === 'running' ? 'paused' : 'running'

    newState === 'running' ? this._startAvatar() : this._stopAvatar()
    this.setState({
      avatarState: newState
    })
  }

  render() {
    const { avatarState, videoInDevices } = this.state

    return (
      <div
        className={styles.app}
        ref={n => {
          if (!this.node) {
            this.node = n
          }
        }}
      >
        <div className={styles.container}>
          <div className={styles.videoContainer}>
            <div
              ref={this.avatarContainerRef}
              style={{ width: AVATAR_WIDTH, height: AVATAR_HEIGHT }}
            />
            <video
              ref={this.videoRef}
              className={styles.video}
              style={{ transform: this.state.flipped ? 'scaleX(-1)' : '' }}
            />
            <div className={styles.buttonContainer}>
              <div className={styles.switchContainer}>
                <Switch
                  isOn={avatarState === 'running'}
                  onColor={'#4A57B9'}
                  handleToggle={() => {
                    this.handleToggle()
                  }}
                />
              </div>
              <div className={styles.deviceSelectContainer}>
                <MenuSelect
                  errorMessage="Unable to access video devices"
                  label=""
                  options={videoInDevices.map(device => ({ value: device.deviceId, label: device.label }))}
                  permission={true}
                  value={undefined}
                  onChange={this._videoInChange.bind(this)}
                />
              </div>
            </div>
          </div>
          {avatarState === 'loading' && (
            <div className={styles.loadingContainer}>
              <Loader width={80} height={80} subtext={'Loading...'} position={'relative'} />
            </div>
          )}

          <div className={styles.horizontalContainer}>
            <div className={styles.smallAvatar} ref={this.avatar2}></div>
            <div className={styles.smallAvatar} ref={this.avatar3}></div>
            <div className={styles.smallAvatar} ref={this.avatar4}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default AvatarsLayout
