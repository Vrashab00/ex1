"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminateRouter = void 0;
const express_1 = require("express");
const auditSchemas_js_1 = require("../schemas/auditSchemas.js");
const terminationService_js_1 = require("../services/terminationService.js");
exports.terminateRouter = (0, express_1.Router)();
// POST /api/terminate - Accepts approved instance IDs, simulates termination, logs action
exports.terminateRouter.post('/', async (req, res) => {
    try {
        const parseResult = auditSchemas_js_1.terminationRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: parseResult.error.format()
            });
        }
        const { instanceIds, reason, operator } = parseResult.data;
        const forceProduction = Boolean(req.body.forceProduction);
        const result = await terminationService_js_1.terminationService.terminateApprovedInstances({
            instanceIds,
            reason,
            operator,
            forceProduction
        });
        return res.json(result);
    }
    catch (error) {
        console.error('Termination Error:', error);
        return res.status(error.message?.includes('Safety Block') ? 403 : 500).json({
            success: false,
            error: error.message || 'Termination failed'
        });
    }
});
