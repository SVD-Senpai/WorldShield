import React from 'react';
import { Terminal, FileCode, Copy, Check } from 'lucide-react';
import type { SecurityFinding } from '../types/finding';

interface EvidencePanelProps {
  finding: SecurityFinding;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ finding }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = finding.evidence.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ws-evidence-card">
      <div className="ws-evidence-header">
        <div className="ws-evidence-title">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>Observed Code & Diagnostic Evidence</span>
        </div>
        <div className="ws-evidence-meta">
          <span className="ws-evidence-location">{finding.location}</span>
          <button onClick={handleCopy} className="ws-btn-icon-tiny" title="Copy raw evidence">
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className="ws-evidence-codeblock">
        <pre>
          <code>
            {finding.evidence.map((line, idx) => (
              <div key={idx} className="ws-code-line">
                <span className="ws-line-num">{idx + 1}</span>
                <span className="ws-line-content">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      <div className="ws-reproduction-box">
        <div className="ws-repro-title">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span>Controlled Safe Reproduction Workflow</span>
        </div>
        <ol className="ws-repro-steps">
          {finding.reproduction.map((step, idx) => (
            <li key={idx} className="ws-repro-step-item">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
