// Lightweight in-memory mock API for projects and node statuses.
// Use this during local development. Replace calls with real axios requests
// when you have a backend available.

export type NodeState = "green" | "yellow" | "orange" | "red";

export type NodeDto = {
  id: string;
  label: string;
  metadata?: {
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    state?: NodeState;
    [k: string]: any;
  };
};

export type EdgeDto = { source: string; target: string };

export type ProjectDto = {
  id: string;
  name: string;
  tenantId: string;
  nodes: NodeDto[];
  edges: EdgeDto[];
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Simple demo dataset including position, size and initial state
const mockProjects: Record<string, ProjectDto> = {
  "demo-1": {
    id: "demo-1",
    name: "New Feature Adoption",
    tenantId: "tenant-a",
    nodes: [
      {
        id: "A",
        label: "System A",
        metadata: { position: { x: 40, y: 60 }, size: { width: 160, height: 48 }, state: "green" }
      },
      {
        id: "B1",
        label: "System B1",
        metadata: { position: { x: 300, y: 30 }, size: { width: 160, height: 48 }, state: "yellow" }
      },
      {
        id: "B2",
        label: "System B2",
        metadata: { position: { x: 300, y: 140 }, size: { width: 160, height: 48 }, state: "orange" }
      },
      {
        id: "C",
        label: "System C",
        metadata: { position: { x: 560, y: 90 }, size: { width: 160, height: 48 }, state: "red" }
      }
    ],
    edges: [
      { source: "A", target: "B1" },
      { source: "A", target: "B2" },
      { source: "B1", target: "C" },
      { source: "B2", target: "C" }
    ]
  }
};

// Public API surface

export async function getProject(projectId: string): Promise<ProjectDto> {
  // Simulate network latency
  await delay(250);
  const p = mockProjects[projectId];
  if (!p) {
    // For demo, return demo-1 if not found
    return mockProjects["demo-1"];
  }
  // Return a deep clone to avoid accidental mutation
  return JSON.parse(JSON.stringify(p)) as ProjectDto;
}

/**
 * Return a map of id -> state. Useful for GraphView.fetchStates.
 * If a node doesn't exist in the dataset it's assumed "green".
 */
export async function getNodeStatuses(ids: string[]): Promise<Record<string, NodeState>> {
  await delay(150);
  const result: Record<string, NodeState> = {};
  ids.forEach((id) => {
    // Find state from any project that contains the node (simple approach)
    for (const p of Object.values(mockProjects)) {
      const node = p.nodes.find((n) => n.id === id);
      if (node && node.metadata && node.metadata.state) {
        result[id] = node.metadata.state as NodeState;
        return;
      }
    }
    // default
    result[id] = "green";
  });
  return result;
}

/**
 * Persist project to the in-memory store (demo only).
 * Returns the saved project.
 */
export async function saveProject(project: ProjectDto): Promise<ProjectDto> {
  await delay(200);
  mockProjects[project.id] = JSON.parse(JSON.stringify(project));
  return mockProjects[project.id];
}
