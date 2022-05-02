import { AUPredictor, AvatarCoder, AvatarPrediction } from '@quarkworks-inc/avatar-webkit'

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
      apiToken: process.env.REACT_APP_AVATAR_WEBKIT_AUTH_TOKEN!
    })

    this.predictor.onPredict = ((results: AvatarPrediction) => {
      console.log(results)
      this.test(results)
      this.predictor?.stop()
    })

    return this.predictor.start({
      stream: this.videoStream
    })
  }

  async stop() {
    return this.predictor?.stop()
  }

  test(results: AvatarPrediction) {
    let t0 = performance.now()
    const encoder = new TextEncoder()
    const decoder = new TextDecoder();

    for(let i = 0; i < 100000; i++) {
      let bleh = encoder.encode(JSON.stringify(results))
      let bleh2 = JSON.parse(decoder.decode(bleh))
    }
    console.log(performance.now() - t0);
  }

  test2(results: AvatarPrediction) {
    let t0 = performance.now()
    const avatarCoder = new AvatarCoder()


    for(let i = 0; i < 100000; i++) {
      const data = avatarCoder.encode(results);
      let prediction = avatarCoder.decode(data)
    }
    console.log(performance.now() - t0);
  }
}