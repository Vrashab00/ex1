import { z } from 'zod';

export const llmInstanceVerdictSchema = z.object({
  instanceId: z.string().describe('The unique identifier of the instance'),
  verdict: z.enum(['zombie', 'likely-safe', 'needs-review']).describe('FinOps classification verdict'),
  confidence: z.number().min(0).max(100).describe('Confidence score between 0 and 100'),
  reasoning: z.string().min(5).max(300).describe('Concise one-line explanation justifying the verdict based on metrics and tags'),
  riskLevel: z.enum(['low', 'medium', 'high']).describe('Termination operational risk level'),
  recommendedAction: z.enum(['terminate', 'keep', 'downscale', 'investigate']).describe('Recommended FinOps action'),
  estimatedMonthlySavings: z.number().min(0).describe('Estimated monthly dollar savings if action is taken')
});

export const llmAuditOutputSchema = z.object({
  executiveSummary: z.string().min(20).describe('A concise 2-3 sentence executive briefing of fleet waste, key offenders, and immediate savings potential'),
  totalEstimatedMonthlySavings: z.number().min(0).describe('Total monthly savings in USD if all flagged zombie instances are terminated'),
  instances: z.array(llmInstanceVerdictSchema).min(1).describe('Array of verdicts for each analyzed instance')
});

export type LLMInstanceVerdict = z.infer<typeof llmInstanceVerdictSchema>;
export type LLMAuditOutput = z.infer<typeof llmAuditOutputSchema>;

export const terminationRequestSchema = z.object({
  instanceIds: z.array(z.string().min(1)).min(1, 'At least one instance ID must be specified'),
  reason: z.string().optional().default('Approved via FinOps agent review'),
  operator: z.string().optional().default('FinOps Admin')
});

export const feedbackRequestSchema = z.object({
  instanceId: z.string().min(1, 'Instance ID is required'),
  reason: z.string().min(3, 'Rejection reason must be at least 3 characters'),
  team: z.string().min(1, 'Team name is required'),
  manager: z.string().min(1, 'Manager name is required'),
  action: z.enum(['reject_zombie', 'whitelist', 'schedule_review']).default('reject_zombie')
});

export const settingsUpdateSchema = z.object({
  aiProvider: z.enum(['auto', 'gemini', 'openai', 'heuristic']).optional(),
  geminiModel: z.string().optional(),
  openaiModel: z.string().optional(),
  confidenceThreshold: z.number().min(0).max(100).optional(),
  autoProtectProd: z.boolean().optional(),
  maxCpuIdleThreshold: z.number().min(0).max(50).optional(),
  idleDaysThreshold: z.number().min(1).max(365).optional()
});
