import OpenAI from 'openai';
import { AIProvider, AuditAuditOptions } from './aiProvider.js';
import { InstanceTelemetry } from '../types/index.js';
import { LLMAuditOutput, llmAuditOutputSchema } from '../schemas/auditSchemas.js';
import { buildFinOpsAuditPrompt } from './promptBuilder.js';

export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI';
  private client: OpenAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gpt-4o-mini') {
    if (!apiKey) {
      throw new Error('OpenAI API key is required to initialize OpenAIProvider');
    }
    this.client = new OpenAI({ apiKey });
    this.modelName = modelName;
  }

  async auditFleet(instances: InstanceTelemetry[], options?: AuditAuditOptions): Promise<LLMAuditOutput> {
    const prompt = buildFinOpsAuditPrompt(instances, options);

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
    const validated = llmAuditOutputSchema.parse(parsedJson);
    return validated;
  }
}
