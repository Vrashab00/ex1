import { GoogleGenAI } from '@google/genai';
import { AIProvider, AuditAuditOptions } from './aiProvider.js';
import { InstanceTelemetry } from '../types/index.js';
import { LLMAuditOutput, llmAuditOutputSchema } from '../schemas/auditSchemas.js';
import { buildFinOpsAuditPrompt } from './promptBuilder.js';

export class GeminiProvider implements AIProvider {
  readonly name = 'Google Gemini (Official SDK)';
  private ai: GoogleGenAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-3.5-flash-lite') {
    if (!apiKey) {
      throw new Error('Gemini API key is required to initialize GeminiProvider');
    }
    this.ai = new GoogleGenAI({ apiKey });
    this.modelName = modelName;
  }

  async auditFleet(instances: InstanceTelemetry[], options?: AuditAuditOptions): Promise<LLMAuditOutput> {
    const prompt = buildFinOpsAuditPrompt(instances, options);

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
    const validated = llmAuditOutputSchema.parse(parsedJson);
    return validated;
  }
}
