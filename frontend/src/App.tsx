import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import MissionList from "./pages/MissionList";
import MissionDetail from "./pages/MissionDetail";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Temporary local-auth fallback:
 * - Provides a demo Login button that toggles a local authenticated state.
 * - Replace with the MSAL logic (commented) when you have an AAD client ID.
 */
export default function App() {
  // Local demo auth state (safe default while AAD not configured)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Demo User");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Example handlers for demo auth
  const handleLogin = async () => {
    // Replace this with instance.loginPopup / loginRedirect when enabling MSAL
    setIsLoggedIn(true);
    setUsername("Demo User");
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setMenuOpen(false);
  };

  // Close menu on outside click or Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      {/* Top banner with actions on left and user menu on right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0f172a",
          color: "white",
          padding: "8px 12px",
          borderRadius: 6,
          marginBottom: 12
        }}
        role="banner"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/missions" style={{ color: "white", textDecoration: "none", fontWeight: 600 }}>
            Home
          </Link>
          <Link to="/insights" style={{ color: "white", textDecoration: "none", fontWeight: 600 }}>
            Insights
          </Link>
        </div>

        <div ref={menuRef} style={{ position: "relative" }}>
          {/* Local fallback: show authenticated menu or login button */}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="User menu"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "transparent",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#1f2937",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12
                  }}
                  aria-hidden
                >
                  {username ? username.split(" ").map((s) => s[0]).slice(0, 2).join("") : "U"}
                </span>
                <span>{username}</span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="User menu"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "white",
                    color: "#111827",
                    borderRadius: 6,
                    boxShadow: "0 6px 18px rgba(15,23,42,0.2)",
                    minWidth: 200,
                    zIndex: 1000,
                    padding: 8
                  }}
                >
                  <div style={{ padding: "8px 12px", fontSize: 13 }}>
                    <div style={{ fontWeight: 700 }}>{username}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>demo@example.com</div>
                  </div>

                  <div style={{ height: 1, background: "#eef2f7", margin: "8px 0" }} />

                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      // placeholder: navigate to profile page or open modal
                      // eslint-disable-next-line no-console
                      console.log("Open profile");
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px 12px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Profile
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px 12px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#b91c1c",
                      fontWeight: 600
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleLogin}
              aria-label="Login"
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Login
            </button>
          )}

          {/* MSAL-based templates (commented). To re-enable, uncomment and remove the local fallback above.
              <AuthenticatedTemplate>...</AuthenticatedTemplate>
              <UnauthenticatedTemplate>...</UnauthenticatedTemplate>
          */}
        </div>
      </div>

      <header style={{ marginBottom: 16 }}>
        <h1>MissionManager</h1>
        <nav>
          <Link to="/missions">Missions</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/missions" element={<MissionList />} />
        <Route
          path="/missions/:missionId"
          element={
            <ProtectedRoute>
              <MissionDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/missions" replace />} />
      </Routes>
    </div>
  );
}
