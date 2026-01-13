import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import MissionList from "./pages/MissionList";
import MissionDetail from "./pages/MissionDetail";

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <header style={{ marginBottom: 16 }}>
        <h1>MissionManager</h1>
        <nav>
          <Link to="/missions">Missions</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/missions" element={<MissionList />} />
        <Route path="/missions/:missionId" element={<MissionDetail />} />
        <Route path="*" element={<Navigate to="/missions" replace />} />
      </Routes>
    </div>
  );
}
