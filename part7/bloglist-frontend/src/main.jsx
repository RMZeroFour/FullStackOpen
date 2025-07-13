import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App.jsx';

const appRoot = createRoot(document.getElementById('root'));
appRoot.render(
  <Provider store={store}>
    <App />
  </Provider>
);
