import * as React from 'react';
import { NavLink } from 'react-router-dom';
import Routes from './routes';
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
    <div styleName="link-box">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
    </div>
    <div styleName="route-box">
      <Routes />
    </div>
  </div>
);

export default App;
