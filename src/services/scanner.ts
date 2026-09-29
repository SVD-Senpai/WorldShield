import type { SecurityCheckItem, SecurityFinding } from '../types/finding';
import { DEMO_FINDINGS, INITIAL_CHECKS } from '../data/demoFindings';

export interface ScanProgressCallback {
  onCheckUpdate: (updatedChecks: SecurityCheckItem[]) => void;
  onFindingsDiscovered: (findings: SecurityFinding[]) => void;
  onStageChange: (stageMessage: string) => void;
}

export class ScannerService {
  private checks: SecurityCheckItem[] = JSON.parse(JSON.stringify(INITIAL_CHECKS));
  private isScanning = false;

  public getChecks(): SecurityCheckItem[] {
    return [...this.checks];
  }

  public resetChecks(): SecurityCheckItem[] {
    this.checks = JSON.parse(JSON.stringify(INITIAL_CHECKS));
    return this.checks;
  }

  /**
   * Executes the assessment pipeline across all target surfaces.
   * Visibly transitions checks: idle -> running -> completed.
   */
  public async runAssessment(callbacks: ScanProgressCallback): Promise<{
    checks: SecurityCheckItem[];
    findings: SecurityFinding[];
  }> {
    if (this.isScanning) {
      return { checks: this.checks, findings: [] };
    }

    this.isScanning = true;
    callbacks.onStageChange('Initializing Target Scope: Local Authorized World Monitor (Node/Vite/TS)');

    // Reset checks to idle
    this.checks = this.checks.map((chk) => ({ ...chk, status: 'idle', findingCount: 0 }));
    callbacks.onCheckUpdate([...this.checks]);

    const discoveredFindings: SecurityFinding[] = [];

    for (let i = 0; i < this.checks.length; i++) {
      const check = this.checks[i];

      // Mark running
      check.status = 'running';
      callbacks.onCheckUpdate([...this.checks]);
      callbacks.onStageChange(`Executing Check [${i + 1}/${this.checks.length}]: ${check.name}...`);

      // Simulated realistic execution delay for the demo visualization (350ms - 500ms)
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Match demo findings associated with this category
      const matched = DEMO_FINDINGS.filter((f) => f.category === check.category);
      check.findingCount = matched.length;
      check.status = 'completed';
      check.durationMs = Math.floor(Math.random() * 120) + 180;

      if (matched.length > 0) {
        discoveredFindings.push(...matched.map((f) => JSON.parse(JSON.stringify(f))));
        callbacks.onFindingsDiscovered([...discoveredFindings]);
      }

      callbacks.onCheckUpdate([...this.checks]);
    }

    callbacks.onStageChange('Assessment Pipeline Complete. Candidate findings ready for human validation.');
    this.isScanning = false;

    return {
      checks: this.checks,
      findings: discoveredFindings
    };
  }
}

export const scannerService = new ScannerService();
