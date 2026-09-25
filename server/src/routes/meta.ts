import { Router, Request, Response } from 'express';
import { auditLogService } from '../services/auditLogService.js';
import { auditService } from '../services/auditService.js';
import { telemetryService } from '../services/telemetryService.js';
import { settingsUpdateSchema } from '../schemas/auditSchemas.js';

export const auditLogsRouter = Router();

// GET /api/audit-logs - Retrieve audit timeline
auditLogsRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: auditLogService.getLogs()
  });
});

export const settingsRouter = Router();

// GET /api/settings
settingsRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    settings: auditService.getSettings()
  });
});

// POST /api/settings
settingsRouter.post('/', (req: Request, res: Response) => {
  const parseResult = settingsUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid settings payload',
      details: parseResult.error.format()
    });
  }

  const updated = auditService.updateSettings(parseResult.data);
  return res.json({
    success: true,
    settings: updated,
    message: 'Settings updated successfully'
  });
});

export const demoRouter = Router();

// POST /api/demo/reset - Reset instances to pristine state for live demos
demoRouter.post('/reset', async (req: Request, res: Response) => {
  telemetryService.resetDemo();
  await auditService.runAudit();
  res.json({
    success: true,
    message: 'Demo state reset successfully to 12 pristine instances'
  });
});
