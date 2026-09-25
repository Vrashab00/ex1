"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRouter = void 0;
const express_1 = require("express");
const auditService_js_1 = require("../services/auditService.js");
exports.auditRouter = (0, express_1.Router)();
// POST /api/audit - Trigger fresh AI audit across all active fleet instances
exports.auditRouter.post('/', async (req, res) => {
    try {
        const { provider } = req.body || {};
        const auditResult = await auditService_js_1.auditService.runAudit(provider);
        res.json({
            success: true,
            audit: auditResult
        });
    }
    catch (error) {
        console.error('Audit Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Audit execution failed'
        });
    }
});
// GET /api/audit/latest - Retrieve latest completed audit without re-triggering
exports.auditRouter.get('/latest', (req, res) => {
    const latest = auditService_js_1.auditService.getLatestAudit();
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
