import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Layers,
  MapPin,
  ShieldCheck,
  Check,
  PlusCircle
} from 'lucide-react';
import type { SecurityFinding, Severity, FindingStatus } from '../types/finding';
import { EvidencePanel } from './EvidencePanel';
import { AIAnalyst } from './AIAnalyst';

interface FindingDetailProps {
  finding: SecurityFinding;
  isAnalyzing: boolean;
  onAnalyzeEvidence: (finding: SecurityFinding) => void;
  onValidateFinding: (findingId: string) => void;
  onRetestFinding: (findingId: string) => void;
  onToggleReport: (findingId: string) => void;
}

export const FindingDetail: React.FC<FindingDetailProps> = ({
  finding,
  isAnalyzing,
  onAnalyzeEvidence,
  onValidateFinding,
  onRetestFinding,
  onToggleReport
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ai'>('details');
  const [isRetesting, setIsRetesting] = useState(false);

  const handleRetestClick = async () => {
    setIsRetesting(true);
    // Simulate interactive test execution
    await new Promise((r) => setTimeout(r, 600));
    setIsRetesting(false);
    onRetestFinding(finding.id);
  };

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'Critical':
        return <span className="ws-badge ws-sev-critical">Critical Severity</span>;
      case 'High':
        return <span className="ws-badge ws-sev-high">High Severity</span>;
      case 'Medium':
        return <span className="ws-badge ws-sev-medium">Medium Severity</span>;
      case 'Low':
        return <span className="ws-badge ws-sev-low">Low Severity</span>;
      default:
        return <span className="ws-badge ws-sev-info">Informational</span>;
    }
  };

  const getStatusBadge = (status: FindingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="ws-status-chip ws-chip-confirmed">
            <ShieldAlert className="w-3.5 h-3.5" /> Confirmed Finding
          </span>
        );
      case 'Needs Validation':
        return (
          <span className="ws-status-chip ws-chip-validation">
            <AlertTriangle className="w-3.5 h-3.5" /> Needs Human Validation
          </span>
        );
      case 'Potential':
        return (
          <span className="ws-status-chip ws-chip-potential">
            <Layers className="w-3.5 h-3.5" /> Potential Signal
          </span>
        );
      case 'Remediated':
        return (
          <span className="ws-status-chip ws-chip-remediated">
            <CheckCircle className="w-3.5 h-3.5" /> Remediated & Passed
          </span>
        );
    }
  };

  return (
    <div className="ws-panel ws-panel-detail">
      {/* Detail Header */}
      <div className="ws-detail-header">
        <div className="ws-detail-header-top">
          <div className="ws-detail-id-wrap">
            <span className="ws-detail-id">{finding.id}</span>
            {getSeverityBadge(finding.severity)}
            {getStatusBadge(finding.status)}
            {finding.isDemo && (
              <span className="ws-demo-badge" title="Benchmark reference finding">
                DEMO / NOT VERIFIED
              </span>
            )}
          </div>

          <div className="ws-detail-actions">
            {/* Validate Finding button */}
            <button
              onClick={() => onValidateFinding(finding.id)}
              className={`ws-btn ws-btn-sm ${
                finding.status === 'Confirmed' ? 'ws-btn-success' : 'ws-btn-warning'
              }`}
              title="Confirm or revoke finding validity based on technical proof"
            >
              {finding.status === 'Confirmed' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Validated (Confirmed)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Validate Finding</span>
                </>
              )}
            </button>

            {/* Re-test button */}
            <button
              onClick={handleRetestClick}
              disabled={isRetesting}
              className={`ws-btn ws-btn-sm ${
                finding.status === 'Remediated' ? 'ws-btn-remediated' : 'ws-btn-outline'
              }`}
              title="Execute verification test against patched code"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRetesting ? 'animate-spin' : ''}`} />
              <span>{isRetesting ? 'Verifying...' : finding.status === 'Remediated' ? 'Re-tested (Passed)' : 'Re-test'}</span>
            </button>

            {/* Add to Report button */}
            <button
              onClick={() => onToggleReport(finding.id)}
              className={`ws-btn ws-btn-sm ${
                finding.inReport ? 'ws-btn-report-active' : 'ws-btn-outline'
              }`}
              title="Add or remove this finding from the formal assessment report"
            >
              {finding.inReport ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>In Report</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add to Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        <h1 className="ws-detail-title">{finding.title}</h1>

        <div className="ws-detail-meta-bar">
          <div className="ws-meta-item">
            <span className="ws-meta-label">Category:</span>
            <span className="ws-meta-val">{finding.category}</span>
          </div>
          <div className="ws-meta-item">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span className="ws-meta-label">Component:</span>
            <span className="ws-meta-val ws-code-font">{finding.affectedComponent}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="ws-detail-tabs">
          <button
            onClick={() => setActiveTab('details')}
            className={`ws-tab-btn ${activeTab === 'details' ? 'ws-tab-active' : ''}`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Finding Details & Evidence</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ai');
              if (!finding.aiAnalysis && !isAnalyzing) {
                onAnalyzeEvidence(finding);
              }
            }}
            className={`ws-tab-btn ${activeTab === 'ai' ? 'ws-tab-active' : ''}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Analyst Synthesis</span>
            {finding.aiAnalysis && <span className="ws-badge-clean ml-1.5">Ready</span>}
          </button>
        </div>
      </div>

      {/* Detail Scrollable Body */}
      <div className="ws-detail-body">
        {activeTab === 'details' ? (
          <div className="ws-detail-scrollable">
            {/* Re-test status banner if re-tested */}
            {finding.status === 'Remediated' && (
              <div className="ws-retest-banner">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-emerald-300">
                    Re-test Verification: PASSED (Remediated)
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    <strong>Before:</strong> {finding.retest.before}
                  </div>
                  <div className="text-xs text-emerald-300/90 mt-0.5">
                    <strong>After:</strong> Verified patch applied. Target no longer emits candidate signal during static audit.
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="ws-section-block">
              <h3 className="ws-section-heading">Description</h3>
              <p className="ws-text-body">{finding.description}</p>
            </div>

            {/* Severity Reasoning Breakdown (PDF Page 3 Section 8) */}
            <div className="ws-section-block">
              <h3 className="ws-section-heading">Assessor Severity Reasoning Breakdown</h3>
              <div className="ws-reasoning-grid">
                <div className="ws-reason-item">
                  <div className="ws-reason-label">Attack Precondition</div>
                  <div className="ws-reason-val">{finding.severityReasoning.attackPrecondition}</div>
                </div>
                <div className="ws-reason-item">
                  <div className="ws-reason-label">Affected Asset</div>
                  <div className="ws-reason-val">{finding.severityReasoning.affectedAsset}</div>
                </div>
                <div className="ws-reason-item">
                  <div className="ws-reason-label">Confidentiality Impact</div>
                  <div className="ws-reason-val">{finding.severityReasoning.confidentialityImpact}</div>
                </div>
                <div className="ws-reason-item">
                  <div className="ws-reason-label">Integrity Impact</div>
                  <div className="ws-reason-val">{finding.severityReasoning.integrityImpact}</div>
                </div>
                <div className="ws-reason-item">
                  <div className="ws-reason-label">Availability Impact</div>
                  <div className="ws-reason-val">{finding.severityReasoning.availabilityImpact}</div>
                </div>
                <div className="ws-reason-item">
                  <div className="ws-reason-label">Confidence Level</div>
                  <div className="ws-reason-val font-semibold text-cyan-400">
                    {finding.severityReasoning.confidence}
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence & Safe Reproduction */}
            <div className="ws-section-block">
              <h3 className="ws-section-heading">Static & Dynamic Evidence</h3>
              <EvidencePanel finding={finding} />
            </div>

            {/* Impact */}
            <div className="ws-section-block">
              <h3 className="ws-section-heading">Potential Risk & Impact Analysis</h3>
              <div className="ws-impact-box">
                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <p className="ws-text-body mb-0">{finding.impact}</p>
              </div>
            </div>

            {/* Recommended Remediation */}
            <div className="ws-section-block">
              <h3 className="ws-section-heading">Recommended Engineering Remediation</h3>
              <div className="ws-remediation-box">
                <pre className="ws-remediation-text">{finding.remediation}</pre>
              </div>
            </div>

            {/* Fast Trigger for AI Analysis */}
            <div className="ws-ai-teaser-banner">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-slate-200">
                  Want plain-language explanation & automated code diff?
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveTab('ai');
                  if (!finding.aiAnalysis && !isAnalyzing) {
                    onAnalyzeEvidence(finding);
                  }
                }}
                className="ws-btn ws-btn-sm ws-btn-cyan"
              >
                Analyze with AI Analyst
              </button>
            </div>
          </div>
        ) : (
          <div className="ws-detail-scrollable">
            <AIAnalyst
              finding={finding}
              analysis={finding.aiAnalysis}
              isAnalyzing={isAnalyzing}
              onAnalyze={() => onAnalyzeEvidence(finding)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
