import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AvatarPredictions } from './avatar/predictions';

class App extends React.Component {

  private avatarPredictions = new AvatarPredictions()

  componentDidMount() {
    this.avatarPredictions.start()
      .then(() => console.log('Avatar predictions started'))
      .catch(err => console.error('Avatar predictions failed to start', err))
  }

  componentWillUnmount() {
    this.avatarPredictions.stop()
      .then(() => console.log('Avatar predictions stopped'))
      .catch(err => console.error('Avatar predictions failed to stop', err))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
