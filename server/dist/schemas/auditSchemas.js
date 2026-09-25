"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsUpdateSchema = exports.feedbackRequestSchema = exports.terminationRequestSchema = exports.llmAuditOutputSchema = exports.llmInstanceVerdictSchema = void 0;
const zod_1 = require("zod");
exports.llmInstanceVerdictSchema = zod_1.z.object({
    instanceId: zod_1.z.string().describe('The unique identifier of the instance'),
    verdict: zod_1.z.enum(['zombie', 'likely-safe', 'needs-review']).describe('FinOps classification verdict'),
    confidence: zod_1.z.number().min(0).max(100).describe('Confidence score between 0 and 100'),
    reasoning: zod_1.z.string().min(5).max(300).describe('Concise one-line explanation justifying the verdict based on metrics and tags'),
    riskLevel: zod_1.z.enum(['low', 'medium', 'high']).describe('Termination operational risk level'),
    recommendedAction: zod_1.z.enum(['terminate', 'keep', 'downscale', 'investigate']).describe('Recommended FinOps action'),
    estimatedMonthlySavings: zod_1.z.number().min(0).describe('Estimated monthly dollar savings if action is taken')
});
exports.llmAuditOutputSchema = zod_1.z.object({
    executiveSummary: zod_1.z.string().min(20).describe('A concise 2-3 sentence executive briefing of fleet waste, key offenders, and immediate savings potential'),
    totalEstimatedMonthlySavings: zod_1.z.number().min(0).describe('Total monthly savings in USD if all flagged zombie instances are terminated'),
    instances: zod_1.z.array(exports.llmInstanceVerdictSchema).min(1).describe('Array of verdicts for each analyzed instance')
});
exports.terminationRequestSchema = zod_1.z.object({
    instanceIds: zod_1.z.array(zod_1.z.string().min(1)).min(1, 'At least one instance ID must be specified'),
    reason: zod_1.z.string().optional().default('Approved via FinOps agent review'),
    operator: zod_1.z.string().optional().default('FinOps Admin')
});
exports.feedbackRequestSchema = zod_1.z.object({
    instanceId: zod_1.z.string().min(1, 'Instance ID is required'),
    reason: zod_1.z.string().min(3, 'Rejection reason must be at least 3 characters'),
    team: zod_1.z.string().min(1, 'Team name is required'),
    manager: zod_1.z.string().min(1, 'Manager name is required'),
    action: zod_1.z.enum(['reject_zombie', 'whitelist', 'schedule_review']).default('reject_zombie')
});
exports.settingsUpdateSchema = zod_1.z.object({
    aiProvider: zod_1.z.enum(['auto', 'gemini', 'openai', 'heuristic']).optional(),
    geminiModel: zod_1.z.string().optional(),
    openaiModel: zod_1.z.string().optional(),
    confidenceThreshold: zod_1.z.number().min(0).max(100).optional(),
    autoProtectProd: zod_1.z.boolean().optional(),
    maxCpuIdleThreshold: zod_1.z.number().min(0).max(50).optional(),
    idleDaysThreshold: zod_1.z.number().min(1).max(365).optional()
});
