import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import Router from '../routes/index';
import { store } from '../store';
import '@assets/styles/global.scss';
import 'antd/dist/antd.css';

const container = document.getElementById('root')!;

const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router />
  </Provider>
);
