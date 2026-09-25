"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogService = void 0;
class AuditLogService {
    logs = [
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
    getLogs() {
        return [...this.logs];
    }
    addLog(entry) {
        const newEntry = {
            ...entry,
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toISOString()
        };
        this.logs.unshift(newEntry);
        return newEntry;
    }
}
exports.auditLogService = new AuditLogService();
