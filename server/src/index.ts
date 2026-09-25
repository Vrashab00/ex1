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

app.use(cors({
  origin: '*', // Allow frontend development server
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
app.listen(config.port, async () => {
  console.log(`🚀 FinOps AI server running on http://localhost:${config.port}`);
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
