import React from 'react';
import './App.css';
import EmojiWidget from './avatar/emoji/emojiWidget';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <EmojiWidget />
      </div>
    )
  }
}

export default App;
