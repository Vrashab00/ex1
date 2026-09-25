import { Router, Request, Response } from 'express';
import { telemetryService } from '../services/telemetryService.js';

export const instancesRouter = Router();

// GET /api/instances - List all servers with telemetry and tags
instancesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const instances = await telemetryService.fetchInstances();
    res.json({
      success: true,
      count: instances.length,
      instances
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch instances telemetry'
    });
  }
});
