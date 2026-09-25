"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRouter = void 0;
const express_1 = require("express");
const auditSchemas_js_1 = require("../schemas/auditSchemas.js");
const feedbackService_js_1 = require("../services/feedbackService.js");
const auditLogService_js_1 = require("../services/auditLogService.js");
exports.feedbackRouter = (0, express_1.Router)();
// GET /api/feedback - List all manager rejection history
exports.feedbackRouter.get('/', (req, res) => {
    const feedbacks = feedbackService_js_1.feedbackService.getAllFeedback();
    res.json({
        success: true,
        feedbacks
    });
});
// POST /api/feedback - Log when a manager rejects a flagged instance
exports.feedbackRouter.post('/', (req, res) => {
    try {
        const parseResult = auditSchemas_js_1.feedbackRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: parseResult.error.format()
            });
        }
        const { instanceId, reason, team, manager, action } = parseResult.data;
        const logged = feedbackService_js_1.feedbackService.logFeedback({
            instanceId,
            reason,
            team,
            manager,
            action
        });
        // Record in audit log
        auditLogService_js_1.auditLogService.addLog({
            action: 'recommendation_rejected',
            summary: `Manager ${manager} (${team}) rejected termination for ${logged.instanceName}: "${reason}"`,
            operator: manager,
            instanceIds: [instanceId],
            costImpactDelta: 0,
            metadata: { reason, team, action }
        });
        return res.status(201).json({
            success: true,
            feedback: logged,
            message: 'Feedback recorded successfully. AI will treat this instance cautiously in subsequent audits.'
        });
    }
    catch (error) {
        console.error('Feedback Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to record feedback'
        });
    }
});
