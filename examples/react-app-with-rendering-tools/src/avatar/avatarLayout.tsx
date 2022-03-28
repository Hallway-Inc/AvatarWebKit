import React from 'react'

// eslint-disable-next-line
import { AUPredictor, AvatarPrediction } from '@quarkworks-inc/avatar-webkit'
import { AvatarWorld, EnvironmentLoader, RenderLoop, modelFactory } from '@quarkworks-inc/avatar-webkit-rendering'
import { Color, SketchPicker } from 'react-color'

import { Loader } from './components/loader'
import { Switch } from './components/switch'
import { MenuSelect } from './components/menuSelect'

import styles from './avatarLayout.module.scss'
import { Splotch } from './components/splotch'
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
  emojiColor: Color
}

class AvatarLayout extends React.Component<Props, State> {
  private renderLoop: RenderLoop
  private environmentLoader: EnvironmentLoader
  private world?: AvatarWorld

  private predictor!: AUPredictor

  private node: HTMLDivElement
  private videoRef = React.createRef<HTMLVideoElement>()
  private avatarCanvas = React.createRef<HTMLCanvasElement>()

  state: State = {
    flipped: true,
    avatarState: 'loading',
    videoInDevices: [],
    emojiColor: '#00ff00'
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

  componentWillUnmount(): void {
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

  async _initWorlds() {
    if (this.world) return

    let avatarCanvas = this.avatarCanvas.current
    if (!avatarCanvas) return

    this.renderLoop = new RenderLoop({ canvas: avatarCanvas })
    this.environmentLoader = new EnvironmentLoader(this.renderLoop.webGLRenderer)

    this.world = new AvatarWorld({
      container: avatarCanvas,
      environmentLoader: this.environmentLoader
    })
  
    const model = await modelFactory('emoji')
    await this.world.loadScene(model)

    this.renderLoop.updatables.push(this.world)
    this.renderLoop.renderables.push(this.world)

    this.renderLoop.start()
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

  private async _stopAvatar() {
    this.predictor.stop()
  }

  _videoInChange(deviceId: string) {
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
            <canvas
              ref={this.avatarCanvas}
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
        </div>

        <Splotch id={"emoji_Face Color"} label="Face Color" color={this.state.emojiColor} onChangeComplete={color => this.setState({ emojiColor: color })}/>
      </div>
    )
  }
}

export default AvatarLayout
