import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Connection
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

type NodeDto = { id: string; label: string; metadata?: Record<string, any> };
type EdgeDto = { source: string; target: string };
type NodeState = "green" | "yellow" | "orange" | "red";

export default function GraphView(props: {
  nodes: NodeDto[];
  edges: EdgeDto[];
  /**
   * Called whenever the model (nodes or edges) changes.
   * Parent can use this to persist the current model (e.g. save button).
   */
  onModelChange?: (nodes: NodeDto[], edges: EdgeDto[]) => void;
  /**
   * Optional override to fetch node states. Should return a map of nodeId->state.
   * If not provided, component will POST to `/api/nodes/statuses` with body `{ ids: string[] }`
   * and expect a response `{ [id]: "green" | "yellow" | "orange" | "red" }`.
   */
  fetchStates?: (ids: string[]) => Promise<Record<string, NodeState | undefined>>;
}) {
  const stateColor = (s?: NodeState) => {
    switch (s) {
      case "yellow":
        return "#FFC107";
      case "orange":
        return "#FF9800";
      case "red":
        return "#F44336";
      case "green":
      default:
        return "#4CAF50";
    }
  };

  // Map incoming DTOs to React Flow nodes/edges, preserving persisted positions if present
  const initialRfNodes: Node[] = props.nodes.map((n, i) => ({
    id: n.id,
    data: { label: n.label },
    position:
      (n.metadata && (n.metadata.position as { x: number; y: number })) ??
      { x: i * 200, y: (i % 3) * 120 },
    style: {
      background: stateColor((n.metadata && (n.metadata.state as NodeState)) ?? "green"),
      color: "white",
      padding: 8,
      borderRadius: 4
    }
  }));

  const initialRfEdges: Edge[] = props.edges.map((e, i) => ({
    id: `e${i}`,
    source: e.source,
    target: e.target,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  }));

  // React Flow-managed state (keeps positions and edits)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialRfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialRfEdges);

  // Whenever local nodes/edges change, notify parent with DTO shape
  useEffect(() => {
    if (!props.onModelChange) return;
    const outNodes: NodeDto[] = nodes.map((n) => ({
      id: n.id,
      label: (n.data as any)?.label ?? n.id,
      metadata: { position: n.position, state: (n.data as any)?.state ?? "green" }
    }));
    const outEdges: EdgeDto[] = edges.map((e) => ({ source: e.source, target: e.target }));
    props.onModelChange(outNodes, outEdges);
  }, [nodes, edges, props]);

  // Fetch node states from backend (or use provided fetchStates) and apply styles
  useEffect(() => {
    let mounted = true;
    const ids = props.nodes.map((n) => n.id);

    const defaultFetcher = async (idsArg: string[]) => {
      try {
        const resp = await axios.post<Record<string, NodeState>>("/api/nodes/statuses", {
          ids: idsArg
        });
        return resp.data;
      } catch {
        return {};
      }
    };

    (async () => {
      const fetcher = props.fetchStates ?? defaultFetcher;
      try {
        const states = await fetcher(ids);

        if (!mounted) return;

        setNodes((nds) =>
          nds.map((node) => {
            const s = states[node.id] ?? "green";
            return {
              ...node,
              data: { ...(node.data as any), state: s },
              style: { ...(node.style ?? {}), background: stateColor(s), color: "white" }
            };
          })
        );
      } catch {
        // keep default green if fetch fails
      }
    })();

    return () => {
      mounted = false;
    };
  }, [props.nodes, props.fetchStates, setNodes]);

  // Keep local state in sync if parent props change (e.g., loading a different project)
  useEffect(() => {
    setNodes(
      props.nodes.map((n, i) => ({
        id: n.id,
        data: { label: n.label },
        position:
          (n.metadata && (n.metadata.position as { x: number; y: number })) ??
          { x: i * 200, y: (i % 3) * 120 },
        style: {
          background: stateColor((n.metadata && (n.metadata.state as NodeState)) ?? "green"),
          color: "white",
          padding: 8,
          borderRadius: 4
        }
      }))
    );

    setEdges(
      props.edges.map((e, i) => ({
        id: `e${i}`,
        source: e.source,
        target: e.target,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed }
      }))
    );
  }, [props.nodes, props.edges, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed }
          },
          eds
        )
      ),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    // placeholder: open node details or side panel
    alert(`Node clicked: ${node.id}`);
  }, []);

  // Add a new node (simple example). Caller can persist via parent Save button.
  const addNewNode = useCallback(() => {
    const id = `node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        data: { label: "New Node", state: "green" as NodeState },
        position: { x: 100 + nds.length * 30, y: 100 + (nds.length % 5) * 30 },
        style: { background: stateColor("green"), color: "white", padding: 8, borderRadius: 4 }
      }
    ]);
  }, [setNodes]);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={addNewNode} style={{ marginRight: 8 }}>
          Add node
        </button>
      </div>

      <div style={{ height: 500, border: "1px solid #ddd", borderRadius: 4 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}
