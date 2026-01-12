import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type ProjectSummary = {
  id: string;
  name: string;
  tenantId: string;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);

  useEffect(() => {
    axios
      .get<ProjectSummary[]>("/api/projects")
      .then((r) => setProjects(r.data))
      .catch(() => {
        setProjects([{ id: "demo-1", name: "New Feature Adoption", tenantId: "tenant-a" }]);
      });
  }, []);

  if (!projects) return <div>Loading...</div>;

  return (
    <div>
      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${encodeURIComponent(p.id)}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
