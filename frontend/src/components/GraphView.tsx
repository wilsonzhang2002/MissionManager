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

type NodeDto = { id: string; label: string; metadata?: Record<string, any> };
type EdgeDto = { source: string; target: string };

export default function GraphView(props: {
  nodes: NodeDto[];
  edges: EdgeDto[];
  onChange?: (nodes: NodeDto[], edges: EdgeDto[]) => void;
}) {
  // Map incoming DTOs to React Flow nodes/edges, preserving persisted positions if present
  const initialRfNodes: Node[] = props.nodes.map((n, i) => ({
    id: n.id,
    data: { label: n.label },
    position:
      (n.metadata && (n.metadata.position as { x: number; y: number })) ??
      { x: i * 200, y: (i % 3) * 120 }
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

  // Keep local state in sync if parent props change (e.g., loading a different project)
  useEffect(() => {
    setNodes(
      props.nodes.map((n, i) => ({
        id: n.id,
        data: { label: n.label },
        position:
          (n.metadata && (n.metadata.position as { x: number; y: number })) ??
          { x: i * 200, y: (i % 3) * 120 }
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

  // Add a new node (simple example). Caller can persist via onChange/save button.
  const addNewNode = useCallback(() => {
    const id = `node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        data: { label: "New Node" },
        position: { x: 100 + nds.length * 30, y: 100 + (nds.length % 5) * 30 }
      }
    ]);
  }, [setNodes]);

  // Serialize current RF nodes/edges back to DTO shape and call optional onChange
  const saveModel = useCallback(() => {
    const outNodes: NodeDto[] = nodes.map((n) => ({
      id: n.id,
      label: (n.data as any)?.label ?? n.id,
      metadata: { position: n.position }
    }));

    const outEdges: EdgeDto[] = edges.map((e) => ({
      source: e.source,
      target: e.target
    }));

    if (props.onChange) {
      props.onChange(outNodes, outEdges);
    } else {
      // fallback: log for development
      // In real app: call API to persist
      // eslint-disable-next-line no-console
      console.log("Graph save (no onChange handler):", { nodes: outNodes, edges: outEdges });
      alert("Graph model logged to console. Provide onChange prop to persist.");
    }
  }, [nodes, edges, props]);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={addNewNode} style={{ marginRight: 8 }}>
          Add node
        </button>
        <button onClick={saveModel}>Save graph</button>
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
