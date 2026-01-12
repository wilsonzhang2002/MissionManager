import React, { useCallback } from "react";
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

type NodeDto = { id: string; label: string; metadata?: Record<string, any> };
type EdgeDto = { source: string; target: string };

export default function GraphView(props: { nodes: NodeDto[]; edges: EdgeDto[] }) {
    const rfNodes: Node[] = props.nodes.map((n, i) => ({
        id: n.id,
        data: { label: n.label },
        position: { x: i * 200, y: (i % 3) * 120 }
    }));

    const rfEdges: Edge[] = props.edges.map((e, i) => ({
        id: `e${i}`,
        source: e.source,
        target: e.target,
        animated: true
    }));

    const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
        // placeholder: open node details or side panel
        alert(`Node clicked: ${node.id}`);
    }, []);

    return (
        <div style={{ height: 500, border: "1px solid #ddd", borderRadius: 4 }}>
            <ReactFlow nodes={rfNodes} edges={rfEdges} onNodeClick={onNodeClick}>
                <MiniMap />
                <Controls />
                <Background gap={16} />
            </ReactFlow>
        </div>
    );
}
