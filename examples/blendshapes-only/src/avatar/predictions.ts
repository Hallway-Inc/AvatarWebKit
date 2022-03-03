import { AUPredictor, AvatarPrediction } from '@quarkworks-inc/avatar-webkit'

export class AvatarPredictions {
  videoStream?: MediaStream
  predictor?: AUPredictor
  
  async start() {
    this.videoStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 360 },
        facingMode: 'user'
      }
    })

    this.predictor = new AUPredictor({
      apiToken: process.env.REACT_APP_AVATAR_WEBKIT_AUTH_TOKEN!,
      srcVideoStream: this.videoStream
    })

    this.predictor.onPredict = ((results: AvatarPrediction) => {
      console.log(results)
    })

    return this.predictor.start()
  }

  async stop() {
    return this.predictor?.stop()
  }
}