import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@flash-ws/reductor';
import { StrictMode } from 'react';

import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
