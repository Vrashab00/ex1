"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instancesRouter = void 0;
const express_1 = require("express");
const telemetryService_js_1 = require("../services/telemetryService.js");
exports.instancesRouter = (0, express_1.Router)();
// GET /api/instances - List all servers with telemetry and tags
exports.instancesRouter.get('/', async (req, res) => {
    try {
        const instances = await telemetryService_js_1.telemetryService.fetchInstances();
        res.json({
            success: true,
            count: instances.length,
            instances
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch instances telemetry'
        });
    }
});
