"use client";

import { useReducer, useRef, useCallback, useEffect, useState } from "react";
import type { SimState, SimAction, SimEvent, ScenarioId } from "./types";
import { SCENARIOS, getScenario } from "@/lib/execution-scenarios";
import ModeSelector from "./ModeSelector";
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

function useSimulation(dispatch: DispatchFn, events: SimEvent[]) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const scheduleFrom = useCallback(
    (elapsedMs: number) => {
      events.forEach((evt) => {
        if (evt.ms > elapsedMs) {
          timersRef.current.push(
            setTimeout(() => dispatch(evt.action), evt.ms - elapsedMs)
          );
        }
      });
    },
    [dispatch, events]
  );

  const run = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    startTimeRef.current = Date.now();
    dispatch({ type: "START" });
    scheduleFrom(0);
  }, [dispatch, scheduleFrom]);

  const pause = useCallback(() => {
    pausedAtRef.current = Date.now();
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    dispatch({ type: "PAUSE" });
  }, [dispatch]);

  const resume = useCallback(() => {
    const elapsed = pausedAtRef.current - startTimeRef.current;
    startTimeRef.current = Date.now() - elapsed;
    dispatch({ type: "RESUME" });
    scheduleFrom(elapsed);
  }, [dispatch, scheduleFrom]);

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

  return { run, pause, resume, reset };
}

export default function ExecutionShell() {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>(SCENARIOS[0].id);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const scenario = getScenario(activeScenarioId);
  const { run, pause, resume, reset } = useSimulation(dispatch, scenario.events);

  const handleModeChange = useCallback(
    (id: ScenarioId) => {
      if (id === activeScenarioId) return;
      reset();
      setActiveScenarioId(id);
    },
    [activeScenarioId, reset]
  );

  return (
    <div>
      <ModeSelector
        active={activeScenarioId}
        onChange={handleModeChange}
        disabled={state.status === "running"}
      />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left panel */}
        <div className="lg:w-72 shrink-0 flex flex-col gap-4">
          <PromptPanel
            scenario={scenario}
            status={state.status}
            onRun={run}
            onPause={pause}
            onResume={resume}
            onReset={reset}
          />
          <ExecutionTimeline nodes={state.nodes} phaseConfigs={scenario.phaseConfigs} />
        </div>

        {/* Center: graph */}
        <div className="flex-1 min-h-[320px] glass rounded-xl p-3">
          <AgentGraph nodeStatuses={state.nodes} nodeConfigs={scenario.nodeConfigs} />
        </div>

        {/* Right: terminal */}
        <div className="lg:w-80 shrink-0">
          <ExecutionTerminal logs={state.logs} status={state.status} />
        </div>
      </div>

      <ResultPreview visible={state.status === "complete"} result={scenario.result} />
    </div>
  );
}
