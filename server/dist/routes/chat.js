"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const chatService_js_1 = require("../services/chatService.js");
exports.chatRouter = (0, express_1.Router)();
exports.chatRouter.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message || typeof message !== 'string' || !message.trim()) {
            res.status(400).json({
                success: false,
                error: 'Message string is required in the request body.'
            });
            return;
        }
        const reply = await chatService_js_1.chatService.generateReply(message.trim(), Array.isArray(history) ? history : []);
        res.json({
            success: true,
            reply,
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        console.error('[ChatRouter] Error processing chat request:', err);
        res.status(500).json({
            success: false,
            error: err.message || 'Internal server error processing chat message.'
        });
    }
});
