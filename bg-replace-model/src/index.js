import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import App_2 from './App_2';
import App_3 from './App_3';
import App_4 from './App_4';
import reportWebVitals from './reportWebVitals';
import { num, alphabet, glob, numArray_04, numArray_59, numArray_09, numArray_Voc, numArray_AE, numArray_FJ, numArray_KO, numArray_PT, numArray_UZ, numArray_AZ, numArray_Glob } from './props';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  // <App model={num} array={numArray_09} ayuda={true} />
  <App model={alphabet} array={numArray_AZ} ayuda={true} />
  // <App model={glob} array={numArray_Glob} ayuda={true} />
  // <App_4 model={num} array={numArray_09} ayuda={true} />
  // <App_3 model={num} array={numArray_09} ayuda={true} />
  // <App_2 />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();