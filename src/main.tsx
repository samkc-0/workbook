import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@react-three/fiber";

import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallback={
        <div className="text-red-600 h-screen w-screen text-3xl flex items-center justify-center border-dashed border-red-400 border-4 bg-red-200">
          <span className="animate-pulse">🚨</span>Something went wrong!
          <span className="animate-pulse">🚨</span>
        </div>
      }
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
