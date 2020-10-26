import React from 'react';
import { Provider } from 'react-redux';
import Stage from "./components/Stage/Stage";
import {store} from "./lib/store/reducers";
import './App.css';
import './styling/base-style.sass';

function App() {
  return (
    <Provider store={store}>
      <Stage/>
    </Provider>
  );

}

export default App;
