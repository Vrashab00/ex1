"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIProvider = getAIProvider;
const geminiProvider_js_1 = require("./geminiProvider.js");
const openaiProvider_js_1 = require("./openaiProvider.js");
const mockRuleEngineProvider_js_1 = require("./mockRuleEngineProvider.js");
const config_js_1 = require("../config.js");
function getAIProvider(preferredProvider) {
    const choice = (preferredProvider || config_js_1.config.aiProvider).toLowerCase();
    if (choice === 'gemini') {
        if (config_js_1.config.geminiApiKey) {
            return new geminiProvider_js_1.GeminiProvider(config_js_1.config.geminiApiKey, config_js_1.config.geminiModel);
        }
        else {
            console.warn('⚠️ Gemini requested but GEMINI_API_KEY is not configured. Falling back to Heuristic Engine.');
            return new mockRuleEngineProvider_js_1.MockRuleEngineProvider();
        }
    }
    if (choice === 'openai') {
        if (config_js_1.config.openaiApiKey) {
            return new openaiProvider_js_1.OpenAIProvider(config_js_1.config.openaiApiKey, config_js_1.config.openaiModel);
        }
        else {
            console.warn('⚠️ OpenAI requested but OPENAI_API_KEY is not configured. Falling back to Heuristic Engine.');
            return new mockRuleEngineProvider_js_1.MockRuleEngineProvider();
        }
    }
    if (choice === 'auto') {
        // If Gemini key exists, default to Gemini
        if (config_js_1.config.geminiApiKey) {
            return new geminiProvider_js_1.GeminiProvider(config_js_1.config.geminiApiKey, config_js_1.config.geminiModel);
        }
        // Else if OpenAI key exists, use OpenAI
        if (config_js_1.config.openaiApiKey) {
            return new openaiProvider_js_1.OpenAIProvider(config_js_1.config.openaiApiKey, config_js_1.config.openaiModel);
        }
        // Otherwise use built-in heuristic provider
        return new mockRuleEngineProvider_js_1.MockRuleEngineProvider();
    }
    return new mockRuleEngineProvider_js_1.MockRuleEngineProvider();
}
