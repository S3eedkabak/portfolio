import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./styles.css";
import "./system-fixes.css";
import "./mobile.css";
import "./theme/tokens.css";
import "./scenes.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user"><ThemeProvider><App /></ThemeProvider></MotionConfig>
  </React.StrictMode>,
);
