import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GraphView from "../components/GraphView";
import { getMission, getNodeStatuses, saveMission, MissionDto } from "../api/mockApi";

type NodeDto = { id: string; label: string; metadata?: Record<string, any> };
type EdgeDto = { source: string; target: string };

export default function MissionDetail() {
  const { missionId } = useParams<{ missionId: string }>();
  const [mission, setMission] = useState<MissionDto | null>(null);
  const [loading, setLoading] = useState(true);

  // latestModel captures model updates emitted by GraphView
  const [latestModel, setLatestModel] = useState<{ nodes: NodeDto[]; edges: EdgeDto[] } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!missionId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const p = await getMission(missionId);
        if (!mounted) return;
        setMission(p);
        setLatestModel({ nodes: p.nodes, edges: p.edges });
      } catch {
        try {
          const p = await getMission("demo-1");
          if (!mounted) return;
          setMission(p);
          setLatestModel({ nodes: p.nodes, edges: p.edges });
        } catch {
          // leave mission as null
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [missionId]);

  if (loading) return <div>Loading mission...</div>;
  if (!mission) return <div>No mission found.</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const toSave = latestModel ?? { nodes: mission.nodes, edges: mission.edges };
      const updated: MissionDto = { ...mission, nodes: toSave.nodes, edges: toSave.edges };
      await saveMission(updated);
      setMission(updated);
      // eslint-disable-next-line no-console
      console.log("Mission saved:", updated);
      alert("Mission saved (mock)");
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
      <h2>{mission.name}</h2>
      <p>
        <strong>Mission ID:</strong> {mission.id}
      </p>
      <p>
        <strong>Tenant ID:</strong> {mission.tenantId ?? "-"}
      </p>
      <p>
        <strong>Tenant Name:</strong> {mission.tenantName ?? "-"}
      </p>

      <div style={{ marginBottom: 8 }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save mission"}
        </button>
      </div>

      <GraphView
        nodes={mission.nodes}
        edges={mission.edges}
        fetchStates={(ids) => getNodeStatuses(ids)}
        onModelChange={(nodes, edges) => setLatestModel({ nodes, edges })}
      />
    </div>
  );
}
