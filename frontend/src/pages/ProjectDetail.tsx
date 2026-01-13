import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphView from "../components/GraphView";
import { getProject, getNodeStatuses, saveProject, ProjectDto } from "../api/mockApi";

type NodeDto = { id: string; label: string; metadata?: Record<string, any> };
type EdgeDto = { source: string; target: string };

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(true);

  // latestModel captures model updates emitted by GraphView
  const [latestModel, setLatestModel] = useState<{ nodes: NodeDto[]; edges: EdgeDto[] } | null>(null);
  const [saving, setSaving] = useState(false);

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
        // seed latestModel so Save works before any edits
        setLatestModel({ nodes: p.nodes, edges: p.edges });
      } catch {
        try {
          const p = await getProject("demo-1");
          if (!mounted) return;
          setProject(p);
          setLatestModel({ nodes: p.nodes, edges: p.edges });
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const toSave = latestModel ?? { nodes: project.nodes, edges: project.edges };
      const updated: ProjectDto = { ...project, nodes: toSave.nodes, edges: toSave.edges };
      await saveProject(updated);
      setProject(updated);
      // eslint-disable-next-line no-console
      console.log("Project saved:", updated);
      alert("Project saved (mock)");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Save failed", err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>{project.name}</h2>
      <p>Tenant: {project.tenantId}</p>

      <div style={{ marginBottom: 8 }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save project"}
        </button>
      </div>

      <GraphView
        nodes={project.nodes}
        edges={project.edges}
        fetchStates={(ids) => getNodeStatuses(ids)}
        onModelChange={(nodes, edges) => setLatestModel({ nodes, edges })}
      />
    </div>
  );
}
