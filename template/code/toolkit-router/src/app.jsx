import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Routes from './routes';
import {
  increment, decrement, unshiftItem, shiftItem,
} from './model/actions';

import reactImg from './images/react-img.svg';
import './global-css/main.scss';

function App() {
  const dispatch = useDispatch();
  const { count, title } = useSelector((state) => state.counter);
  const testArr = useSelector((state) => state.testArr);
  return (
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
      <div styleName="redux-box">
        <div styleName="title">
          {
              title
          }
        </div>
        <input
          type="button"
          value="+"
          onClick={() => {
            dispatch(increment());
            dispatch(unshiftItem());
          }}
        />
        <span>{count}</span>
        <input
          type="button"
          value="-"
          onClick={() => {
            dispatch(decrement());
            dispatch(shiftItem());
          }}
        />
        <div styleName="array-box">
          {
              testArr.map((item) => <li key={item}>{item}</li>)
          }
        </div>
      </div>
    </div>
  );
}

export default App;
