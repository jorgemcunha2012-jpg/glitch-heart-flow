import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Prevent iOS auto-zoom on input focus by ensuring viewport max-scale
const viewportMeta = document.querySelector('meta[name="viewport"]');
if (viewportMeta) {
  viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

// Prevent pinch-to-zoom
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

createRoot(document.getElementById("root")!).render(<App />);
