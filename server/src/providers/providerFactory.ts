import { AIProvider } from './aiProvider.js';
import { GeminiProvider } from './geminiProvider.js';
import { OpenAIProvider } from './openaiProvider.js';
import { MockRuleEngineProvider } from './mockRuleEngineProvider.js';
import { config } from '../config.js';

export function getAIProvider(preferredProvider?: string): AIProvider {
  const choice = (preferredProvider || config.aiProvider).toLowerCase();

  if (choice === 'gemini') {
    if (config.geminiApiKey) {
      return new GeminiProvider(config.geminiApiKey, config.geminiModel);
    } else {
      console.warn('⚠️ Gemini requested but GEMINI_API_KEY is not configured. Falling back to Heuristic Engine.');
      return new MockRuleEngineProvider();
    }
  }

  if (choice === 'openai') {
    if (config.openaiApiKey) {
      return new OpenAIProvider(config.openaiApiKey, config.openaiModel);
    } else {
      console.warn('⚠️ OpenAI requested but OPENAI_API_KEY is not configured. Falling back to Heuristic Engine.');
      return new MockRuleEngineProvider();
    }
  }

  if (choice === 'auto') {
    // If Gemini key exists, default to Gemini
    if (config.geminiApiKey) {
      return new GeminiProvider(config.geminiApiKey, config.geminiModel);
    }
    // Else if OpenAI key exists, use OpenAI
    if (config.openaiApiKey) {
      return new OpenAIProvider(config.openaiApiKey, config.openaiModel);
    }
    // Otherwise use built-in heuristic provider
    return new MockRuleEngineProvider();
  }

  return new MockRuleEngineProvider();
}
