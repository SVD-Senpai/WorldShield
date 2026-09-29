import React from 'react';
import { Sparkles, Bot, ShieldAlert, CheckCircle, Code, BookOpen } from 'lucide-react';
import type { SecurityFinding, AIAnalysis } from '../types/finding';

interface AIAnalystProps {
  finding: SecurityFinding;
  analysis?: AIAnalysis;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export const AIAnalyst: React.FC<AIAnalystProps> = ({
  finding,
  analysis,
  isAnalyzing,
  onAnalyze
}) => {
  return (
    <div className="ws-ai-analyst-card">
      <div className="ws-ai-header">
        <div className="ws-ai-title-wrap">
          <div className="ws-ai-icon-bubble">
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="ws-ai-title">AI Security Analyst Layer</div>
            <div className="ws-ai-badge-role">Evidence-Grounded Synthesizer & Explainer</div>
          </div>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`ws-btn ws-btn-ai ${isAnalyzing ? 'ws-btn-loading' : ''}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAnalyzing ? 'Synthesizing Analysis...' : analysis ? 'Re-Analyze Evidence' : 'Analyze Evidence'}</span>
        </button>
      </div>

      <div className="ws-ai-truth-disclaimer">
        <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          Strict Guardrail: AI analyst explains deterministic scanner evidence. It is barred from hallucinating CVEs, fabricating code paths, or confirming vulnerabilities without human sign-off.
        </span>
      </div>

      {!analysis && !isAnalyzing && (
        <div className="ws-ai-prompt-box">
          <div className="text-slate-300 font-medium mb-1">Evidence Pending AI Synthesis</div>
          <div className="text-xs text-slate-400 mb-3">
            Click &quot;Analyze Evidence&quot; to synthesize natural-language risk explanation, calculate business impact vectors, and generate verified code patches.
          </div>
          <button onClick={onAnalyze} className="ws-btn ws-btn-sm ws-btn-cyan">
            <Sparkles className="w-3 h-3 mr-1" /> Run AI Assessment on {finding.id}
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="ws-ai-loading-box">
          <div className="ws-loading-spinner-wrap">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-sm font-medium text-slate-200">Deconstructing AST Pattern & Mapping Evidence...</div>
          <div className="text-xs text-slate-400">Evaluating against authorized World Monitor threat model</div>
        </div>
      )}

      {analysis && !isAnalyzing && (
        <div className="ws-ai-content-body">
          {/* Plain Language Summary */}
          <div className="ws-ai-section">
            <div className="ws-ai-section-title">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Technical Summary for Assessor</span>
            </div>
            <p className="ws-ai-text">{analysis.summary}</p>
          </div>

          {/* Business & System Impact */}
          <div className="ws-ai-section">
            <div className="ws-ai-section-title">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
              <span>Operational & Confidentiality Impact</span>
            </div>
            <p className="ws-ai-text">{analysis.businessImpact}</p>
          </div>

          {/* Actionable Step by Step Remediation */}
          <div className="ws-ai-section">
            <div className="ws-ai-section-title">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Remediation Protocol</span>
            </div>
            <ul className="ws-ai-remediation-list">
              {analysis.stepByStepRemediation.map((step, idx) => (
                <li key={idx} className="ws-ai-remediation-item">
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Proposed Code Fix Patch */}
          {analysis.suggestedCodeFix && (
            <div className="ws-ai-section">
              <div className="ws-ai-section-title">
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>Proposed Code Remediation (Grounded in {finding.location})</span>
              </div>
              <div className="ws-ai-patch-box">
                <pre>
                  <code>{analysis.suggestedCodeFix}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Draft Report Text */}
          <div className="ws-ai-section">
            <div className="ws-ai-section-title">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Draft Report Entry (Ready for Export)</span>
            </div>
            <div className="ws-ai-draft-box">
              <div className="text-xs text-slate-300 italic">{analysis.draftReportText}</div>
              <div className="text-[10px] text-slate-500 mt-2">
                Synthesized at {analysis.analyzedAt} • Status preserved as &quot;{finding.status}&quot;
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
