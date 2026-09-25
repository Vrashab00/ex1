"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackService = void 0;
const telemetryService_js_1 = require("./telemetryService.js");
class FeedbackService {
    feedbackStore = [
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
    getAllFeedback() {
        return [...this.feedbackStore];
    }
    getFeedbackForInstance(instanceId) {
        return this.feedbackStore.find(f => f.instanceId === instanceId);
    }
    logFeedback(data) {
        // Look up instance name
        const instances = telemetryService_js_1.telemetryService.instances || [];
        const target = instances.find((i) => i.id === data.instanceId);
        const instanceName = target ? target.name : data.instanceId;
        const newFeedback = {
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
        telemetryService_js_1.telemetryService.setInstanceFeedback(data.instanceId, newFeedback);
        return newFeedback;
    }
}
exports.feedbackService = new FeedbackService();
