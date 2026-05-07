"use client";

import type { NodeStatuses } from "./types";
import ExecutionNode from "./ExecutionNode";
import ExecutionEdge from "./ExecutionEdge";
import StatusPulse from "./StatusPulse";

interface Props {
  nodeStatuses: NodeStatuses;
}

const NODE_DEFS = [
  {
    id: "analyze" as const,
    label: "Analyze",
    sublabel: "phase 1",
    icon: "🔍",
    phaseColor: "text-sky-400",
    phaseBg: "bg-sky-400/10",
    phaseBorder: "border-sky-400/30",
    edgeColor: "#38bdf8",
    left: `${(230 / 560) * 100}%`,
    top: `${(40 / 550) * 100}%`,
  },
  {
    id: "plan" as const,
    label: "Plan",
    sublabel: "phase 2",
    icon: "📋",
    phaseColor: "text-violet-400",
    phaseBg: "bg-violet-400/10",
    phaseBorder: "border-violet-400/30",
    edgeColor: "#a78bfa",
    left: `${(60 / 560) * 100}%`,
    top: `${(185 / 550) * 100}%`,
  },
  {
    id: "tools" as const,
    label: "Tools",
    sublabel: "phase 3",
    icon: "🔧",
    phaseColor: "text-violet-400",
    phaseBg: "bg-violet-400/10",
    phaseBorder: "border-violet-400/30",
    edgeColor: "#a78bfa",
    left: `${(400 / 560) * 100}%`,
    top: `${(185 / 550) * 100}%`,
  },
  {
    id: "generate" as const,
    label: "Generate",
    sublabel: "phase 4",
    icon: "⚡",
    phaseColor: "text-egg-400",
    phaseBg: "bg-egg-400/10",
    phaseBorder: "border-egg-400/30",
    edgeColor: "#ffe04d",
    left: `${(230 / 560) * 100}%`,
    top: `${(325 / 550) * 100}%`,
  },
  {
    id: "review" as const,
    label: "Review",
    sublabel: "phase 5",
    icon: "✅",
    phaseColor: "text-amber-400",
    phaseBg: "bg-amber-400/10",
    phaseBorder: "border-amber-400/30",
    edgeColor: "#fbbf24",
    left: `${(230 / 560) * 100}%`,
    top: `${(410 / 550) * 100}%`,
  },
  {
    id: "deliver" as const,
    label: "Deliver",
    sublabel: "phase 6",
    icon: "📦",
    phaseColor: "text-emerald-400",
    phaseBg: "bg-emerald-400/10",
    phaseBorder: "border-emerald-400/30",
    edgeColor: "#34d399",
    left: `${(230 / 560) * 100}%`,
    top: `${(485 / 550) * 100}%`,
  },
] as const;

const nodeW = `${(100 / 560) * 100}%`;
const nodeH = `${(60 / 550) * 100}%`;

export default function AgentGraph({ nodeStatuses }: Props) {
  const nodes = nodeStatuses;

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

          {/* SVG for edges */}
          <svg
            viewBox="0 0 560 550"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <ExecutionEdge
              d="M 280 100 C 280 148 110 137 110 185"
              isActive={nodes.analyze !== "idle"}
              color="#38bdf8"
            />
            <ExecutionEdge
              d="M 280 100 C 280 148 450 137 450 185"
              isActive={nodes.analyze !== "idle"}
              color="#38bdf8"
            />
            <ExecutionEdge
              d="M 110 245 C 110 285 280 285 280 325"
              isActive={nodes.plan !== "idle"}
              color="#a78bfa"
            />
            <ExecutionEdge
              d="M 450 245 C 450 285 280 285 280 325"
              isActive={nodes.tools !== "idle"}
              color="#a78bfa"
            />
            <ExecutionEdge
              d="M 280 385 L 280 410"
              isActive={nodes.generate !== "idle"}
              color="#ffe04d"
            />
            <ExecutionEdge
              d="M 280 470 L 280 485"
              isActive={nodes.review !== "idle"}
              color="#fbbf24"
            />
          </svg>

          {/* HTML nodes */}
          {NODE_DEFS.map((node) => (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: node.left,
                top: node.top,
                width: nodeW,
                height: nodeH,
              }}
            >
              <ExecutionNode
                label={node.label}
                sublabel={node.sublabel}
                icon={node.icon}
                status={nodes[node.id]}
                phaseColor={node.phaseColor}
                phaseBg={node.phaseBg}
                phaseBorder={node.phaseBorder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: simple vertical list */}
      <div className="sm:hidden flex flex-col gap-2 p-3 glass rounded-xl">
        {NODE_DEFS.map((node) => {
          const status = nodes[node.id];
          return (
            <div key={node.id} className="flex items-center gap-3 py-1.5">
              <StatusPulse
                active={status === "running"}
                color={node.phaseColor.replace("text-", "bg-")}
                size="sm"
              />
              <span
                className={[
                  "text-sm font-mono",
                  status === "idle" && "text-slate-600",
                  status === "running" && node.phaseColor,
                  status === "success" && node.phaseColor,
                  status === "error" && "text-rose-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {node.label}
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
