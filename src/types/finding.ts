export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type FindingStatus = 'Potential' | 'Needs Validation' | 'Confirmed' | 'Remediated';

export type FindingCategory =
  | 'Client-Side Security'
  | 'Input / Output Handling'
  | 'Dependency Security'
  | 'Secret Exposure'
  | 'Authentication & Session'
  | 'Authorization & Access Control'
  | 'API Surface & SSRF'
  | 'Security Configuration';

export type CheckStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface SecurityCheckItem {
  id: string;
  name: string;
  category: FindingCategory;
  description: string;
  status: CheckStatus;
  findingCount: number;
  durationMs?: number;
  details?: string;
}

export interface RetestInfo {
  status: 'Not Tested' | 'Testing' | 'Passed' | 'Failed';
  before: string;
  after: string;
  testedAt?: string;
  verificationNotes?: string;
}

export interface SeverityReasoning {
  attackPrecondition: string;
  affectedAsset: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  scopePrivilege: string;
  exploitabilityEvidence: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Requires Human Verification';
}

export interface AIAnalysis {
  summary: string;
  evidenceExplanation: string;
  businessImpact: string;
  stepByStepRemediation: string[];
  suggestedCodeFix?: string;
  draftReportText: string;
  analyzedAt: string;
}

export interface SecurityFinding {
  id: string;
  title: string;
  severity: Severity;
  category: FindingCategory;
  status: FindingStatus;
  affectedComponent: string;
  location: string;
  description: string;
  evidence: string[];
  reproduction: string[];
  impact: string;
  remediation: string;
  retest: RetestInfo;
  isDemo: boolean;
  severityReasoning: SeverityReasoning;
  aiAnalysis?: AIAnalysis;
  inReport?: boolean;
}

export type AgentStage =
  | 'idle'
  | 'understand_target'
  | 'plan_checks'
  | 'running_checks'
  | 'observe_evidence'
  | 'evaluate'
  | 'ready_for_validation'
  | 'completed';
