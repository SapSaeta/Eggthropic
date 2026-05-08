"use client";

import type { NodeStatuses } from "./types";
import type { ScenarioNodeConfig } from "@/lib/execution-scenarios";
import ExecutionNode from "./ExecutionNode";
import ExecutionEdge from "./ExecutionEdge";
import StatusPulse from "./StatusPulse";

interface Props {
  nodeStatuses: NodeStatuses;
  nodeConfigs: ScenarioNodeConfig[];
}

const NODE_POSITIONS = [
  { id: "analyze" as const, left: `${(230 / 560) * 100}%`, top: `${(40 / 550) * 100}%` },
  { id: "plan" as const, left: `${(60 / 560) * 100}%`, top: `${(185 / 550) * 100}%` },
  { id: "tools" as const, left: `${(400 / 560) * 100}%`, top: `${(185 / 550) * 100}%` },
  { id: "generate" as const, left: `${(230 / 560) * 100}%`, top: `${(325 / 550) * 100}%` },
  { id: "review" as const, left: `${(230 / 560) * 100}%`, top: `${(410 / 550) * 100}%` },
  { id: "deliver" as const, left: `${(230 / 560) * 100}%`, top: `${(485 / 550) * 100}%` },
];

const EDGE_DEFS = [
  { d: "M 280 100 C 280 148 110 137 110 185", sourceId: "analyze" as const },
  { d: "M 280 100 C 280 148 450 137 450 185", sourceId: "analyze" as const },
  { d: "M 110 245 C 110 285 280 285 280 325", sourceId: "plan" as const },
  { d: "M 450 245 C 450 285 280 285 280 325", sourceId: "tools" as const },
  { d: "M 280 385 L 280 410", sourceId: "generate" as const },
  { d: "M 280 470 L 280 485", sourceId: "review" as const },
];

const nodeW = `${(100 / 560) * 100}%`;
const nodeH = `${(60 / 550) * 100}%`;

export default function AgentGraph({ nodeStatuses: nodes, nodeConfigs }: Props) {
  const configMap = Object.fromEntries(nodeConfigs.map((c) => [c.id, c]));

  return (
    <>
      {/* Desktop graph */}
      <div className="hidden sm:block relative w-full" style={{ paddingTop: `${(550 / 560) * 100}%` }}>
        <div className="absolute inset-0">
          {/* Ambient glow behind generate node */}
          {nodes.generate === "running" && (
            <div
              className="absolute pointer-events-none rounded-full"
              style={{
                left: `${(230 / 560) * 100}%`,
                top: `${(325 / 550) * 100}%`,
                width: nodeW,
                height: nodeH,
                background: "radial-gradient(ellipse at center, rgba(255,224,77,0.18) 0%, transparent 70%)",
                transform: "scale(3)",
                transformOrigin: "center",
              }}
            />
          )}

          {/* SVG edges */}
          <svg
            viewBox="0 0 560 550"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
          >
            {EDGE_DEFS.map((edge, i) => {
              const cfg = configMap[edge.sourceId];
              return (
                <ExecutionEdge
                  key={i}
                  d={edge.d}
                  isActive={nodes[edge.sourceId] !== "idle"}
                  color={cfg?.edgeColor ?? "#38bdf8"}
                />
              );
            })}
          </svg>

          {/* HTML nodes */}
          {NODE_POSITIONS.map((pos) => {
            const cfg = configMap[pos.id];
            if (!cfg) return null;
            return (
              <div
                key={pos.id}
                className="absolute"
                style={{ left: pos.left, top: pos.top, width: nodeW, height: nodeH }}
              >
                <ExecutionNode
                  label={cfg.label}
                  sublabel={cfg.sublabel}
                  icon={cfg.icon}
                  status={nodes[pos.id]}
                  phaseColor={cfg.phaseColor}
                  phaseBg={cfg.phaseBg}
                  phaseBorder={cfg.phaseBorder}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: simple vertical list */}
      <div className="sm:hidden flex flex-col gap-2 p-3 glass rounded-xl">
        {NODE_POSITIONS.map((pos) => {
          const cfg = configMap[pos.id];
          const status = nodes[pos.id];
          if (!cfg) return null;
          return (
            <div key={pos.id} className="flex items-center gap-3 py-1.5">
              <StatusPulse
                active={status === "running"}
                color={cfg.phaseColor.replace("text-", "bg-")}
                size="sm"
              />
              <span
                className={[
                  "text-sm font-mono",
                  status === "idle" && "text-slate-600",
                  status === "running" && cfg.phaseColor,
                  status === "success" && cfg.phaseColor,
                  status === "error" && "text-rose-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {cfg.label}
              </span>
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wide ml-auto">
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
