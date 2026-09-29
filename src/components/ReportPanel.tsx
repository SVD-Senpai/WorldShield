import React from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  Shield
} from 'lucide-react';
import type { SecurityFinding } from '../types/finding';

interface ReportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  findings: SecurityFinding[];
  totalChecks: number;
}

export const ReportPanel: React.FC<ReportPanelProps> = ({
  isOpen,
  onClose,
  findings,
  totalChecks
}) => {
  if (!isOpen) return null;

  // Filter reportable findings (all findings or explicitly checked)
  const reportFindings = findings.filter((f) => f.inReport !== false);
  const confirmedCount = reportFindings.filter((f) => f.status === 'Confirmed').length;
  const needsValidationCount = reportFindings.filter((f) => f.status === 'Needs Validation').length;
  const potentialCount = reportFindings.filter((f) => f.status === 'Potential').length;
  const remediatedCount = reportFindings.filter((f) => f.status === 'Remediated').length;

  const assessmentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    let md = `# WORLD MONITOR SECURITY ASSESSMENT REPORT\n`;
    md += `**Assessment ID:** WS-2026-WM-01\n`;
    md += `**Target:** Local / Authorized World Monitor Instance\n`;
    md += `**Scope:** Source Code + Client + API/Auth Surfaces\n`;
    md += `**Status:** Completed\n`;
    md += `**Date:** ${assessmentDate}\n\n`;

    md += `## 1. EXECUTIVE SUMMARY\n`;
    md += `A non-destructive static and client-side security assessment was conducted against the local authorized instance of World Monitor. The assessment focused on client storage mechanisms, RSS feed ingestion and DOM sinks, outbound notification webhooks, dependency advisories, and CORS configuration.\n\n`;

    md += `## 2. FINAL STATUS SUMMARY\n`;
    md += `- **Confirmed findings:** ${confirmedCount}\n`;
    md += `- **Needs validation:** ${needsValidationCount}\n`;
    md += `- **Potential findings:** ${potentialCount}\n`;
    md += `- **Remediated / Re-tested:** ${remediatedCount}\n\n`;

    md += `## 3. METHODOLOGY & CHECKS PERFORMED\n`;
    md += `Total checks executed: ${totalChecks}. AST review, storage hook analysis, dependency advisory matching, and SSRF subnet evaluation.\n\n`;

    md += `## 4. DETAILED FINDINGS\n\n`;
    reportFindings.forEach((f) => {
      md += `### [${f.id}] ${f.title}\n`;
      md += `- **Severity:** ${f.severity}\n`;
      md += `- **Status:** ${f.status} ${f.isDemo ? '(DEMO / BENCHMARK RECORD)' : ''}\n`;
      md += `- **Category:** ${f.category}\n`;
      md += `- **Affected Component:** ${f.affectedComponent}\n`;
      md += `- **Location:** ${f.location}\n\n`;
      md += `**Description:**\n${f.description}\n\n`;
      md += `**Observed Evidence:**\n\`\`\`\n${f.evidence.join('\n')}\n\`\`\`\n\n`;
      md += `**Impact:**\n${f.impact}\n\n`;
      md += `**Remediation:**\n${f.remediation}\n\n`;
      md += `**Re-test Status:** ${f.retest.status} (Before: ${f.retest.before} | After: ${f.retest.after || 'N/A'})\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WorldShield-Assessment-Report-WS-2026.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ws-modal-overlay">
      <div className="ws-report-modal">
        {/* Modal Top Bar */}
        <div className="ws-report-topbar">
          <div className="ws-report-topbar-title">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Formal Security Assessment Report</span>
          </div>

          <div className="ws-report-topbar-actions">
            <button onClick={handleExportMarkdown} className="ws-btn ws-btn-sm ws-btn-outline">
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>
            <button onClick={handlePrint} className="ws-btn ws-btn-sm ws-btn-outline">
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button onClick={onClose} className="ws-btn-icon-close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="ws-report-document" id="printable-report">
          {/* Document Header */}
          <div className="ws-doc-header">
            <div className="ws-doc-brand">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <div className="ws-doc-title">WORLD MONITOR SECURITY ASSESSMENT</div>
                <div className="ws-doc-subtitle">SIH 2026 Problem Statement 26163 Assessment Report</div>
              </div>
            </div>

            <div className="ws-doc-meta-block">
              <div><strong>Assessment ID:</strong> WS-2026-WM-01</div>
              <div><strong>Generated Date:</strong> {assessmentDate}</div>
              <div><strong>Assessor Suite:</strong> WorldShield v2.4 (Authorized Local Companion)</div>
            </div>
          </div>

          {/* Scope & Methodology Table */}
          <div className="ws-doc-table-box">
            <table className="ws-doc-meta-table">
              <tbody>
                <tr>
                  <td><strong>Target Environment</strong></td>
                  <td>Local / Authorized World Monitor Instance (target-worldmonitor/)</td>
                  <td><strong>Assessment Scope</strong></td>
                  <td>Source Code + Client + API/Auth Surfaces</td>
                </tr>
                <tr>
                  <td><strong>Execution Mode</strong></td>
                  <td>Safe Static AST & Signal Review</td>
                  <td><strong>Assessment Status</strong></td>
                  <td><span className="ws-badge-completed">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Executive Summary */}
          <div className="ws-doc-section">
            <h2 className="ws-doc-heading">1. Executive Summary</h2>
            <p className="ws-doc-p">
              This security assessment report documents the evaluation performed on an authorized local deployment
              of the World Monitor situational awareness intelligence platform. In strict accordance with the SIH 2026
              assessment rules, candidate signals detected during automated scanning are treated as potential signals
              pending human validation. No active denial of service or out-of-scope production exploits were conducted.
            </p>
          </div>

          {/* Final Status Summary Metrics (PDF Page 4 Section 12) */}
          <div className="ws-doc-section">
            <h2 className="ws-doc-heading">2. Final Status & Metrics</h2>
            <div className="ws-doc-metrics-grid">
              <div className="ws-metric-box">
                <div className="ws-metric-num text-red-400">{confirmedCount}</div>
                <div className="ws-metric-label">Confirmed Findings</div>
              </div>
              <div className="ws-metric-box">
                <div className="ws-metric-num text-orange-400">{needsValidationCount}</div>
                <div className="ws-metric-label">Needs Validation</div>
              </div>
              <div className="ws-metric-box">
                <div className="ws-metric-num text-amber-400">{potentialCount}</div>
                <div className="ws-metric-label">Potential Findings</div>
              </div>
              <div className="ws-metric-box">
                <div className="ws-metric-num text-emerald-400">{remediatedCount}</div>
                <div className="ws-metric-label">Remediated / Re-tested</div>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="ws-doc-section">
            <h2 className="ws-doc-heading">3. Assessment Methodology & Checks Performed</h2>
            <p className="ws-doc-p">
              A total of {totalChecks} automated security check suites were applied. Static checks targeted
              secret storage in source files, dangerous DOM injection sinks, client web storage routines,
              dependency advisory manifests, authentication cookies, authorization guards, and outbound webhook SSRF filters.
            </p>
          </div>

          {/* Detailed Findings */}
          <div className="ws-doc-section">
            <h2 className="ws-doc-heading">4. Detailed Security Findings</h2>

            {reportFindings.map((finding) => (
              <div key={finding.id} className="ws-doc-finding-card">
                <div className="ws-doc-finding-header">
                  <div className="ws-doc-finding-title-row">
                    <span className="ws-doc-finding-id">{finding.id}</span>
                    <span className="ws-doc-finding-name">{finding.title}</span>
                  </div>
                  <div className="ws-doc-finding-chips">
                    <span className={`ws-badge ws-sev-${finding.severity.toLowerCase()}`}>
                      {finding.severity}
                    </span>
                    <span className="ws-status-chip">
                      {finding.status}
                    </span>
                    {finding.isDemo && (
                      <span className="ws-demo-badge">DEMO / NOT VERIFIED</span>
                    )}
                  </div>
                </div>

                <div className="ws-doc-prop-row">
                  <div><strong>Category:</strong> {finding.category}</div>
                  <div><strong>Component:</strong> <code>{finding.affectedComponent}</code></div>
                  <div><strong>Location:</strong> <code>{finding.location}</code></div>
                </div>

                <div className="ws-doc-subheading">Description</div>
                <p className="ws-doc-p">{finding.description}</p>

                <div className="ws-doc-subheading">Observed Technical Evidence</div>
                <div className="ws-doc-code">
                  <pre>{finding.evidence.join('\n')}</pre>
                </div>

                <div className="ws-doc-subheading">Potential Impact</div>
                <p className="ws-doc-p">{finding.impact}</p>

                <div className="ws-doc-subheading">Engineering Remediation</div>
                <div className="ws-doc-remediation">
                  <pre>{finding.remediation}</pre>
                </div>

                {finding.aiAnalysis?.suggestedCodeFix && (
                  <>
                    <div className="ws-doc-subheading">AI Analyst Suggested Code Patch</div>
                    <div className="ws-doc-code">
                      <pre>{finding.aiAnalysis.suggestedCodeFix}</pre>
                    </div>
                  </>
                )}

                <div className="ws-doc-subheading">Re-test Status</div>
                <div className="ws-doc-retest-status">
                  <div><strong>Status:</strong> {finding.retest.status}</div>
                  <div><strong>Before:</strong> {finding.retest.before}</div>
                  {finding.retest.after && (
                    <div><strong>After:</strong> {finding.retest.after}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Assessor Sign-Off */}
          <div className="ws-doc-signoff">
            <div className="ws-sign-box">
              <div className="ws-sign-line" />
              <div className="ws-sign-name">Lead Cybersecurity Assessor</div>
              <div className="ws-sign-org">SIH 2026 Security Evaluation Team</div>
            </div>

            <div className="ws-sign-box">
              <div className="ws-sign-line" />
              <div className="ws-sign-name">AI Security Analyst Layer</div>
              <div className="ws-sign-org">Deterministic Grounded Verifier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
