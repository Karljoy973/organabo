import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./style.css";

import { App } from "./app/App.tsx";
import { store } from "./app/store.ts";

const container = document.getElementById("app");
if (!(container instanceof HTMLDivElement)) {
  throw new Error("Missing #app element in the page");
}

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
