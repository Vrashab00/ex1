"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_js_1 = require("./config.js");
const instances_js_1 = require("./routes/instances.js");
const audit_js_1 = require("./routes/audit.js");
const terminate_js_1 = require("./routes/terminate.js");
const feedback_js_1 = require("./routes/feedback.js");
const meta_js_1 = require("./routes/meta.js");
const chat_js_1 = require("./routes/chat.js");
const auditService_js_1 = require("./services/auditService.js");
const app = (0, express_1.default)();
const corsOriginEnv = config_js_1.config.corsOrigin;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow non-browser requests (health checks, server-to-server)
        if (!origin)
            return callback(null, true);
        // If configured to wildcard or empty, allow all origins
        if (!corsOriginEnv || corsOriginEnv === '*' || corsOriginEnv.includes('*')) {
            return callback(null, true);
        }
        const allowed = corsOriginEnv.split(',').map(s => s.trim().toLowerCase());
        const originLower = origin.toLowerCase();
        const isAllowed = allowed.some(pattern => {
            if (pattern === '*' || pattern === originLower)
                return true;
            if (pattern.startsWith('*.') && originLower.endsWith(pattern.slice(1)))
                return true;
            return false;
        });
        if (isAllowed)
            return callback(null, true);
        // Development fallback for localhost
        if (config_js_1.config.nodeEnv !== 'production' && (originLower.includes('localhost') || originLower.includes('127.0.0.1'))) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
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
app.use('/api/instances', instances_js_1.instancesRouter);
app.use('/api/audit', audit_js_1.auditRouter);
app.use('/api/terminate', terminate_js_1.terminateRouter);
app.use('/api/feedback', feedback_js_1.feedbackRouter);
app.use('/api/audit-logs', meta_js_1.auditLogsRouter);
app.use('/api/settings', meta_js_1.settingsRouter);
app.use('/api/demo', meta_js_1.demoRouter);
app.use('/api/chat', chat_js_1.chatRouter);
// Start server
app.listen(config_js_1.config.port, '0.0.0.0', async () => {
    console.log(`🚀 FinOps AI server running on port ${config_js_1.config.port} (0.0.0.0)`);
    console.log(`🤖 AI Provider mode: ${config_js_1.config.aiProvider}`);
    // Seed initial audit in background
    try {
        console.log('🔍 Executing initial fleet FinOps audit...');
        const initialAudit = await auditService_js_1.auditService.runAudit();
        console.log(`✅ Initial audit ready: ${initialAudit.zombiesCount} zombies identified. $${initialAudit.totalMonthlyWaste.toLocaleString()}/mo potential savings.`);
    }
    catch (err) {
        console.error('⚠️ Initial audit initialization warning:', err.message);
    }
});
exports.default = app;
