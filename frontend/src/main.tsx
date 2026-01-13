import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

// MSAL integration is disabled for now until you provide a client ID.
// To enable MSAL later:
// 1) npm install @azure/msal-browser @azure/msal-react
// 2) add VITE_MSAL_CLIENT_ID and VITE_MSAL_AUTHORITY to frontend/.env
// 3) uncomment the imports and the provider block below.
// import { PublicClientApplication } from "@azure/msal-browser";
// import { MsalProvider } from "@azure/msal-react";
// import { msalConfig } from "./authConfig";

// const msalInstance = new PublicClientApplication(msalConfig);

console.log("DEBUG: main.tsx running — attempting to mount React app");

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* UNCOMMENT TO ENABLE MSAL PROVIDER */}
    {/* <MsalProvider instance={msalInstance}> */}
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
    {/* </MsalProvider> */}
  </React.StrictMode>
);
