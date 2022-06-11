import * as React from 'react';
import reactImg from './images/react-img.svg';
import './global-css/main.scss';

const App:React.FC = () => (
  <div styleName="app">
    <div styleName="img-box">
      <img src={reactImg} alt="" />
    </div>
    <div styleName="intro">
      React Project
    </div>
  </div>
);

export default App;
