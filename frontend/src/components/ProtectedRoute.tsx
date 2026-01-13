import React from "react";

/**
 * ProtectedRoute is a no-op while AAD is disabled.
 * When enabling AAD, uncomment the MSAL-based logic below to redirect unauthenticated users.
 */

// MSAL-based protection (commented out for now)
// import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "../authConfig";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  // MSAL usage (commented):
  // const { instance, accounts } = useMsal();
  // const isAuthenticated = accounts && accounts.length > 0;
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     instance.loginRedirect(loginRequest).catch(() => console.warn("loginRedirect failed"));
  //   }
  // }, [isAuthenticated, instance]);
  //
  // if (!isAuthenticated) return <div>Redirecting to sign-in…</div>;

  // For now, always render children. Replace with MSAL logic above when enabling AAD.
  return children;
}
