import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@react-three/fiber";

import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={<div className="text-red-500">Something went wrong</div>}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
