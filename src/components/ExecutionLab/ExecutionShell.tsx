"use client";

import { useReducer, useRef, useCallback, useEffect, useState } from "react";
import type { SimState, SimAction, SimEvent, ScenarioId, NodeId } from "./types";
import { SCENARIOS, getScenario } from "@/lib/execution-scenarios";
import ModeSelector from "./ModeSelector";
import AgentGraph from "./AgentGraph";
import PromptPanel from "./PromptPanel";
import ExecutionTimeline from "./ExecutionTimeline";
import ExecutionTerminal from "./ExecutionTerminal";
import ResultPreview from "./ResultPreview";
import ExecutionInspector from "./ExecutionInspector";
import TrustSafetyPanel from "./TrustSafetyPanel";
import CompareModesView from "./CompareModesView";

const INITIAL_NODES: SimState["nodes"] = {
  analyze: "idle",
  plan: "idle",
  tools: "idle",
  generate: "idle",
  review: "idle",
  deliver: "idle",
};

const INITIAL_STATE: SimState = { status: "idle", nodes: INITIAL_NODES, logs: [] };

function reducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case "START":
      return { ...state, status: "running" };
    case "PAUSE":
      return { ...state, status: "paused" };
    case "RESUME":
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

const NODE_ORDER: NodeId[] = ["analyze", "plan", "tools", "generate", "review", "deliver"];

function useSimulation(dispatch: DispatchFn, events: SimEvent[]) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startTimeRef = useRef<number>(0);
  const progressMsRef = useRef<number>(0);
  const startedRef = useRef<boolean>(false);

  const scheduleFrom = useCallback(
    (progressMs: number) => {
      events.forEach((evt) => {
        if (evt.ms > progressMs) {
          timersRef.current.push(
            setTimeout(() => dispatch(evt.action), evt.ms - progressMs)
          );
        }
      });
    },
    [dispatch, events]
  );

  const run = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    progressMsRef.current = 0;
    startTimeRef.current = Date.now();
    startedRef.current = true;
    dispatch({ type: "START" });
    scheduleFrom(0);
  }, [dispatch, scheduleFrom]);

  const pause = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    progressMsRef.current = elapsed;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    dispatch({ type: "PAUSE" });
  }, [dispatch]);

  const resume = useCallback(() => {
    const progress = progressMsRef.current;
    startTimeRef.current = Date.now() - progress;
    dispatch({ type: "RESUME" });
    scheduleFrom(progress);
  }, [dispatch, scheduleFrom]);

  const stepForward = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const progress = progressMsRef.current;
    const maxMs = events.reduce((m, ev) => Math.max(m, ev.ms), 0);

    if (progress > maxMs) return;

    // Find the next NODE:running event after current progress
    const nextPhaseEvent = events.find((evt) => {
      if (evt.action.type !== "NODE") return false;
      return evt.action.status === "running" && evt.ms > progress;
    });

    // Include all events up to just past that phase boundary (or end of scenario)
    const cutoff = nextPhaseEvent ? nextPhaseEvent.ms + 50 : maxMs + 100;

    if (!startedRef.current) {
      startedRef.current = true;
      dispatch({ type: "START" });
    }

    events.forEach((evt) => {
      if (evt.ms > progress && evt.ms <= cutoff) {
        dispatch(evt.action);
      }
    });

    progressMsRef.current = cutoff;

    const firedComplete = events.some(
      (evt) => evt.action.type === "COMPLETE" && evt.ms > progress && evt.ms <= cutoff
    );

    if (!firedComplete) {
      startTimeRef.current = Date.now() - cutoff;
      dispatch({ type: "PAUSE" });
    }
  }, [dispatch, events]);

  const reset = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    progressMsRef.current = 0;
    startedRef.current = false;
    dispatch({ type: "RESET" });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return { run, pause, resume, stepForward, reset };
}

type ViewMode = "run" | "compare";

export default function ExecutionShell() {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>(SCENARIOS[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>("run");
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const scenario = getScenario(activeScenarioId);
  const { run, pause, resume, stepForward, reset } = useSimulation(dispatch, scenario.events);

  const handleModeChange = useCallback(
    (id: ScenarioId) => {
      if (id === activeScenarioId) return;
      reset();
      setActiveScenarioId(id);
    },
    [activeScenarioId, reset]
  );

  // Derive the most recently active node for the inspector
  const activeNodeId = [...NODE_ORDER]
    .reverse()
    .find((id) => state.nodes[id] === "running" || state.nodes[id] === "success");

  // Derive current phase index for display
  const currentPhaseIndex = NODE_ORDER.findIndex((id) => state.nodes[id] === "running");

  return (
    <div>
      {/* Top bar: mode selector + view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
        <div className="flex-1">
          <ModeSelector
            active={activeScenarioId}
            onChange={handleModeChange}
            disabled={state.status === "running"}
          />
        </div>
        <div className="flex items-center gap-1 shrink-0 mb-[2px]">
          {(["run", "compare"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={[
                "px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all",
                viewMode === v
                  ? "bg-zinc-100 text-zinc-900 border border-zinc-300"
                  : "text-zinc-500 hover:text-zinc-700 border border-transparent",
              ].join(" ")}
            >
              {v === "run" ? "▶ Run" : "⊞ Compare"}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "compare" ? (
        <CompareModesView />
      ) : (
        <>
          {/* Story banner */}
          <div className="mb-4 glass rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-3 sm:gap-6">
            <div className="flex-1">
              <span className="font-mono text-[9px] tracking-widest text-zinc-400 uppercase block mb-1">
                What you are watching
              </span>
              <p className="text-[11px] text-zinc-600 leading-relaxed">{scenario.story.watching}</p>
            </div>
            <div className="flex-1">
              <span className="font-mono text-[9px] tracking-widest text-zinc-400 uppercase block mb-1">
                What this is not
              </span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">{scenario.story.notThis}</p>
            </div>
          </div>

          {/* Main 3-panel layout */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-72 shrink-0 flex flex-col gap-4">
              <PromptPanel
                scenario={scenario}
                status={state.status}
                currentPhaseIndex={currentPhaseIndex}
                onRun={run}
                onPause={pause}
                onResume={resume}
                onStepForward={stepForward}
                onReset={reset}
              />
              <ExecutionTimeline nodes={state.nodes} phaseConfigs={scenario.phaseConfigs} />
            </div>

            <div className="flex-1 min-h-[320px] glass rounded-xl p-3">
              <AgentGraph nodeStatuses={state.nodes} nodeConfigs={scenario.nodeConfigs} />
            </div>

            <div className="lg:w-80 shrink-0">
              <ExecutionTerminal logs={state.logs} status={state.status} />
            </div>
          </div>

          {/* Inspector */}
          <div className="mt-4">
            <ExecutionInspector scenario={scenario} activeNodeId={activeNodeId} />
          </div>

          {/* Trust & Safety */}
          <div className="mt-4">
            <TrustSafetyPanel scenario={scenario} />
          </div>

          {/* Result preview */}
          <ResultPreview visible={state.status === "complete"} result={scenario.result} />
        </>
      )}
    </div>
  );
}
