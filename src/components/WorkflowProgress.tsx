import React from 'react';
import { Target, Cpu, ListFilter, PlayCircle, Eye, CheckSquare, Sparkles, ShieldCheck } from 'lucide-react';
import type { AgentStage } from '../types/finding';

interface WorkflowProgressProps {
  currentStage: AgentStage;
  statusMessage: string;
}

interface StepDef {
  key: AgentStage;
  label: string;
  icon: React.ElementType;
}

const STEPS: StepDef[] = [
  { key: 'understand_target', label: '1. Understand Target', icon: Target },
  { key: 'plan_checks', label: '2. Plan Checks', icon: ListFilter },
  { key: 'running_checks', label: '3. Run Checks', icon: PlayCircle },
  { key: 'observe_evidence', label: '4. Observe Evidence', icon: Eye },
  { key: 'evaluate', label: '5. AI Evaluation', icon: Sparkles },
  { key: 'ready_for_validation', label: '6. Human Validation', icon: CheckSquare },
  { key: 'completed', label: '7. Re-test & Report', icon: ShieldCheck }
];

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ currentStage, statusMessage }) => {
  const getStageIndex = (stage: AgentStage): number => {
    switch (stage) {
      case 'idle':
        return -1;
      case 'understand_target':
        return 0;
      case 'plan_checks':
        return 1;
      case 'running_checks':
        return 2;
      case 'observe_evidence':
        return 3;
      case 'evaluate':
        return 4;
      case 'ready_for_validation':
        return 5;
      case 'completed':
        return 6;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="ws-workflow-bar">
      <div className="ws-workflow-header">
        <div className="ws-workflow-label">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>SECURITY ASSESSMENT AGENT WORKFLOW</span>
        </div>
        <div className="ws-workflow-status">
          <span className="ws-pulse-indicator" />
          <span className="ws-status-text">{statusMessage}</span>
        </div>
      </div>

      <div className="ws-steps-track">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isCurrent = idx === currentIndex;
          const isPassed = currentIndex > idx;

          let stepClass = 'ws-step-pending';
          if (isCurrent) stepClass = 'ws-step-current';
          else if (isPassed) stepClass = 'ws-step-completed';

          return (
            <div key={step.key} className={`ws-step-item ${stepClass}`}>
              <div className="ws-step-badge">
                <StepIcon className="w-3.5 h-3.5" />
              </div>
              <span className="ws-step-name">{step.label}</span>
              {idx < STEPS.length - 1 && <div className="ws-step-connector" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
