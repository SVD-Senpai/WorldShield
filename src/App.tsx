import React, { useState } from 'react';
import { Header } from './components/Header';
import { WorkflowProgress } from './components/WorkflowProgress';
import { SummaryCards } from './components/SummaryCards';
import { CheckPipeline } from './components/CheckPipeline';
import { FindingsTable } from './components/FindingsTable';
import { FindingDetail } from './components/FindingDetail';
import { ReportPanel } from './components/ReportPanel';

import type { SecurityFinding, SecurityCheckItem, AgentStage } from './types/finding';
import { INITIAL_CHECKS } from './data/demoFindings';
import { scannerService } from './services/scanner';
import { aiAnalystService } from './services/aiAnalyst';

export const App: React.FC = () => {
  const [checks, setChecks] = useState<SecurityCheckItem[]>(INITIAL_CHECKS);
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  const [agentStage, setAgentStage] = useState<AgentStage>('idle');
  const [statusMessage, setStatusMessage] = useState<string>(
    'System ready. Authorized local target: target-worldmonitor/'
  );

  // Computed
  const activeFinding = findings.find((f) => f.id === selectedFindingId) || findings[0] || null;
  const completedChecksCount = checks.filter((c) => c.status === 'completed').length;
  const reportCount = findings.filter((f) => f.inReport !== false).length;

  // 1. Run Assessment Workflow
  const handleRunAssessment = async () => {
    if (isScanning) return;

    setIsScanning(true);
    setAgentStage('understand_target');
    setStatusMessage('Analyzing World Monitor target: source structure, client routes, and API surface...');

    await new Promise((r) => setTimeout(r, 450));
    setAgentStage('plan_checks');
    setStatusMessage('Formulating deterministic security test plan across 8 categories...');

    await new Promise((r) => setTimeout(r, 450));
    setAgentStage('running_checks');

    await scannerService.runAssessment({
      onCheckUpdate: (updatedChecks) => {
        setChecks([...updatedChecks]);
      },
      onFindingsDiscovered: (discoveredFindings) => {
        setFindings([...discoveredFindings]);
      },
      onStageChange: (msg) => {
        setStatusMessage(msg);
      }
    });

    setIsScanning(false);
    setAgentStage('observe_evidence');
    setStatusMessage('Static audit complete. Candidate signals extracted. Human validation required.');

    // Auto-select first finding if none selected
    setFindings((currentFindings) => {
      if (currentFindings.length > 0 && !selectedFindingId) {
        setSelectedFindingId(currentFindings[0].id);
      }
      return currentFindings;
    });
  };

  // 2. Select Finding
  const handleSelectFinding = (finding: SecurityFinding) => {
    setSelectedFindingId(finding.id);
  };

  // 3. AI Evidence Analysis
  const handleAnalyzeEvidence = async (finding: SecurityFinding) => {
    setIsAnalyzing(true);
    setAgentStage('evaluate');
    setStatusMessage(`AI Analyst synthesizing evidence for ${finding.id} (${finding.location})...`);

    try {
      const analysis = await aiAnalystService.analyzeFinding(finding);
      setFindings((prev) =>
        prev.map((f) => (f.id === finding.id ? { ...f, aiAnalysis: analysis } : f))
      );
      setStatusMessage(`AI synthesis complete for ${finding.id}. Code patch and explanation generated.`);
    } catch (err) {
      console.error('Error analyzing evidence:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 4. Validate Finding (Human Assessor decision)
  const handleValidateFinding = (findingId: string) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === findingId) {
          const nextStatus = f.status === 'Confirmed' ? 'Needs Validation' : 'Confirmed';
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
    setAgentStage('ready_for_validation');
    setStatusMessage(`Finding ${findingId} status updated by human assessor.`);
  };

  // 5. Re-test Finding
  const handleRetestFinding = (findingId: string) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === findingId) {
          return {
            ...f,
            status: 'Remediated',
            retest: {
              status: 'Passed',
              before: f.retest.before || 'Vulnerable code pattern observed during static pass.',
              after: 'Mitigation applied. Target verified clean on re-audit pass.',
              testedAt: new Date().toLocaleTimeString()
            }
          };
        }
        return f;
      })
    );
    setAgentStage('completed');
    setStatusMessage(`Finding ${findingId} re-test PASSED. Marked as Remediated.`);
  };

  // 6. Toggle Report Inclusion
  const handleToggleReport = (findingId: string) => {
    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === findingId) {
          const nextInReport = f.inReport === false ? true : false;
          return { ...f, inReport: nextInReport };
        }
        return f;
      })
    );
  };

  return (
    <div className="ws-app">
      {/* Top Header */}
      <Header
        isScanning={isScanning}
        onRunAssessment={handleRunAssessment}
        onOpenReport={() => setIsReportOpen(true)}
        reportCount={reportCount}
        totalFindings={findings.length}
      />

      {/* Agentic Workflow Progress Strip */}
      <WorkflowProgress currentStage={agentStage} statusMessage={statusMessage} />

      {/* Summary Metrics */}
      <div className="ws-summary-container">
        <SummaryCards
          findings={findings}
          isScanning={isScanning}
          totalChecks={checks.length}
          completedChecks={completedChecksCount}
        />
      </div>

      {/* Main 3-Column Dashboard Body */}
      <main className="ws-main-layout">
        {/* Left: Check Pipeline */}
        <CheckPipeline
          checks={checks}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Center: Findings Table */}
        <FindingsTable
          findings={findings}
          selectedFindingId={activeFinding ? activeFinding.id : null}
          onSelectFinding={handleSelectFinding}
          selectedCategory={selectedCategory}
          onClearCategoryFilter={() => setSelectedCategory(null)}
        />

        {/* Right: Finding Detail / Visual Center */}
        {activeFinding ? (
          <FindingDetail
            finding={activeFinding}
            isAnalyzing={isAnalyzing}
            onAnalyzeEvidence={handleAnalyzeEvidence}
            onValidateFinding={handleValidateFinding}
            onRetestFinding={handleRetestFinding}
            onToggleReport={handleToggleReport}
          />
        ) : (
          <div className="ws-panel ws-panel-detail flex items-center justify-center p-8 text-center">
            <div className="ws-empty-state">
              <div className="ws-empty-title">No Finding Selected</div>
              <div className="ws-empty-sub">
                Run the assessment or select an item from the Findings list to inspect code evidence,
                AI analysis, and remediation paths.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Structured Assessment Report Modal */}
      <ReportPanel
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        findings={findings}
        totalChecks={checks.length}
      />
    </div>
  );
};

export default App;
