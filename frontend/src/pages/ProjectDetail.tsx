import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphView from "../components/GraphView";
import axios from "axios";

type NodeDto = { id: string; label: string; metadata?: Record<string, any> };
type EdgeDto = { source: string; target: string };

type ProjectDto = {
    id: string;
    name: string;
    tenantId: string;
    nodes: NodeDto[];
    edges: EdgeDto[];
};

export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<ProjectDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) {
            setLoading(false);
            return;
        }

        axios
            .get<ProjectDto>(`/api/projects/${encodeURIComponent(projectId)}`)
            .then((r) => setProject(r.data))
            .catch(() => {
                // demo data fallback
                setProject({
                    id: "demo-1",
                    name: "New Feature Adoption",
                    tenantId: "tenant-a",
                    nodes: [
                        { id: "A", label: "System A" },
                        { id: "B1", label: "System B1" },
                        { id: "B2", label: "System B2" },
                        { id: "C", label: "System C" }
                    ],
                    edges: [
                        { source: "A", target: "B1" },
                        { source: "A", target: "B2" },
                        { source: "B1", target: "B2" },
                        { source: "B1", target: "C" },
                        { source: "B2", target: "C" }
                    ]
                });
            })
            .finally(() => setLoading(false));
    }, [projectId]);

    if (loading) return <div>Loading project...</div>;
    if (!project) return <div>No project found.</div>;

    return (
        <div>
            <h2>{project.name}</h2>
            <p>Tenant: {project.tenantId}</p>
            <GraphView nodes={project.nodes} edges={project.edges} />
        </div>
    );
}
