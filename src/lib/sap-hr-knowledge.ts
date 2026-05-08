export interface InfotypeDef {
  id: string;
  name: string;
  description: string;
  keyFields: string[];
  mainTransaction: string;
  notes: string;
}

export const INFOTYPES: InfotypeDef[] = [
  {
    id: "0001",
    name: "Org Assignment",
    description:
      "Stores the organizational assignment of an employee — which company code, plant, personnel area, cost center, position, and job they belong to. This is the foundational infotype: most other infotypes depend on IT0001 being present and valid.",
    keyFields: [
      "BUKRS — Company Code",
      "WERKS — Personnel Area (plant)",
      "BTRTL — Personnel Subarea",
      "KOSTL — Cost Center",
      "PLANS — Position",
      "STELL — Job",
      "PERSK — Employee Subgroup",
      "PERSG — Employee Group",
      "ABKRS — Payroll Area",
      "ORGEH — Organizational Unit",
    ],
    mainTransaction: "PA30 / PA20",
    notes:
      "IT0001 must exist for any payroll-relevant activity. The ABKRS (Payroll Area) field determines which payroll run the employee belongs to. Changes to KOSTL or PLANS mid-period generate a split in the infotype record.",
  },
  {
    id: "0002",
    name: "Personal Data",
    description:
      "Contains personal master data: legal name, date of birth, gender, nationality, and marital status. Required for HR master data completeness and typically locked from edit once payroll has run.",
    keyFields: [
      "VORNA — First Name",
      "NACHN — Last Name",
      "GBDAT — Date of Birth",
      "GESCH — Gender",
      "NATIO — Nationality",
      "FAMST — Marital Status",
    ],
    mainTransaction: "PA30",
    notes:
      "Data in IT0002 feeds into payroll-adjacent processes like tax reporting and statutory filings. Changes after payroll close may require retroactive correction runs.",
  },
  {
    id: "0003",
    name: "Payroll Status",
    description:
      "System-managed infotype that tracks the payroll processing status of an employee. Not typically edited directly by users — it is updated automatically during payroll runs.",
    keyFields: [
      "FPPER — Earliest Retroactive Accounting Period",
      "VPPER — Last Off-Cycle Payroll Period",
      "BONDT — Date of Last Payroll Run",
      "PDVRS — Payroll Status Flag",
    ],
    mainTransaction: "PA20 (display only)",
    notes:
      "IT0003 is read-only in most configurations. The FPPER field is critical for retroactive payroll: if you change IT0001 or IT0008 with a past date, IT0003 records that an earlier period must be recalculated.",
  },
  {
    id: "0006",
    name: "Addresses",
    description:
      "Stores employee address information. Multiple subtypes exist (01 = permanent, 02 = temporary, etc.). Used for payslip delivery, correspondence, and statutory reporting.",
    keyFields: [
      "STRAS — Street and House Number",
      "ORT01 — City",
      "PSTLZ — Postal Code",
      "LAND1 — Country",
      "TELNR — Telephone Number",
    ],
    mainTransaction: "PA30",
    notes:
      "Subtype 0001 (permanent residence) is usually mandatory. Country-specific address formats are controlled by feature ADDRP.",
  },
  {
    id: "0007",
    name: "Planned Working Time",
    description:
      "Defines the employee's work schedule: which work schedule rule applies, how many hours per week are planned, and the capacity utilization level. This infotype feeds directly into payroll for calculating planned hours and absence deductions.",
    keyFields: [
      "SCHKZ — Work Schedule Rule",
      "WSTDS — Working Hours per Week",
      "EMPCT — Capacity Utilization Level (%)",
      "ZTERF — Time Management Status",
    ],
    mainTransaction: "PA30",
    notes:
      "IT0007 and IT0008 are tightly coupled: EMPCT on IT0007 scales the base pay on IT0008 for part-time employees. The SCHKZ (work schedule rule) determines daily planned hours used in absence and overtime calculations.",
  },
  {
    id: "0008",
    name: "Basic Pay",
    description:
      "Contains the employee's pay scale group, pay scale level, and individual wage types (salary components). This is the primary compensation infotype for payroll calculation.",
    keyFields: [
      "TRFGR — Pay Scale Group",
      "TRFST — Pay Scale Level",
      "TRFAR — Pay Scale Type",
      "BSGRD — Capacity Utilization (%)",
      "LGA01..LGA40 — Wage Type fields (amount/number/unit)",
    ],
    mainTransaction: "PA30",
    notes:
      "Wage types on IT0008 are schema-driven. The system validates via wage type permissibility table (T511). Changes to IT0008 mid-period trigger retroactive payroll if the retroactive accounting date on IT0003 allows it.",
  },
];

export interface ProcessFlow {
  id: string;
  name: string;
  description: string;
  steps: string[];
  relatedInfotypes: string[];
  transactions: string[];
}

export const PROCESS_FLOWS: ProcessFlow[] = [
  {
    id: "pa40-hire",
    name: "New Hire via PA40",
    description:
      "The PA40 transaction is the standard entry point for creating a new employee record. It chains together a sequence of infotype maintenance screens driven by the action type.",
    steps: [
      "Execute PA40, select action type 01 (Hiring)",
      "Enter start date and personnel area — system generates PERNR automatically",
      "System presents infotype chain: IT0001 → IT0002 → IT0006 → IT0007 → IT0008 (sequence configured via T529A)",
      "Complete each infotype screen; all records share the same BEGDA",
      "Save — employee is active and payroll-eligible from the action date",
    ],
    relatedInfotypes: ["0001", "0002", "0006", "0007", "0008"],
    transactions: ["PA40", "PA30", "PA20"],
  },
  {
    id: "payroll-run",
    name: "Payroll Run Sequence",
    description:
      "Standard payroll execution flow for a payroll area in SAP HCM.",
    steps: [
      "Lock payroll period via payroll control record (PA03)",
      "Execute payroll driver (PC00_M99_CALC or country-specific variant)",
      "Review results in payroll journal (PC00_M99_CEDT)",
      "Correct errors and re-run for affected PERNRs",
      "Release payroll for posting",
      "Post to FI/CO (PC00_M99_CIPE)",
      "Unlock period and set next period",
    ],
    relatedInfotypes: ["0001", "0003", "0007", "0008"],
    transactions: ["PA03", "PC00_M99_CALC", "PC00_M99_CEDT"],
  },
];

export interface KbTerm {
  term: string;
  definition: string;
}

export const TERMS: KbTerm[] = [
  {
    term: "PERNR",
    definition:
      "Personnel Number — the unique 8-digit identifier for an employee in SAP HR. Generated automatically at hire and never reused.",
  },
  {
    term: "BEGDA / ENDDA",
    definition:
      "Begin Date and End Date — every infotype record has a validity period. Multiple records of the same infotype with non-overlapping date ranges create a date-delimited history. ENDDA of 9999-12-31 means open-ended.",
  },
  {
    term: "SUBTY",
    definition:
      "Subtype — a secondary classification within an infotype. For example, IT0006 uses subtype 0001 for permanent address and 0002 for temporary address. Subtypes allow multiple records of the same infotype with the same date range.",
  },
  {
    term: "Payroll Area (ABKRS)",
    definition:
      "Groups employees together for a common payroll run cadence (monthly, bi-weekly, etc.). Stored on IT0001. Determines which payroll control record governs the employee's processing.",
  },
  {
    term: "Time Constraint",
    definition:
      "Rule defining how many valid IT records of a given type/subtype can exist simultaneously. TC1 = exactly one valid record at all times. TC2 = at most one. TC3 = unlimited overlapping records allowed.",
  },
  {
    term: "Wage Type",
    definition:
      "A 4-character code representing a pay component (e.g., M010 = base salary, 1000 = overtime). Wage types appear in IT0008 (Basic Pay), IT0014 (Recurring Payments), and IT0015 (Additional Payments), and are processed in the payroll schema.",
  },
  {
    term: "Feature",
    definition:
      "A decision tree in SAP HR (maintained via PE03) that returns a value based on employee master data. Used to default values in infotypes. TARIF defaults pay scale type/area for IT0008. LGMST defaults wage types on IT0008.",
  },
];

// ─── Context assembler helpers ────────────────────────────────────────────────

function formatInfotype(it: InfotypeDef): string {
  return `## Infotype ${it.id} — ${it.name}
${it.description}

Key fields:
${it.keyFields.map((f) => `  - ${f}`).join("\n")}

Main transaction: ${it.mainTransaction}

Notes: ${it.notes}`;
}

function formatProcess(p: ProcessFlow): string {
  return `## Process: ${p.name}
${p.description}

Steps:
${p.steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

Related infotypes: ${p.relatedInfotypes.map((id) => `IT${id}`).join(", ")}
Transactions: ${p.transactions.join(", ")}`;
}

function formatTerms(terms: KbTerm[]): string {
  return `## Key SAP HR Terms\n${terms.map((t) => `- **${t.term}**: ${t.definition}`).join("\n")}`;
}

// ─── Live demo cases ──────────────────────────────────────────────────────────

export interface SapHrCase {
  id: string;
  label: string;
  question: string;
  kbContext: string;
  kbSources: string[]; // labels shown in UI
}

export const LIVE_CASES: SapHrCase[] = [
  {
    id: "it0001-fields",
    label: "What fields does IT0001 store?",
    question:
      "What is Infotype 0001 (Org Assignment)? What are its key fields and why does it matter for payroll and HR processes?",
    kbContext: [
      formatInfotype(INFOTYPES[0]),
      formatTerms(
        TERMS.filter((t) =>
          ["PERNR", "BEGDA / ENDDA", "Payroll Area (ABKRS)"].includes(t.term)
        )
      ),
    ].join("\n\n"),
    kbSources: ["IT0001 — Org Assignment", "Terms: PERNR, BEGDA/ENDDA, Payroll Area"],
  },
  {
    id: "it0007-vs-it0008",
    label: "How do IT0007 and IT0008 interact?",
    question:
      "What is the relationship between Infotype 0007 (Planned Working Time) and Infotype 0008 (Basic Pay)? How do they interact in payroll calculation?",
    kbContext: [
      formatInfotype(INFOTYPES[4]),
      formatInfotype(INFOTYPES[5]),
      formatTerms(TERMS.filter((t) => ["Wage Type"].includes(t.term))),
    ].join("\n\n"),
    kbSources: ["IT0007 — Planned Working Time", "IT0008 — Basic Pay", "Terms: Wage Type"],
  },
  {
    id: "pa40-hire",
    label: "How does PA40 new hire work?",
    question:
      "Walk me through the PA40 new hire process in SAP HR — what happens step by step, which infotypes are created, and what does the system do automatically?",
    kbContext: [
      formatProcess(PROCESS_FLOWS[0]),
      formatInfotype(INFOTYPES[0]),
      formatInfotype(INFOTYPES[1]),
      formatTerms(
        TERMS.filter((t) =>
          ["PERNR", "BEGDA / ENDDA", "Time Constraint"].includes(t.term)
        )
      ),
    ].join("\n\n"),
    kbSources: ["Process: PA40 New Hire", "IT0001", "IT0002", "Terms: PERNR, BEGDA/ENDDA"],
  },
  {
    id: "pernr-dates",
    label: "Explain PERNR, BEGDA, and ENDDA",
    question:
      "Explain PERNR, BEGDA, and ENDDA in SAP HR — what they are, how they work together, and why they matter for infotype record management.",
    kbContext: formatTerms(
      TERMS.filter((t) =>
        ["PERNR", "BEGDA / ENDDA", "SUBTY", "Time Constraint"].includes(t.term)
      )
    ),
    kbSources: ["Terms: PERNR, BEGDA/ENDDA, SUBTY, Time Constraint"],
  },
  {
    id: "payroll-infotypes",
    label: "Which infotypes are needed for payroll?",
    question:
      "Which SAP HR infotypes must exist for an employee to be processed in payroll successfully? What happens if any of them are missing or incomplete?",
    kbContext: [
      formatInfotype(INFOTYPES[0]),
      formatInfotype(INFOTYPES[2]),
      formatInfotype(INFOTYPES[4]),
      formatInfotype(INFOTYPES[5]),
      formatProcess(PROCESS_FLOWS[1]),
      formatTerms(
        TERMS.filter((t) =>
          ["Payroll Area (ABKRS)", "Wage Type"].includes(t.term)
        )
      ),
    ].join("\n\n"),
    kbSources: ["IT0001", "IT0003", "IT0007", "IT0008", "Process: Payroll Run"],
  },
];

// ─── Simulation data ──────────────────────────────────────────────────────────

export interface SimPhase {
  label: string;
  detail: string;
  durationMs: number;
}

export interface SimScenario {
  id: string;
  label: string;
  question: string;
  phases: SimPhase[];
  answer: string;
}

export const SIM_SCENARIOS: SimScenario[] = [
  {
    id: "it0001",
    label: "IT0001 — Org Assignment",
    question: "What does Infotype 0001 store and why is it so important?",
    phases: [
      {
        label: "Parse query",
        detail: "Identified: infotype lookup · target: IT0001 · type: field reference",
        durationMs: 900,
      },
      {
        label: "Search knowledge base",
        detail: "Matched: IT0001 Org Assignment · 10 key fields · 1 related note",
        durationMs: 1100,
      },
      {
        label: "Assemble context",
        detail: "Loading IT0001 definition, field list, payroll area dependency note",
        durationMs: 900,
      },
      {
        label: "Generate response",
        detail: "Reasoning over context · structuring answer · no gaps detected",
        durationMs: 1400,
      },
    ],
    answer: `**Infotype 0001 — Organizational Assignment** is the foundational employee master record. Without it, no other HR or payroll process can run.

**Key fields:**
- BUKRS — Company Code
- WERKS — Personnel Area
- BTRTL — Personnel Subarea
- KOSTL — Cost Center
- PLANS — Position / STELL — Job
- PERSG / PERSK — Employee Group and Subgroup
- **ABKRS — Payroll Area** ← most critical for payroll
- ORGEH — Organizational Unit

**Why it matters:** The ABKRS (Payroll Area) on IT0001 determines which payroll run processes this employee. If IT0001 is missing or has an invalid date range, the employee will be skipped in the payroll driver. Any mid-period change to KOSTL or PLANS creates a new IT0001 record split at the change date, which triggers retroactive payroll.`,
  },
  {
    id: "pa40",
    label: "PA40 — New Hire Process",
    question: "Walk me through a PA40 new hire — what happens at each step?",
    phases: [
      {
        label: "Parse query",
        detail: "Identified: process flow · target: PA40 hire action · type: step-by-step",
        durationMs: 800,
      },
      {
        label: "Search knowledge base",
        detail: "Matched: PA40 New Hire process · 5 steps · infotypes IT0001, IT0002, IT0006, IT0007, IT0008",
        durationMs: 1200,
      },
      {
        label: "Assemble context",
        detail: "Loading PA40 flow, infotype chain (T529A), PERNR generation note",
        durationMs: 1000,
      },
      {
        label: "Generate response",
        detail: "Structuring step-by-step answer · annotating automatic system actions",
        durationMs: 1500,
      },
    ],
    answer: `**PA40 — New Hire action** chains infotype maintenance screens in a configured sequence. Here's what happens:

**1. Execute PA40, select action type 01 (Hiring)**
Enter the start date and personnel area. The system assigns a new PERNR (8-digit personnel number) automatically — it is never recycled.

**2. Infotype chain presentation**
The system presents screens in sequence based on table T529A:
IT0001 → IT0002 → IT0006 → IT0007 → IT0008 (your configuration may vary)

All records share the same BEGDA (start date from step 1).

**3. Complete each infotype screen**
- IT0001: Set org unit, cost center, payroll area
- IT0002: Enter personal data (name, DOB, gender)
- IT0006: Enter home address (subtype 0001)
- IT0007: Assign work schedule rule
- IT0008: Enter pay scale or wage types

**4. Save**
The employee is now active. IT0003 (Payroll Status) is created automatically by the system. The employee will appear in the next payroll run for their ABKRS.`,
  },
  {
    id: "payroll-ready",
    label: "Payroll Readiness Check",
    question: "Which infotypes must exist before payroll can run for an employee?",
    phases: [
      {
        label: "Parse query",
        detail: "Identified: payroll readiness · type: multi-infotype cross-reference",
        durationMs: 850,
      },
      {
        label: "Search knowledge base",
        detail: "Cross-referencing: IT0001, IT0003, IT0007, IT0008 · payroll run process",
        durationMs: 1300,
      },
      {
        label: "Assemble context",
        detail: "Loading payroll-mandatory infotypes · assembling dependency map",
        durationMs: 1000,
      },
      {
        label: "Generate response",
        detail: "Structuring answer · flagging what happens on missing infotypes",
        durationMs: 1400,
      },
    ],
    answer: `For payroll to process an employee, these infotypes must exist with valid records covering the payroll period:

**Required — hard stops:**
- **IT0001** (Org Assignment) — must exist with ABKRS matching the payroll area being run. Missing IT0001 = employee not selected.
- **IT0008** (Basic Pay) — must have at least one wage type with an amount. Missing IT0008 = payroll driver produces a zero-pay result or error, depending on schema configuration.

**Required — payroll status:**
- **IT0003** (Payroll Status) — system-created at hire. If absent (rare edge case), employee may be skipped silently.

**Effectively required — impacts calculation:**
- **IT0007** (Planned Working Time) — absence deductions and part-time scaling depend on SCHKZ. If missing, schema falls back to a default or errors on absence wage types.

**What happens on missing data:**
The payroll driver logs the employee in the error log and produces an incomplete result. The standard fix is to correct the master data and re-run in test mode before releasing the payroll period.`,
  },
];
