"use client";

import { useReducer, useRef, useCallback, useEffect } from "react";
import type { SimState, SimAction, NodeId, NodeStatus, LogKind } from "./types";
import AgentGraph from "./AgentGraph";
import PromptPanel from "./PromptPanel";
import ExecutionTimeline from "./ExecutionTimeline";
import ExecutionTerminal from "./ExecutionTerminal";
import ResultPreview from "./ResultPreview";

const INITIAL_NODES: SimState["nodes"] = {
  analyze: "idle",
  plan: "idle",
  tools: "idle",
  generate: "idle",
  review: "idle",
  deliver: "idle",
};

const INITIAL_STATE: SimState = {
  status: "idle",
  nodes: INITIAL_NODES,
  logs: [],
};

function reducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case "START":
      return { ...state, status: "running" };
    case "RESET":
      return { status: "idle", nodes: INITIAL_NODES, logs: [] };
    case "NODE":
      return { ...state, nodes: { ...state.nodes, [action.id]: action.status } };
    case "LOG":
      return {
        ...state,
        logs: [...state.logs, { id: state.logs.length, text: action.text, kind: action.kind }],
      };
    case "COMPLETE":
      return { ...state, status: "complete" };
    default:
      return state;
  }
}

type DispatchFn = React.Dispatch<SimAction>;

function useSimulation(dispatch: DispatchFn) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const schedule = (ms: number, id: NodeId, status: NodeStatus) => {
    timersRef.current.push(
      setTimeout(() => dispatch({ type: "NODE", id, status }), ms)
    );
  };

  const log = (ms: number, text: string, kind: LogKind) => {
    timersRef.current.push(
      setTimeout(() => dispatch({ type: "LOG", text, kind }), ms)
    );
  };

  const run = useCallback(() => {
    dispatch({ type: "START" });

    log(0, "▸ Initializing execution environment...", "system");
    log(200, "▸ Loading scenario: Create landing page · SaaS", "input");
    schedule(500, "analyze", "running");
    log(500, "▸ Task received · landing-page:saas", "system");
    log(800, "▸ Parsing prompt tokens...", "system");
    log(1200, "▸ Extracting requirements...", "system");
    log(1600, "▸ Output structure mapped", "system");
    schedule(2000, "analyze", "success");
    log(2000, "✓ Requirements locked · 5 sections", "success");
    schedule(2200, "plan", "running");
    log(2200, "▸ Initializing structure planner...", "system");
    schedule(2200, "tools", "running");
    log(2200, "▸ Loading tool registry...", "system");
    log(2500, "▸ Sections: Hero · Features · Pricing · CTA · Footer", "system");
    log(2500, "▸ code-writer  ready", "system");
    log(2900, "▸ Mapping component hierarchy...", "system");
    log(2900, "▸ tailwind-engine  ready", "system");
    schedule(3200, "tools", "success");
    log(3200, "✓ 3 tools loaded", "success");
    schedule(3500, "plan", "success");
    log(3500, "✓ Plan complete · 6 components", "success");
    schedule(3700, "generate", "running");
    log(3700, "▸ Writing Hero section...", "system");
    log(4000, "▸ Writing Features grid (3 columns)...", "system");
    log(4300, "▸ Writing Pricing table (3 tiers)...", "system");
    log(4600, "▸ Writing CTA section...", "system");
    log(4900, "▸ Writing Footer component...", "system");
    log(5200, "▸ Applying Tailwind responsive classes...", "system");
    schedule(5600, "generate", "success");
    log(5600, "✓ 847 lines · 6 files generated", "success");
    schedule(5800, "review", "running");
    log(5800, "▸ Running accessibility audit...", "system");
    log(6200, "▸ Validating breakpoints sm·md·lg...", "system");
    schedule(6700, "review", "success");
    log(6700, "✓ Quality score: 94 / 100", "success");
    schedule(6900, "deliver", "running");
    log(6900, "▸ Packaging output bundle...", "system");
    log(7200, "▸ Writing file manifest...", "system");
    schedule(7600, "deliver", "success");
    log(7600, "✓ Delivery complete · 6 files", "success");
    timersRef.current.push(
      setTimeout(() => dispatch({ type: "COMPLETE" }), 7800)
    );
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    dispatch({ type: "RESET" });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return { run, reset };
}

export default function ExecutionShell() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { run, reset } = useSimulation(dispatch);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left panel */}
        <div className="lg:w-72 shrink-0 flex flex-col gap-4">
          <PromptPanel status={state.status} onRun={run} onReset={reset} />
          <ExecutionTimeline nodes={state.nodes} />
        </div>

        {/* Center: graph */}
        <div className="flex-1 min-h-[320px] glass rounded-xl p-3">
          <AgentGraph nodeStatuses={state.nodes} />
        </div>

        {/* Right: terminal */}
        <div className="lg:w-80 shrink-0">
          <ExecutionTerminal logs={state.logs} status={state.status} />
        </div>
      </div>

      <ResultPreview visible={state.status === "complete"} />
    </div>
  );
}
