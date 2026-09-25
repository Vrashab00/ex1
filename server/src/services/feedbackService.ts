import { RejectionFeedback } from '../types/index.js';
import { telemetryService } from './telemetryService.js';

class FeedbackService {
  private feedbackStore: RejectionFeedback[] = [
    {
      id: 'fb-seed-01',
      instanceId: 'inst-aws-qa-e2e-runner-08',
      instanceName: 'qa-e2e-cypress-matrix-agent-04',
      team: 'qa-automation',
      manager: 'David Chen (QA Lead)',
      reason: 'Dedicated runner for nightly Cypress regressions. Low daytime CPU is expected by design.',
      action: 'reject_zombie',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  ];

  getAllFeedback(): RejectionFeedback[] {
    return [...this.feedbackStore];
  }

  getFeedbackForInstance(instanceId: string): RejectionFeedback | undefined {
    return this.feedbackStore.find(f => f.instanceId === instanceId);
  }

  logFeedback(data: {
    instanceId: string;
    reason: string;
    team: string;
    manager: string;
    action?: 'reject_zombie' | 'whitelist' | 'schedule_review';
  }): RejectionFeedback {
    // Look up instance name
    const instances = (telemetryService as any).instances || [];
    const target = instances.find((i: any) => i.id === data.instanceId);
    const instanceName = target ? target.name : data.instanceId;

    const newFeedback: RejectionFeedback = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      instanceId: data.instanceId,
      instanceName,
      team: data.team,
      manager: data.manager,
      reason: data.reason,
      action: data.action || 'reject_zombie',
      createdAt: new Date().toISOString()
    };

    this.feedbackStore.unshift(newFeedback);
    // Link directly onto the instance telemetry
    telemetryService.setInstanceFeedback(data.instanceId, newFeedback);

    return newFeedback;
  }
}

export const feedbackService = new FeedbackService();
