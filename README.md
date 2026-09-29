# WORLDShield — Security Assessment Companion for World Monitor

**Problem Statement:** SIH 26163 — Security Assessment of the World Monitor application  
**Build Target:** Authorized local instance of World Monitor (`target-worldmonitor/`)  
**Prototype Tech Stack:** React 19, TypeScript, Vite, Lucide Icons, Custom Security Console UI  

---

## 1. What WorldShield Does

WorldShield is a dedicated, non-destructive security assessment dashboard and companion built for evaluators analyzing an authorized local instance of World Monitor.

Instead of pretending to be a generic automated exploit scanner or hallucinating vulnerabilities, WorldShield enforces the **Strict Security Truth Rules**:
1. **Deterministic Static & Signal Detection:** Identifies candidate signals across 8 security categories (secrets, dangerous DOM sinks, client web storage, dependency advisories, authentication/cookies, authorization/routes, API surface/SSRF, and CORS/headers).
2. **Signal ≠ Vulnerability:** Initial candidate signals are classified as `Needs Validation` or `Potential`.
3. **AI Analyst Layer:** An evidence-grounded AI analyst layer explains technical evidence in plain English, calculates business/system impact, drafts code patches, and drafts report text—strictly grounded in observed code without hallucinating CVEs or paths.
4. **Human Validation & Re-testing:** The assessor explicitly confirms or rejects findings, executes simulated verification re-tests (marking them `Remediated / Passed`), and compiles a formal exportable assessment report.

---

## 2. Quickstart: How to Run

WorldShield is pre-configured and runnable out of the box:

```bash
# Navigate to prototype directory
cd worldshield

# Install dependencies (already installed)
npm install

# Start local assessment server
npm run dev -- --port 5173
```

Open `http://localhost:5173` in your browser.

To verify a production build:
```bash
npm run build
npm run preview
```

---

## 3. The Exact 2-Minute Demo Script

Follow this step-by-step click sequence for presentations and judging evaluations:

1. **Open WorldShield Dashboard:**
   - Present the header: Target is marked as `Local Authorized World Monitor`, Scope is `Source Code + Client + API Surfaces`, and the Agentic Workflow progress strip is active.

2. **Click "Run Assessment":**
   - Watch the agent workflow transition: *Understand Target* → *Plan Checks* → *Run Checks*.
   - In the left **Assessment Pipeline**, watch all 8 security checks progress in real-time from `IDLE` to `RUNNING` (with spinners) to `COMPLETED` (with finding count badges).
   - Announce: *"The scanner produces candidate signals. In accordance with SIH assessment rules, it does not automatically call them confirmed vulnerabilities."*

3. **Select a Finding:**
   - In the center **Security Findings** table, select **`WS-001` (Client-Side Sensitive Token Storage Review)** or **`WS-002` (Unsafe HTML Rendering Pattern)**.
   - Note the **`DEMO / NOT VERIFIED`** watermark badge proving strict adherence to the Truth Rules.

4. **Review Evidence & Severity Reasoning:**
   - In the right **Finding Detail** panel, inspect:
     - Component & File Location (`src/settings-main.ts:142` or `src/features/rss/feed-card.ts:88`)
     - **Assessor Severity Reasoning Breakdown:** Attack Precondition, Affected Asset, Confidentiality, Integrity, and Confidence level.
     - **Observed Code Evidence:** Exact source code lines and controlled reproduction steps.

5. **Click "Analyze Evidence" (or AI Analyst Tab):**
   - The **AI Security Analyst** synthesizes the technical evidence.
   - Review: Plain-language summary, business/system impact, step-by-step remediation guide, and proposed code fix patch.

6. **Click "Validate Finding":**
   - Demonstrate human-in-the-loop validation: The status chip changes from `Needs Validation` to `Confirmed`. Notice the summary card for Confirmed Findings updates to reflect assessor validation.

7. **Click "Re-test":**
   - Click **Re-test**. The verification test executes, transitioning the finding to **`Remediated & Passed`** with a full before/after audit trail banner.

8. **Open "Assessment Report":**
   - Click **Assessment Report** in the top header.
   - Show the formal structured executive report: Target scope, methodology, final status metrics (Confirmed, Needs Validation, Potential, Remediated), detailed finding documentation, and signed assessor sign-off block.
   - Click **Export Markdown** or **Print / PDF** to demonstrate report generation.

---

## 4. Architecture & Directory Structure

```
worldshield/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Logo, target scope, run button, report launcher
│   │   ├── WorkflowProgress.tsx # 7-stage agentic workflow progress strip
│   │   ├── SummaryCards.tsx     # Factual status and count metrics (no fake score)
│   │   ├── CheckPipeline.tsx    # 8 security check suites with live status indicators
│   │   ├── FindingsTable.tsx    # Candidate findings with filters, severity & status chips
│   │   ├── FindingDetail.tsx    # Visual center: evidence, reasoning, validation, re-test
│   │   ├── EvidencePanel.tsx    # Line-numbered code snippet and reproduction steps
│   │   ├── AIAnalyst.tsx        # Grounded AI analysis, impact, and code patch
│   │   └── ReportPanel.tsx      # Formal executive report modal with Markdown/Print export
│   ├── data/
│   │   └── demoFindings.ts      # Grounded benchmark findings and check definitions
│   ├── services/
│   │   ├── scanner.ts           # Deterministic assessment pipeline runner
│   │   └── aiAnalyst.ts         # Evidence-grounded analysis & remediation generator
│   ├── types/
│   │   └── finding.ts           # Strict TypeScript data models
│   ├── App.tsx                  # Main reactive application controller
│   ├── index.css                # Dark cybersecurity console styling
│   └── main.tsx                 # React DOM root entry
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
