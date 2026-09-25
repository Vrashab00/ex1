import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { instancesRouter } from './routes/instances.js';
import { auditRouter } from './routes/audit.js';
import { terminateRouter } from './routes/terminate.js';
import { feedbackRouter } from './routes/feedback.js';
import { auditLogsRouter, settingsRouter, demoRouter } from './routes/meta.js';
import { chatRouter } from './routes/chat.js';
import { auditService } from './services/auditService.js';

const app = express();

const corsOriginEnv = config.corsOrigin;

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (health checks, server-to-server)
    if (!origin) return callback(null, true);

    // If configured to wildcard or empty, allow all origins
    if (!corsOriginEnv || corsOriginEnv === '*' || corsOriginEnv.includes('*')) {
      return callback(null, true);
    }

    const allowed = corsOriginEnv.split(',').map(s => s.trim().toLowerCase());
    const originLower = origin.toLowerCase();

    const isAllowed = allowed.some(pattern => {
      if (pattern === '*' || pattern === originLower) return true;
      if (pattern.startsWith('*.') && originLower.endsWith(pattern.slice(1))) return true;
      return false;
    });

    if (isAllowed) return callback(null, true);

    // Development fallback for localhost
    if (config.nodeEnv !== 'production' && (originLower.includes('localhost') || originLower.includes('127.0.0.1'))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'FinOps AI Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Core routes
app.use('/api/instances', instancesRouter);
app.use('/api/audit', auditRouter);
app.use('/api/terminate', terminateRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/demo', demoRouter);
app.use('/api/chat', chatRouter);

// Start server
app.listen(config.port, '0.0.0.0', async () => {
  console.log(`🚀 FinOps AI server running on port ${config.port} (0.0.0.0)`);
  console.log(`🤖 AI Provider mode: ${config.aiProvider}`);
  
  // Seed initial audit in background
  try {
    console.log('🔍 Executing initial fleet FinOps audit...');
    const initialAudit = await auditService.runAudit();
    console.log(`✅ Initial audit ready: ${initialAudit.zombiesCount} zombies identified. $${initialAudit.totalMonthlyWaste.toLocaleString()}/mo potential savings.`);
  } catch (err: any) {
    console.error('⚠️ Initial audit initialization warning:', err.message);
  }
});

export default app;

