import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";
import App from "./app/App.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./app/app.store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
