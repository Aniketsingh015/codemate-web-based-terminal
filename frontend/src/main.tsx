import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // global styles

// Grab the root element from index.html
const rootElement = document.getElementById("root") as HTMLElement;

// Create React root and render App
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);