import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRoutes } from "./routes";
import { QueryProvider } from "./providers/QueryProvider";
import "@/shared/styles/global.css";
import "@/shared/styles/editable.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  </StrictMode>
);
