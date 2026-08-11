import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root.jsx";
import "./styles/global.css";

const rootElement = typeof document !== "undefined"
  ? document.getElementById("root")
  : null;

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
}