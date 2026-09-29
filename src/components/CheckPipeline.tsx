import React from 'react';
import {
  KeyRound,
  CodeXml,
  Database,
  Package,
  UserCheck,
  ShieldAlert,
  Globe2,
  Sliders,
  CheckCircle2,
  Loader2,
  CircleDashed,
  Info
} from 'lucide-react';
import type { SecurityCheckItem } from '../types/finding';

interface CheckPipelineProps {
  checks: SecurityCheckItem[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Secret Exposure': KeyRound,
  'Input / Output Handling': CodeXml,
  'Client-Side Security': Database,
  'Dependency Security': Package,
  'Authentication & Session': UserCheck,
  'Authorization & Access Control': ShieldAlert,
  'API Surface & SSRF': Globe2,
  'Security Configuration': Sliders
};

export const CheckPipeline: React.FC<CheckPipelineProps> = ({
  checks,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="ws-panel ws-panel-pipeline">
      <div className="ws-panel-header">
        <div className="ws-panel-title-group">
          <span className="ws-panel-title">Assessment Pipeline</span>
          <span className="ws-badge-neutral">{checks.length} Checks</span>
        </div>
        <div className="ws-panel-sub">
          Deterministic local & static security signals
        </div>
      </div>

      <div className="ws-truth-banner">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>Signals detected by checks are candidate findings, not automatic vulnerabilities.</span>
      </div>

      <div className="ws-pipeline-list">
        {checks.map((check) => {
          const Icon = CATEGORY_ICONS[check.category] || ShieldAlert;
          const isSelected = selectedCategory === check.category;

          return (
            <div
              key={check.id}
              onClick={() => onSelectCategory(isSelected ? null : check.category)}
              className={`ws-check-card ws-check-${check.status} ${
                isSelected ? 'ws-check-selected' : ''
              }`}
            >
              <div className="ws-check-left">
                <div className="ws-check-icon-wrap">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="ws-check-text">
                  <div className="ws-check-name">{check.name}</div>
                  <div className="ws-check-category">{check.category}</div>
                </div>
              </div>

              <div className="ws-check-right">
                {check.status === 'idle' && (
                  <span className="ws-check-badge ws-badge-idle">
                    <CircleDashed className="w-3 h-3" />
                    IDLE
                  </span>
                )}
                {check.status === 'running' && (
                  <span className="ws-check-badge ws-badge-running">
                    <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                    RUNNING
                  </span>
                )}
                {check.status === 'completed' && (
                  <div className="ws-check-done-wrap">
                    {check.findingCount > 0 ? (
                      <span className="ws-badge-findings">
                        {check.findingCount} finding{check.findingCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="ws-badge-clean">Clean</span>
                    )}
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ws-pipeline-footer">
        <div className="ws-footer-label">Scope Target:</div>
        <div className="ws-footer-code">target-worldmonitor/</div>
      </div>
    </div>
  );
};
