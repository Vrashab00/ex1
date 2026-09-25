import { Router, Request, Response } from 'express';
import { feedbackRequestSchema } from '../schemas/auditSchemas.js';
import { feedbackService } from '../services/feedbackService.js';
import { auditLogService } from '../services/auditLogService.js';

export const feedbackRouter = Router();

// GET /api/feedback - List all manager rejection history
feedbackRouter.get('/', (req: Request, res: Response) => {
  const feedbacks = feedbackService.getAllFeedback();
  res.json({
    success: true,
    feedbacks
  });
});

// POST /api/feedback - Log when a manager rejects a flagged instance
feedbackRouter.post('/', (req: Request, res: Response) => {
  try {
    const parseResult = feedbackRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: parseResult.error.format()
      });
    }

    const { instanceId, reason, team, manager, action } = parseResult.data;

    const logged = feedbackService.logFeedback({
      instanceId,
      reason,
      team,
      manager,
      action
    });

    // Record in audit log
    auditLogService.addLog({
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
  } catch (error: any) {
    console.error('Feedback Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to record feedback'
    });
  }
});
