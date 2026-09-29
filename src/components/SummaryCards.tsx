import React from 'react';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, Layers } from 'lucide-react';
import type { SecurityFinding } from '../types/finding';

interface SummaryCardsProps {
  findings: SecurityFinding[];
  isScanning: boolean;
  totalChecks: number;
  completedChecks: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  findings,
  isScanning,
  totalChecks,
  completedChecks
}) => {
  const confirmedCount = findings.filter((f) => f.status === 'Confirmed').length;
  const needsValidationCount = findings.filter((f) => f.status === 'Needs Validation').length;
  const potentialCount = findings.filter((f) => f.status === 'Potential').length;
  const remediatedCount = findings.filter((f) => f.status === 'Remediated').length;

  return (
    <div className="ws-summary-grid">
      {/* Assessment Pipeline Status */}
      <div className="ws-card ws-card-summary">
        <div className="ws-card-summary-top">
          <span className="ws-card-title">Assessment Status</span>
          <div className="ws-icon-pill ws-pill-cyan">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="ws-summary-val-wrap">
          <div className="ws-summary-status-tag">
            {isScanning
              ? 'SCANNING TARGET...'
              : findings.length > 0
              ? 'REVIEW IN PROGRESS'
              : 'IDLE (READY)'}
          </div>
          <div className="ws-summary-sub">
            {completedChecks} of {totalChecks} checks run • Local Surface
          </div>
        </div>
      </div>

      {/* Confirmed Findings */}
      <div className="ws-card ws-card-summary">
        <div className="ws-card-summary-top">
          <span className="ws-card-title">Confirmed Findings</span>
          <div className="ws-icon-pill ws-pill-red">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="ws-summary-val-wrap">
          <div className="ws-summary-val ws-text-red">{confirmedCount}</div>
          <div className="ws-summary-sub">Human validated & verified</div>
        </div>
      </div>

      {/* Needs Validation */}
      <div className="ws-card ws-card-summary">
        <div className="ws-card-summary-top">
          <span className="ws-card-title">Needs Validation</span>
          <div className="ws-icon-pill ws-pill-orange">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="ws-summary-val-wrap">
          <div className="ws-summary-val ws-text-orange">{needsValidationCount}</div>
          <div className="ws-summary-sub">Pattern detected; requires review</div>
        </div>
      </div>

      {/* Potential Findings */}
      <div className="ws-card ws-card-summary">
        <div className="ws-card-summary-top">
          <span className="ws-card-title">Potential Findings</span>
          <div className="ws-icon-pill ws-pill-amber">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="ws-summary-val-wrap">
          <div className="ws-summary-val ws-text-amber">{potentialCount}</div>
          <div className="ws-summary-sub">Advisories & candidate signals</div>
        </div>
      </div>

      {/* Remediated / Re-tested */}
      <div className="ws-card ws-card-summary">
        <div className="ws-card-summary-top">
          <span className="ws-card-title">Remediated / Re-tested</span>
          <div className="ws-icon-pill ws-pill-green">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="ws-summary-val-wrap">
          <div className="ws-summary-val ws-text-green">{remediatedCount}</div>
          <div className="ws-summary-sub">Verified fix passed re-test</div>
        </div>
      </div>
    </div>
  );
};
