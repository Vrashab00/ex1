import { AuditLogEntry } from '../types/index.js';

class AuditLogService {
  private logs: AuditLogEntry[] = [
    {
      id: 'log-seed-01',
      timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
      action: 'recommendation_rejected',
      summary: 'Manager rejected termination of qa-e2e-cypress-matrix-agent-04',
      operator: 'David Chen (QA Lead)',
      instanceIds: ['inst-aws-qa-e2e-runner-08'],
      costImpactDelta: 0,
      metadata: { reason: 'Dedicated runner for nightly Cypress regressions' }
    },
    {
      id: 'log-seed-02',
      timestamp: new Date(Date.now() - 14 * 86400000).toISOString(),
      action: 'instances_terminated',
      summary: 'Terminated 2 abandoned staging Kubernetes nodes',
      operator: 'Automated FinOps Policy',
      instanceIds: ['inst-aws-old-stage-01', 'inst-aws-old-stage-02'],
      costImpactDelta: -380,
      metadata: { totalMonthlySaved: 380 }
    }
  ];

  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  addLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(newEntry);
    return newEntry;
  }
}

export const auditLogService = new AuditLogService();
