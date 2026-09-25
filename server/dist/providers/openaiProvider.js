"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
const auditSchemas_js_1 = require("../schemas/auditSchemas.js");
const promptBuilder_js_1 = require("./promptBuilder.js");
class OpenAIProvider {
    name = 'OpenAI';
    client;
    modelName;
    constructor(apiKey, modelName = 'gpt-4o-mini') {
        if (!apiKey) {
            throw new Error('OpenAI API key is required to initialize OpenAIProvider');
        }
        this.client = new openai_1.default({ apiKey });
        this.modelName = modelName;
    }
    async auditFleet(instances, options) {
        const prompt = (0, promptBuilder_js_1.buildFinOpsAuditPrompt)(instances, options);
        const completion = await this.client.chat.completions.create({
            model: this.modelName,
            messages: [
                {
                    role: 'system',
                    content: 'You are an autonomous FinOps AI specialized in cloud waste analysis. You output exclusively strict JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
        });
        const text = completion.choices[0]?.message?.content || '';
        if (!text) {
            throw new Error('Empty response received from OpenAI API');
        }
        const parsedJson = JSON.parse(text);
        // Strict Zod validation
        const validated = auditSchemas_js_1.llmAuditOutputSchema.parse(parsedJson);
        return validated;
    }
}
exports.OpenAIProvider = OpenAIProvider;
