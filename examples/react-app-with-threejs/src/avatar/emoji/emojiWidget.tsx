import React from 'react'

// eslint-disable-next-line
import { AUPredictor, AUPredictorConfig, AvatarPrediction } from '@quarkworks-inc/avatar-webkit'

import { EmojiWorld } from './world/world'

import styles from './emojiWidget.module.scss'
import { Loader } from './components/loader'
import { Switch } from './components/switch'
import { MenuSelect } from './components/menuSelect'

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
}

class EmojiWidget extends React.Component<Props, State> {
  private world?: EmojiWorld

  private predictor!: AUPredictor

  private node: HTMLDivElement
  private videoRef = React.createRef<HTMLVideoElement>()
  private canvas = React.createRef<HTMLCanvasElement>()

  state: State = {
    flipped: true,
    avatarState: 'loading',
    videoInDevices: []
  }

  async componentDidMount() {
    const videoDevices = await this.fetchVideoDevices()

    const deviceId = videoDevices[0]?.deviceId ?? undefined

    const constraints = {
      width: 640,
      height: 360,
      deviceId: deviceId ? { exact: deviceId } : undefined
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: constraints })

    this.predictor = new AUPredictor({
      apiToken: process.env.REACT_APP_AVATAR_WEBKIT_AUTH_TOKEN,
      mediaStream: stream,
      videoReversed: true
    } as AUPredictorConfig)

    this.setState({  videoInDevices: videoDevices })

    this.start()
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

    await this.initWorld()
    this.setState({
      videoInDevices: await this.fetchVideoDevices()
    })
  }

  async initWorld() {
    if (this.world) return

    let canvas = this.canvas.current
    if (!canvas) return

    this.world = new EmojiWorld({ canvas, isMe: true })

    await this.world.initWithEmoji()
    await this.world.addHeadphones()
    this.world.start()

    await this.predictor.start()
  }

  async _videoInChange(value: string) {
    console.log(value)

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Browser API navigator.mediaDevices.getUserMedia not available')
    }

    const constraints = {
      width: 640,
      height: 360,
      deviceId: value ? { exact: value } : undefined
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: constraints })

    await this.predictor.setStream(stream)

    const videoElement = this.videoRef.current
    videoElement.srcObject = this.predictor.stream
    videoElement.play()
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

    if (this.world) {
      this.world.updateMorphTargets(results.actionUnits)
      this.world.updateHeadRotation(-results.rotation.pitch, -results.rotation.yaw, -results.rotation.roll)
      this.world.updatePosition(results.transform.x, results.transform.y, results.transform.z)
    }
  }

  handleToggle = () => {
    const newState = this.state.avatarState === 'running' ? 'paused' : 'running'

    newState === 'running' ? this.predictor.start() : this.predictor.stop()
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
              className={styles.emoji}
              ref={this.canvas}
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
      </div>
    )
  }
}

export default EmojiWidget
