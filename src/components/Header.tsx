import React from 'react';
import { Shield, Play, RefreshCw, FileText } from 'lucide-react';

interface HeaderProps {
  isScanning: boolean;
  onRunAssessment: () => void;
  onOpenReport: () => void;
  reportCount: number;
  totalFindings: number;
}

export const Header: React.FC<HeaderProps> = ({
  isScanning,
  onRunAssessment,
  onOpenReport,
  reportCount
}) => {
  return (
    <header className="ws-header">
      <div className="ws-header-left">
        <div className="ws-logo-wrap">
          <div className="ws-logo-icon">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="ws-logo-title">
              WORLD<span className="text-cyan-400">SHIELD</span>
              <span className="ws-badge-version">v2.4 LOCAL</span>
            </div>
            <div className="ws-logo-subtitle">Authorized Security Assessment Companion</div>
          </div>
        </div>

        <div className="ws-target-strip">
          <div className="ws-target-chip">
            <span className="ws-indicator-dot ws-dot-active" />
            <span className="ws-target-label">Target:</span>
            <span className="ws-target-value">Local Authorized World Monitor</span>
          </div>

          <div className="ws-scope-chip">
            <span className="ws-scope-label">Scope:</span>
            <span className="ws-scope-value">Source Code + Client + API Surfaces</span>
          </div>

          <div className="ws-mode-chip">
            <span className="ws-mode-label">Mode:</span>
            <span className="ws-mode-value">Non-Destructive Static / Audit</span>
          </div>
        </div>
      </div>

      <div className="ws-header-right">
        <button
          className={`ws-btn ws-btn-report ${reportCount > 0 ? 'ws-btn-report-active' : ''}`}
          onClick={onOpenReport}
          title="Open Executive Assessment Report"
        >
          <FileText className="w-4 h-4" />
          <span>Assessment Report</span>
          <span className="ws-count-bubble">{reportCount}</span>
        </button>

        <button
          className={`ws-btn ws-btn-primary ${isScanning ? 'ws-btn-loading' : ''}`}
          onClick={onRunAssessment}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
              <span>Running Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Run Assessment</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
