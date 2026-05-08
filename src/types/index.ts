export type ExperimentStatus = "complete" | "in-progress" | "experimental" | "archived";
export type ExperimentDifficulty = "beginner" | "intermediate" | "advanced";
export type ExperimentCategory =
  | "claude-code"
  | "skills"
  | "mcp"
  | "api"
  | "ux-ui"
  | "automation"
  | "enterprise-ai";

export interface Experiment {
  slug: string;
  title: string;
  description: string;
  category: ExperimentCategory;
  difficulty: ExperimentDifficulty;
  status: ExperimentStatus;
  date: string;
  tools: string[];
  goal: string;
  context: string;
  prompt?: string;
  implementationNotes: string;
  result: string;
  whatWorked: string[];
  whatFailed: string[];
  nextIteration: string;
  references: { label: string; url: string }[];
  labPage?: string;
  lastVerified?: string;
}

export interface Note {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  whatChanged: string;
  whyItMatters: string;
  whatCanBeBuilt: string[];
  limitationsOrRisks: string[];
  references: { label: string; url: string }[];
  relatedExperiments?: string[];
}
