<p align="center">
  <img width="33%" height="auto" src="docs/assets/tryMe.gif">
  <h1 align="center">
    AvatarWebKit by Hallway
  </h1>
</p>

AvatarWebKit is an SDK developed by <a href="https://joinhallway.com" target="_blank" rel="noopener noreferrer">Hallway</a> optimized for the web that provides real-time blend shapes from a camera feed, video or image. The SDK also gives head XY position, depth (Z) and rotation (pitch, roll, yaw) for each frame. AvatarWebKit runs at 60 FPS, and provides ARKit-compatible 52 blend shapes.

In the future, the SDK will be able to provide rigid body frame and hand positions as well.

<p align="center">
  <img width="66%" height="auto" src="docs/assets/demo.gif">
</p>

Hallway drives their avatar technology using Machine Learning models that predict highly accurate blend shapes from images & video feeds in real-time. The ML pipeline is optimized for real-time video to achieve both high framerate and lifelike animations.

Our vision for the future is an "open metaverse" where you can take your character with you anywhere. We believe tools like AvatarWebKit can help pave that road. The models we've provided here are available to use in your applications for free. [Contact us](#contact-us) to get in touch about making your characters compatible with Hallway!

## Installation

```bash
# yarn
yarn add @quarkworks-inc/avatar-webkit

# npm
npm install @quarkworks-inc/avatar-webkit
```

## First Steps

1. [Get an API token](https://joinhallway.com/sdk/)

2. Start your predictor

```ts
import { AUPredictor } from '@quarkworks-inc/avatar-webkit'
// ...

let predictor = new AUPredictor({
  apiToken: <YOUR_API_TOKEN>,
  shouldMirrorOutput: true,
})

let stream = await navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    width: { ideal: 640 },
    height: { ideal: 360 },
    facingMode: 'user'
  }
})

predictor.onPredict = (results => {
  console.log(results)
})

// or if you like RX
predictor.dataStream.subscribe(results => {
  console.log(results)
})

predictor.start({ stream })
```

# More Docs

https://docs.google.com/document/d/16c3qSYvMi_5l2zXdrsykb2xH6XneOqxTd2wwnEVawxY/edit#


# Example Projects

### Using AvatarWebKit
- [Basic example running predictor w/o rendering](examples/blendshapes-only)
- [Predictor + React + Three.js (basic)](examples/react-app-with-threejs)
- [Video Call Style UI](examples/render-multiple-avatars)
- [Using our rendering kit module](examples/hallway-rendering-tools)

### Popular model integrations

- [ReadyPlayerMe Examples](examples/ready-player-me-tutorials)

# FAQ

### API Token? What is that and why do I need it?
An API key is your unique identifier that will allow you to authenticate when using the SDK. [You can sign up for one here.](https://joinhallway.com/sdk)

### What browsers are supported?
We recommend Chromium based browsers for best performance, but all other major browsers are supported. We are currently working on performance improvements for Safari, Firefox and Edge.

### Is mobile supported?
The models will currently run on mobile but need to be optimized. We are working on configuration options which will allow you to choose to run lighter models.

### Do you have any native SDKs?

We do not have an official SDK yet, but our ML pipeline is native-first and the models are used in our Mac OS app [Hallway Tile](https://joinhallway.com). We have the capability to create SDKs for most common platforms (macOS/Windows/Linux, iOS/Android). Each SDK will follow the same data standard for BlendShapes/predictions and will include encoders for portability between environments. This means you can do some creative things between native, web, etc.!

If you are interested in native SDKs, we'd love to hear from you!

### Is this production ready?

Yes, depending on your needs. There may be a couple rough edges at the moment, but the SDK has been in use internally at our company for over 1 year and in production with several pilot companies.

We are currently making no SLAs for the SDK, but we are happy to cooperate with you on any improvements you need to get it going in production. 

### Can I make feature requests?

YES!!! We are in an open beta currently and would love to hear your feedback. [Contact us](#contact-us) on Discord or by email.

### What’s the best place to reach out for support?

We are active daily on our  and can help with any problems you may have! If discord doesn’t work for you, reach out to 

# Contact Us

Our team is primarily in U.S. timezones, but we are pretty active on Discord and over email! We've love to hear your thoughts, feedback, ideas or provide any support you need.

[Discord](https://discord.gg/jYCHaMASz7)

[contact@joinhallway.com](mailto:contact@joinhallway.com)

[support@joinhallway.com](mailto:support@joinhallway.com)

# Other Hallway Tools

https://github.com/Hallway-Inc/AvatarWebKit-Rendering

If you are using three, we've released this open source tooling module you can import freely. This pairs especially well with video-call style apps, as we provide a three world setup that works well for rendering multiple avatars on screen at once Zoom-style.

[TODO] More coming :)