# [![icon (1)](https://user-images.githubusercontent.com/17056600/165365600-c03a8560-1615-4308-ba46-d5df434e2dcc.png) joinhallway.com](https://joinhallway.com/)

# AvatarWebKit
Produces highly accurate animation blendshapes using machine learning given a video stream or image

https://user-images.githubusercontent.com/17056600/165352265-ce1be6bc-d0c3-408d-9611-c6a0f948096c.mov

# Getting Started

### What you’ll get from us:
To use Avatar WebKit you will receive an API Key. The API Key will be used for authentication when initializing the Avatar WebKit at runtime.

### Add your API key to your .env file

1. Add your key to your .env file

```REACT_APP_AVATAR_WEBKIT_AUTH_TOKEN=xxxxxxxx-XXXX-xxxx-XXXX-xxxxxxxxxxxx```

2. Next, add the Avatar WebKit module to your package.json:

```npm install @quarkworks-inc/avatar-webkit``` or ```yarn add @quarkworks-inc/avatar-webkit```


### Implementation

```
import { AUPredictor } from '@quarkworks-inc/avatar-webkit'
...

let predictor = new AUPredictor({
  apiToken: process.env.REACT_APP_AVATAR_WEBKIT_AUTH_TOKEN,
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

Now, give this a try! Once the predictor is started, it will take a little bit for the model to warm up. So be patient, if you don’t see any errors right off that is a good thing! You should start seeing the results in the log within at least 10-15 seconds at the most, usually faster.


# Get your API Key
1. Click the link below.
2. Fill out the form with your email.
3. We will send you your API key!

[![Screen Shot 2022-04-26 at 1 01 12 PM](https://user-images.githubusercontent.com/17056600/165363944-9270ffbc-8638-4362-87cc-dd488f6a417b.png)](https://docs.google.com/forms/d/e/1FAIpQLScR957DzGNW-m4SwoZLID_6ykAX9B2oFw0RSyMs2z-zlFeH9Q/viewform)

# Links to examples
- [Blendshapes Only](https://github.com/Hallway-Inc/AvatarWebKit/tree/main/examples/blendshapes-only)
- [React App With Three.js](https://github.com/Hallway-Inc/AvatarWebKit/tree/main/examples/react-app-with-threejs)
- [RPM Examples](https://github.com/Hallway-Inc/AvatarWebKit/tree/main/examples/ready-player-me-tutorials)
- [Multiple Avatars](https://github.com/Hallway-Inc/AvatarWebKit/tree/main/examples/render-multiple-avatars)
- [With Hallway Rendering Tools](https://github.com/Hallway-Inc/AvatarWebKit/tree/main/examples/hallway-rendering-tools)

# FAQ

### What does the Web SDK do?
The webSDK gives users real-time blendshapes and animation metadata given a video stream or image.

### API Key? What is that and why do I need it?
An API key is your unique identifier that will allow you to authenticate when using the SDK.

### I’ve added my API Key to my environment, but it’s not working.
Make sure there aren’t any hidden characters or that the key doesn’t have any typos. You may also need to restart your terminal / environment for the changes to take effect.

### What browsers are supported?
We recommend Chromium based browsers for best performance, but all other major browsers are supported.

### What’s the best place to reach out for support?
We are active daily on our [Discord](https://discord.gg/jYCHaMASz7) and can help with any problems you may have! If discord doesn’t work for you, reach out to [sdk@joinhallway.com](mailto:sdk@joinhallway.com)

# AvatarWebKit Rendering

If you are looking for some tools to help render things take a look at our rendering repository.

https://github.com/Hallway-Inc/AvatarWebKit-Rendering
