import { Router, Request, Response } from 'express';
import { terminationRequestSchema } from '../schemas/auditSchemas.js';
import { terminationService } from '../services/terminationService.js';

export const terminateRouter = Router();

// POST /api/terminate - Accepts approved instance IDs, simulates termination, logs action
terminateRouter.post('/', async (req: Request, res: Response) => {
  try {
    const parseResult = terminationRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: parseResult.error.format()
      });
    }

    const { instanceIds, reason, operator } = parseResult.data;
    const forceProduction = Boolean(req.body.forceProduction);

    const result = await terminationService.terminateApprovedInstances({
      instanceIds,
      reason,
      operator,
      forceProduction
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Termination Error:', error);
    return res.status(error.message?.includes('Safety Block') ? 403 : 500).json({
      success: false,
      error: error.message || 'Termination failed'
    });
  }
});
