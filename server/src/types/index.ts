export type CloudProvider = 'aws' | 'gcp' | 'azure';

export type InstanceStatus = 'running' | 'stopped' | 'terminated';

export type AuditVerdict = 'zombie' | 'likely-safe' | 'needs-review';

export type RiskLevel = 'low' | 'medium' | 'high';

export type RecommendedAction = 'terminate' | 'keep' | 'downscale' | 'investigate';

export interface TelemetryPoint {
  timestamp: string;
  value: number; // percentage or metric value
}

export interface RejectionFeedback {
  id: string;
  instanceId: string;
  instanceName: string;
  team: string;
  manager: string;
  reason: string;
  action: 'reject_zombie' | 'whitelist' | 'schedule_review';
  createdAt: string;
}

export interface InstanceTelemetry {
  id: string;
  name: string;
  provider: CloudProvider;
  region: string;
  instanceType: string;
  monthlyCost: number;
  cpuAvg: number; // 0 - 100
  cpuPeak: number;
  memoryAvg: number; // 0 - 100
  memoryPeak: number;
  networkIoMbPerDay: number;
  diskIoOpsPerSec: number;
  lastDeployDate: string;
  lastActiveDate: string;
  tags: Record<string, string>;
  status: InstanceStatus;
  cpuHistory: number[]; // e.g. 12 data points
  memoryHistory: number[];
  previousFeedback?: RejectionFeedback;
}

export interface InstanceAuditResult {
  instanceId: string;
  instanceName: string;
  verdict: AuditVerdict;
  confidence: number; // 0 - 100
  reasoning: string;
  riskLevel: RiskLevel;
  recommendedAction: RecommendedAction;
  monthlySavings: number;
  estimatedMonthlySavings?: number;
}

export interface AuditResponse {
  auditId: string;
  executiveSummary: string;
  totalMonthlyWaste: number;
  totalCurrentSpend: number;
  totalInstancesAudited: number;
  zombiesCount: number;
  needsReviewCount: number;
  safeCount: number;
  perInstance: InstanceAuditResult[];
  generatedAt: string;
  providerUsed: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'audit_performed' | 'instances_terminated' | 'recommendation_rejected';
  summary: string;
  operator: string;
  instanceIds: string[];
  costImpactDelta: number;
  metadata?: Record<string, any>;
}

export interface AppSettings {
  aiProvider: 'auto' | 'gemini' | 'openai' | 'heuristic';
  geminiModel: string;
  openaiModel: string;
  confidenceThreshold: number; // e.g. 80
  autoProtectProd: boolean;
  maxCpuIdleThreshold: number; // e.g. 5%
  idleDaysThreshold: number; // e.g. 14 days
}
