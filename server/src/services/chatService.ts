import { GoogleGenAI } from '@google/genai';
import { config } from '../config.js';
import { telemetryService } from './telemetryService.js';
import { auditService } from './auditService.js';

export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}

export class ChatService {
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    this.modelName = config.geminiModel || 'gemini-2.5-flash';
    if (config.geminiApiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
      } catch (err: any) {
        console.warn('⚠️ Failed to initialize GoogleGenAI client:', err.message);
      }
    }
  }

  private getClient(): GoogleGenAI | null {
    if (this.ai) return this.ai;
    if (config.geminiApiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
        return this.ai;
      } catch {
        return null;
      }
    }
    return null;
  }

  async generateReply(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    const client = this.getClient();

    // Fetch active fleet telemetry context to make the bot context-aware
    const instances = await telemetryService.fetchInstances();
    const activeAudit = auditService.getLatestAudit();
    const totalWaste = activeAudit?.totalMonthlyWaste || 0;
    const zombiesCount = activeAudit?.zombiesCount || 0;

    const fleetSummaryContext = `
Current Monitored Fleet State:
- Total Cloud Instances: ${instances.length}
- Identified Zombies / Waste Candidates: ${zombiesCount}
- Monthly Recurring Waste Detected: $${totalWaste.toLocaleString()}/mo
- Cloud Providers in Fleet: AWS, GCP, Azure
- Key Principles: Read-only telemetry, Zero access to payloads/secrets, Safety freeze on env:prod, 14-day 3x ROI money-back guarantee.
- Pricing: Basic Plan ($49/mo or $39/mo annual), Pro Plan ($199/mo or $159/mo annual).
`;

    const systemInstruction = `You are FinOps AI, a premier autonomous FinOps intelligence agent and cloud infrastructure cost-optimization expert.
You assist Site Reliability Engineers, DevOps leaders, and cloud architects in:
1. Detecting and safely terminating idle/abandoned zombie compute instances across AWS, GCP, and Azure.
2. Explaining CPU, RAM, and network utilization telemetry curves.
3. Enforcing the Zero-Downtime Safety Freeze for production databases and critical workloads.
4. Explaining pricing plans (Basic and Pro plans with 20% annual discount) and terms of service.
5. Helping review and reject false-positive flags using our manager feedback loops.

Guidelines:
- Keep responses concise, clear, and direct. Use markdown bullet points and code blocks where helpful.
- Maintain a modern, sophisticated, and technically authoritative tone.
- Reference the current fleet data when relevant:
${fleetSummaryContext}`;

    if (!client) {
      // Fallback response if GEMINI_API_KEY is not yet populated
      return this.generateFallbackResponse(userMessage, instances.length, totalWaste);
    }

    try {
      // Clean and format history to ensure valid format for @google/genai
      const validHistory = (history || [])
        .filter(item => (item.role === 'user' || item.role === 'model') && item.parts && item.parts.length > 0)
        .map(item => ({
          role: item.role,
          parts: item.parts.map(p => ({ text: p.text || '' }))
        }));

      // Append current user message
      const contents = [
        ...validHistory,
        {
          role: 'user' as const,
          parts: [{ text: userMessage }]
        }
      ];

      // Robust model fallback candidate list
      const candidateModels = Array.from(new Set([
        this.modelName,
        'gemini-3.5-flash-lite',
        'gemini-3.5-flash',
        'gemini-3.8-flash',
        'gemini-flash-lite-latest'
      ].filter(Boolean)));

      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const response = await client.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            }
          });

          const reply = response.text || '';
          if (reply) {
            return reply;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[ChatService] Model ${model} failed, trying next candidate:`, err.message?.slice(0, 100));
        }
      }

      if (lastError) {
        throw lastError;
      }

      throw new Error('All Gemini model candidates failed to return a response.');
    } catch (err: any) {
      console.error('[ChatService] Gemini API call error:', err.message);

      // Handle common API quota or network errors gracefully
      if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('403')) {
        return `⚠️ The configured Gemini API key appears invalid or expired. Please check your \`GEMINI_API_KEY\` in your \`.env\` file. In the meantime, I can still answer basic questions about your current fleet: you have ${instances.length} monitored instances with $${totalWaste.toLocaleString()}/mo potential savings.`;
      }

      if (err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('429')) {
        return `⚠️ Gemini API rate limit or quota exceeded. Please wait a moment before asking again. Current fleet state: $${totalWaste.toLocaleString()}/mo in potential savings identified.`;
      }

      // Fallback response
      return this.generateFallbackResponse(userMessage, instances.length, totalWaste);
    }
  }

  private generateFallbackResponse(userMessage: string, totalInstances: number, totalWaste: number): string {
    const q = userMessage.toLowerCase();

    if (q.includes('price') || q.includes('cost') || q.includes('plan')) {
      return `FinOps AI offers two core tiers:
- **Basic Plan**: $49/mo (or $39/mo billed annually) for up to 25 cloud instances, weekly automated zombie scans, and single-cloud monitoring.
- **Pro Plan**: $199/mo (or $159/mo billed annually) for unlimited instances, real-time telemetry curves, 1-click batch safe termination, manager feedback AI learning loops, and priority SLA.
Both plans include our **14-day 3x ROI money-back guarantee**.`;
    }

    if (q.includes('zombie') || q.includes('waste') || q.includes('audit')) {
      return `Our autonomous agent is currently monitoring **${totalInstances} cloud instances** and has identified **$${totalWaste.toLocaleString()}/mo** in dormant compute waste. You can view each specimen's CPU/RAM curves and execute safe batch termination directly in the fleet dashboard.`;
    }

    if (q.includes('production') || q.includes('safety') || q.includes('downtime')) {
      return `Our **Zero-Downtime Guarantee** ensures all instances tagged with \`env:production\` are safeguarded by a safety freeze. They cannot be terminated without explicit two-factor administrative confirmation.`;
    }

    return `Hello! I am FinOps AI, your autonomous FinOps copilot. I am monitoring your fleet of **${totalInstances} instances** with **$${totalWaste.toLocaleString()}/mo** in potential savings. How can I assist you with cloud cost optimization, telemetry analysis, or infrastructure policies today?`;
  }
}

export const chatService = new ChatService();
