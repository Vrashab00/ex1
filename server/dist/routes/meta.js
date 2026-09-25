"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoRouter = exports.settingsRouter = exports.auditLogsRouter = void 0;
const express_1 = require("express");
const auditLogService_js_1 = require("../services/auditLogService.js");
const auditService_js_1 = require("../services/auditService.js");
const telemetryService_js_1 = require("../services/telemetryService.js");
const auditSchemas_js_1 = require("../schemas/auditSchemas.js");
exports.auditLogsRouter = (0, express_1.Router)();
// GET /api/audit-logs - Retrieve audit timeline
exports.auditLogsRouter.get('/', (req, res) => {
    res.json({
        success: true,
        logs: auditLogService_js_1.auditLogService.getLogs()
    });
});
exports.settingsRouter = (0, express_1.Router)();
// GET /api/settings
exports.settingsRouter.get('/', (req, res) => {
    res.json({
        success: true,
        settings: auditService_js_1.auditService.getSettings()
    });
});
// POST /api/settings
exports.settingsRouter.post('/', (req, res) => {
    const parseResult = auditSchemas_js_1.settingsUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            success: false,
            error: 'Invalid settings payload',
            details: parseResult.error.format()
        });
    }
    const updated = auditService_js_1.auditService.updateSettings(parseResult.data);
    return res.json({
        success: true,
        settings: updated,
        message: 'Settings updated successfully'
    });
});
exports.demoRouter = (0, express_1.Router)();
// POST /api/demo/reset - Reset instances to pristine state for live demos
exports.demoRouter.post('/reset', async (req, res) => {
    telemetryService_js_1.telemetryService.resetDemo();
    await auditService_js_1.auditService.runAudit();
    res.json({
        success: true,
        message: 'Demo state reset successfully to 12 pristine instances'
    });
});
