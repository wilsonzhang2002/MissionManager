import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type MissionSummary = {
  id: string;
  name: string;
  tenantId?: string;
  tenantName?: string;
};

export default function MissionList() {
  const [missions, setMissions] = useState<MissionSummary[] | null>(null);

  useEffect(() => {
    axios
      .get<MissionSummary[]>("/api/missions")
      .then((r) => setMissions(r.data))
      .catch(() => {
        // fallback demo data
        setMissions([
          {
            id: "demo-1",
            name: "New Feature Adoption",
            tenantId: "tenant-a",
            tenantName: "Tenant A"
          }
        ]);
      });
  }, []);

  if (!missions) return <div>Loading...</div>;

  return (
    <div>
      <h2>Missions</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Mission ID</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Mission Name</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Tenant ID</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Tenant Name</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((m) => (
            <tr key={m.id}>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{m.id}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                <Link to={`/missions/${encodeURIComponent(m.id)}`}>{m.name}</Link>
              </td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{m.tenantId ?? "-"}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{m.tenantName ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
