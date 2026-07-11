import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 应用入口：挂载根组件
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
