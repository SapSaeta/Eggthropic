export type NodeStatus = "idle" | "running" | "success" | "error";
export type SimulationStatus = "idle" | "running" | "paused" | "complete";
export type NodeId = "analyze" | "plan" | "tools" | "generate" | "review" | "deliver";
export type LogKind = "system" | "success" | "warning" | "input" | "code";
export type ScenarioId = "claude-code" | "mcp" | "skills";

export interface LogEntry {
  id: number;
  text: string;
  kind: LogKind;
}

export type NodeStatuses = Record<NodeId, NodeStatus>;

export interface SimState {
  status: SimulationStatus;
  nodes: NodeStatuses;
  logs: LogEntry[];
}

export interface SimEvent {
  ms: number;
  action: SimAction;
}

export type SimAction =
  | { type: "START" }
  | { type: "RESET" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NODE"; id: NodeId; status: NodeStatus }
  | { type: "LOG"; text: string; kind: LogKind }
  | { type: "COMPLETE" };
