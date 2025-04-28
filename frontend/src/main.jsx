import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "@/index.css";
import { setupAxiosInterceptors } from "@/lib/axiosInterceptors";

setupAxiosInterceptors(); 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
