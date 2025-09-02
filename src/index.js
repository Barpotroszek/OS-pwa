import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// TODO: make it work again xd
import init from "./setup.ts"

// // import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// // import reportWebVitals from './reportWebVitals';

init()
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
