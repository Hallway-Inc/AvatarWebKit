import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const subdomain = 'hallway'; // Replace with your custom subdomain
  const iFrameRef = useRef<HTMLIFrameElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [showIFrame, setShowIFrame] = useState<boolean>(false)

  useEffect(() => {
    let iFrame = iFrameRef.current
    if(iFrame) {
      iFrame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi` 
    }
  })

  useEffect(() => {
    window.addEventListener('message', subscribe)
    document.addEventListener('message', subscribe)
    
    return () => {
      window.removeEventListener('message', subscribe)
      document.removeEventListener('message', subscribe)
    }
  });
  
  function subscribe(event: any) {
    const json = parse(event)

    if (json?.source !== 'readyplayerme') {
      return;
    }

    // Susbribe to all events sent from Ready Player Me once frame is ready
    if (json.eventName === 'v1.frame.ready') {
      let iFrame = iFrameRef.current
      if(iFrame) {
        iFrame.contentWindow!.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**'
          }),
          '*'
        );
      }
    }

    // Get avatar GLB URL
    if (json.eventName === 'v1.avatar.exported') {
      console.log(`Avatar URL: ${json.data.url}`);
      setAvatarUrl(json.data.url)
      setShowIFrame(false);
    }

    // Get user id
    if (json.eventName === 'v1.user.set') {
      console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
    }
  }

  function parse(event: { data: string; }) {
    try {
      return JSON.parse(event.data);
    } catch (error) {
      return null;
    }
  }

  function toggleIframe() {
    setShowIFrame(!showIFrame);
  }
  
  return (
    <div className="App">
      <div className="topBar">
        <input
          className="toggleButton"
          onClick={() => toggleIframe()} 
          type="button"
          value={`${showIFrame ? 'Close': 'Open'} creator`}
        />
        <p id="avatarUrl">Avatar URL: {avatarUrl}</p>
      </div>
      <iframe
        allow="camera *; microphone *" 
        className="iFrame"
        id="frame"
        ref={iFrameRef}
        style={{
          display: `${showIFrame ? 'block': 'none'}`
        }}
        title={"Ready Player Me"}
      />        
    </div>
  );
}

export default App;
