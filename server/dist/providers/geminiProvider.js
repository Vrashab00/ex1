"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const genai_1 = require("@google/genai");
const auditSchemas_js_1 = require("../schemas/auditSchemas.js");
const promptBuilder_js_1 = require("./promptBuilder.js");
class GeminiProvider {
    name = 'Google Gemini (Official SDK)';
    ai;
    modelName;
    constructor(apiKey, modelName = 'gemini-3.5-flash-lite') {
        if (!apiKey) {
            throw new Error('Gemini API key is required to initialize GeminiProvider');
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey });
        this.modelName = modelName;
    }
    async auditFleet(instances, options) {
        const prompt = (0, promptBuilder_js_1.buildFinOpsAuditPrompt)(instances, options);
        const response = await this.ai.models.generateContent({
            model: this.modelName,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.2
            }
        });
        const text = response.text || '';
        if (!text) {
            throw new Error('Empty response received from Gemini API');
        }
        const parsedJson = JSON.parse(text);
        // Strict Zod validation
        const validated = auditSchemas_js_1.llmAuditOutputSchema.parse(parsedJson);
        return validated;
    }
}
exports.GeminiProvider = GeminiProvider;
