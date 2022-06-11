import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './model';
import App from './app';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
      <App />
  </Provider>,
);
