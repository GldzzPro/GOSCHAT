import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "app/app";
import { ThemeProvider } from "./components/theme-provider/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
