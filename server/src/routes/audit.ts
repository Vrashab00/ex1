import { Router, Request, Response } from 'express';
import { auditService } from '../services/auditService.js';

export const auditRouter = Router();

// POST /api/audit - Trigger fresh AI audit across all active fleet instances
auditRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { provider } = req.body || {};
    const auditResult = await auditService.runAudit(provider);
    res.json({
      success: true,
      audit: auditResult
    });
  } catch (error: any) {
    console.error('Audit Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Audit execution failed'
    });
  }
});

// GET /api/audit/latest - Retrieve latest completed audit without re-triggering
auditRouter.get('/latest', (req: Request, res: Response) => {
  const latest = auditService.getLatestAudit();
  if (!latest) {
    return res.status(404).json({
      success: false,
      message: 'No previous audit found. Run an audit first.'
    });
  }
  return res.json({
    success: true,
    audit: latest
  });
});
