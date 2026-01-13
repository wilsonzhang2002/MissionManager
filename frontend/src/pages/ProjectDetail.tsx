import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphView from "../components/GraphView";
import { getProject, getNodeStatuses, ProjectDto } from "../api/mockApi";

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!projectId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const p = await getProject(projectId);
        if (!mounted) return;
        setProject(p);
      } catch {
        // fallback: try demo project from mockApi
        try {
          const p = await getProject("demo-1");
          if (!mounted) return;
          setProject(p);
        } catch {
          // leave project as null
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>No project found.</div>;

  return (
    <div>
      <h2>{project.name}</h2>
      <p>Tenant: {project.tenantId}</p>

      {/* Pass fetchStates so GraphView uses the mock API for node states */}
      <GraphView
        nodes={project.nodes}
        edges={project.edges}
        fetchStates={(ids) => getNodeStatuses(ids)}
        onChange={async (nodes, edges) => {
          // Example: save updated model back to mock API
          await getProject(project.id); // ensure project exists in mock store
          await (async () => {
            // Merge into a project object and save
            const updated = { ...project, nodes, edges };
            // We call saveProject lazily via dynamic import to avoid circular deps in types
            const mod = await import("../api/mockApi");
            await mod.saveProject(updated);
            setProject(updated);
            // feedback
            // eslint-disable-next-line no-console
            console.log("Project saved to mock API:", updated);
          })();
        }}
      />
    </div>
  );
}
