export type NodeStatus = "idle" | "running" | "success" | "error";
export type SimulationStatus = "idle" | "running" | "complete";
export type NodeId = "analyze" | "plan" | "tools" | "generate" | "review" | "deliver";
export type LogKind = "system" | "success" | "warning" | "input";

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

export type SimAction =
  | { type: "START" }
  | { type: "RESET" }
  | { type: "NODE"; id: NodeId; status: NodeStatus }
  | { type: "LOG"; text: string; kind: LogKind }
  | { type: "COMPLETE" };
