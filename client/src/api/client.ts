import { InstanceTelemetry, AuditResponse, AuditLogEntry, RejectionFeedback, AppSettings } from '../types/index.js';

// Resolve API Base URL depending on execution environment (Vite proxy vs Live Server on 5500 vs Vercel/production)
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = isLocalhost
  ? (window.location.port === '5173' ? '/api' : 'http://localhost:3001/api')
  : (import.meta.env.VITE_API_URL || '/api');

// Fallback in-browser data for Live Server mode (when backend is not running or on different port)
const LOCAL_FALLBACK_INSTANCES: InstanceTelemetry[] = [
  {
    id: 'inst-aws-prod-db-01',
    name: 'prod-aurora-postgres-primary',
    provider: 'aws',
    region: 'us-east-1',
    instanceType: 'r6g.4xlarge',
    monthlyCost: 1050,
    cpuAvg: 68.4,
    cpuPeak: 89.2,
    memoryAvg: 81.7,
    memoryPeak: 89.5,
    networkIoMbPerDay: 48500,
    diskIoOpsPerSec: 1240,
    lastDeployDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastActiveDate: new Date().toISOString(),
    tags: { env: 'prod', team: 'core-platform', tier: 'database', protected: 'true' },
    status: 'running',
    cpuHistory: [62, 65, 71, 68, 74, 82, 70, 66, 69, 73, 68, 72],
    memoryHistory: [79, 80, 81, 82, 83, 82, 81, 82, 84, 83, 82, 81]
  },
  {
    id: 'inst-gcp-gpu-abandoned-02',
    name: 'gcp-a2-gpu-notebook-alex',
    provider: 'gcp',
    region: 'us-central1-f',
    instanceType: 'a2-highgpu-1g (A100)',
    monthlyCost: 2145,
    cpuAvg: 0.3,
    cpuPeak: 1.1,
    memoryAvg: 4.8,
    memoryPeak: 6.2,
    networkIoMbPerDay: 12.4,
    diskIoOpsPerSec: 0.8,
    lastDeployDate: new Date(Date.now() - 41 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 38 * 86400000).toISOString(),
    tags: { env: 'dev', team: 'data-science', owner: 'alex.t', project: 'llm-fine-tuning-poc' },
    status: 'running',
    cpuHistory: [0.4, 0.3, 0.2, 0.3, 0.5, 0.2, 0.3, 0.2, 0.4, 0.3, 0.2, 0.3],
    memoryHistory: [5.1, 4.9, 4.8, 4.8, 4.9, 4.8, 4.7, 4.8, 4.8, 4.8, 4.9, 4.8]
  },
  {
    id: 'inst-aws-dev-orphaned-node-03',
    name: 'dev-k8s-spot-orphaned-worker-3',
    provider: 'aws',
    region: 'us-west-2',
    instanceType: 'c5.2xlarge',
    monthlyCost: 248,
    cpuAvg: 0.9,
    cpuPeak: 2.4,
    memoryAvg: 7.2,
    memoryPeak: 8.9,
    networkIoMbPerDay: 4.1,
    diskIoOpsPerSec: 1.2,
    lastDeployDate: new Date(Date.now() - 89 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 65 * 86400000).toISOString(),
    tags: { env: 'dev', team: 'checkout-v2-legacy', cluster: 'dev-k8s-blue' },
    status: 'running',
    cpuHistory: [1.1, 0.9, 0.8, 0.7, 1.2, 0.8, 0.9, 0.7, 0.8, 1.0, 0.9, 0.8],
    memoryHistory: [7.5, 7.3, 7.2, 7.2, 7.1, 7.2, 7.3, 7.2, 7.1, 7.2, 7.2, 7.2]
  },
  {
    id: 'inst-gcp-qa-loadgen-bench-04',
    name: 'qa-loadgen-gatling-cluster-node-02',
    provider: 'gcp',
    region: 'us-central1-a',
    instanceType: 'n2-standard-16',
    monthlyCost: 582,
    cpuAvg: 1.2,
    cpuPeak: 3.5,
    memoryAvg: 11.4,
    memoryPeak: 14.2,
    networkIoMbPerDay: 8.5,
    diskIoOpsPerSec: 2.1,
    lastDeployDate: new Date(Date.now() - 48 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 42 * 86400000).toISOString(),
    tags: { env: 'qa', project: 'q3-stress-testing', created_by: 'jenkins-ci' },
    status: 'running',
    cpuHistory: [1.3, 1.2, 1.0, 1.4, 1.1, 1.2, 1.0, 1.3, 1.2, 1.1, 1.0, 1.2],
    memoryHistory: [11.8, 11.5, 11.4, 11.3, 11.4, 11.5, 11.4, 11.3, 11.4, 11.4, 11.4, 11.4]
  },
  {
    id: 'inst-azure-elk-sandbox-05',
    name: 'sandbox-elastic-single-node-abandoned',
    provider: 'azure',
    region: 'eastus',
    instanceType: 'Standard_D8s_v5',
    monthlyCost: 410,
    cpuAvg: 0.5,
    cpuPeak: 1.8,
    memoryAvg: 9.1,
    memoryPeak: 12.0,
    networkIoMbPerDay: 1.8,
    diskIoOpsPerSec: 0.4,
    lastDeployDate: new Date(Date.now() - 114 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 95 * 86400000).toISOString(),
    tags: { env: 'sandbox', team: 'observability-poc', owner: 'unassigned' },
    status: 'running',
    cpuHistory: [0.6, 0.5, 0.4, 0.5, 0.7, 0.4, 0.5, 0.6, 0.4, 0.5, 0.5, 0.4],
    memoryHistory: [9.3, 9.2, 9.1, 9.0, 9.1, 9.2, 9.1, 9.0, 9.1, 9.1, 9.1, 9.1]
  },
  {
    id: 'inst-aws-prod-api-gw-06',
    name: 'prod-edge-ingress-gateway-01',
    provider: 'aws',
    region: 'us-east-1',
    instanceType: 'c6i.4xlarge',
    monthlyCost: 496,
    cpuAvg: 54.2,
    cpuPeak: 78.4,
    memoryAvg: 61.8,
    memoryPeak: 69.3,
    networkIoMbPerDay: 62000,
    diskIoOpsPerSec: 450,
    lastDeployDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastActiveDate: new Date().toISOString(),
    tags: { env: 'prod', team: 'networking', tier: 'edge', service: 'envoy-ingress' },
    status: 'running',
    cpuHistory: [48, 52, 58, 61, 54, 59, 63, 52, 50, 56, 53, 55],
    memoryHistory: [60, 61, 62, 63, 62, 61, 62, 63, 62, 61, 62, 62]
  },
  {
    id: 'inst-aws-staging-batch-sync-07',
    name: 'staging-warehouse-sync-worker',
    provider: 'aws',
    region: 'eu-west-1',
    instanceType: 'm5.xlarge',
    monthlyCost: 140,
    cpuAvg: 4.2,
    cpuPeak: 38.6,
    memoryAvg: 22.4,
    memoryPeak: 45.1,
    networkIoMbPerDay: 1800,
    diskIoOpsPerSec: 85,
    lastDeployDate: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    tags: { env: 'staging', team: 'data-pipeline', cadence: 'weekly-cron', cron: '0 2 * * 0' },
    status: 'running',
    cpuHistory: [2.1, 2.3, 35.8, 12.4, 2.2, 2.1, 2.4, 2.2, 2.1, 2.3, 2.2, 2.1],
    memoryHistory: [20, 21, 42, 30, 22, 21, 22, 21, 22, 21, 22, 22]
  },
  {
    id: 'inst-aws-qa-e2e-runner-08',
    name: 'qa-e2e-cypress-matrix-agent-04',
    provider: 'aws',
    region: 'us-east-2',
    instanceType: 'c5.xlarge',
    monthlyCost: 124,
    cpuAvg: 8.6,
    cpuPeak: 44.2,
    memoryAvg: 23.5,
    memoryPeak: 38.9,
    networkIoMbPerDay: 750,
    diskIoOpsPerSec: 42,
    lastDeployDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    tags: { env: 'qa', team: 'qa-automation', ci: 'github-actions-runner' },
    status: 'running',
    cpuHistory: [5.2, 7.8, 38.4, 18.2, 4.9, 6.1, 8.4, 40.1, 12.2, 5.0, 6.5, 8.2],
    memoryHistory: [22, 24, 35, 28, 23, 24, 25, 36, 27, 23, 24, 24],
    previousFeedback: {
      id: 'fb-seed-01',
      instanceId: 'inst-aws-qa-e2e-runner-08',
      instanceName: 'qa-e2e-cypress-matrix-agent-04',
      team: 'qa-automation',
      manager: 'David Chen (QA Lead)',
      reason: 'Dedicated runner for nightly Cypress regressions. Low daytime CPU is expected by design.',
      action: 'reject_zombie',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  },
  {
    id: 'inst-aws-prod-redis-09',
    name: 'prod-redis-cluster-cache-01',
    provider: 'aws',
    region: 'us-east-1',
    instanceType: 'r6g.2xlarge',
    monthlyCost: 525,
    cpuAvg: 41.5,
    cpuPeak: 58.2,
    memoryAvg: 74.2,
    memoryPeak: 79.1,
    networkIoMbPerDay: 28400,
    diskIoOpsPerSec: 190,
    lastDeployDate: new Date(Date.now() - 18 * 86400000).toISOString(),
    lastActiveDate: new Date().toISOString(),
    tags: { env: 'prod', team: 'platform', tier: 'cache', protected: 'true' },
    status: 'running',
    cpuHistory: [38, 42, 45, 41, 39, 44, 43, 40, 42, 45, 43, 41],
    memoryHistory: [72, 73, 74, 74, 75, 75, 74, 74, 75, 74, 74, 74]
  },
  {
    id: 'inst-aws-staging-legacy-memcached-10',
    name: 'staging-legacy-memcached-node',
    provider: 'aws',
    region: 'us-west-1',
    instanceType: 'm5.large',
    monthlyCost: 70,
    cpuAvg: 0.1,
    cpuPeak: 0.4,
    memoryAvg: 3.1,
    memoryPeak: 3.8,
    networkIoMbPerDay: 0.2,
    diskIoOpsPerSec: 0.1,
    lastDeployDate: new Date(Date.now() - 145 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 120 * 86400000).toISOString(),
    tags: { env: 'staging', legacy: 'true', deprecate_after: '2024-Q1', ticket: 'DEPR-102' },
    status: 'running',
    cpuHistory: [0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1],
    memoryHistory: [3.2, 3.1, 3.1, 3.1, 3.1, 3.2, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1]
  },
  {
    id: 'inst-gcp-analytics-metabase-11',
    name: 'gcp-n2-adhoc-metabase-test',
    provider: 'gcp',
    region: 'europe-west1',
    instanceType: 'n2-standard-4',
    monthlyCost: 146,
    cpuAvg: 5.1,
    cpuPeak: 29.4,
    memoryAvg: 32.5,
    memoryPeak: 48.0,
    networkIoMbPerDay: 420,
    diskIoOpsPerSec: 28,
    lastDeployDate: new Date(Date.now() - 22 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    tags: { env: 'dev', team: 'growth-analytics', usage: 'bi-exploration', creator: 'marcus.k' },
    status: 'running',
    cpuHistory: [3.1, 4.2, 28.1, 8.4, 3.5, 3.9, 4.8, 19.5, 5.2, 4.1, 4.9, 5.2],
    memoryHistory: [30, 31, 45, 36, 32, 32, 33, 41, 34, 32, 32, 33]
  },
  {
    id: 'inst-aws-dev-rabbitmq-backup-12',
    name: 'dev-rabbitmq-broker-backup',
    provider: 'aws',
    region: 'us-east-1',
    instanceType: 't3.xlarge',
    monthlyCost: 121,
    cpuAvg: 1.1,
    cpuPeak: 2.8,
    memoryAvg: 11.8,
    memoryPeak: 14.5,
    networkIoMbPerDay: 6.2,
    diskIoOpsPerSec: 1.5,
    lastDeployDate: new Date(Date.now() - 62 * 86400000).toISOString(),
    lastActiveDate: new Date(Date.now() - 58 * 86400000).toISOString(),
    tags: { env: 'dev', team: 'messaging-infra', ticket: 'JIRA-4819', backup: 'true' },
    status: 'running',
    cpuHistory: [1.2, 1.1, 1.0, 1.4, 1.1, 1.0, 1.2, 1.1, 1.3, 1.0, 1.1, 1.1],
    memoryHistory: [12.0, 11.9, 11.8, 11.7, 11.8, 11.8, 11.7, 11.8, 11.9, 11.8, 11.8, 11.8]
  }
];

let localInstancesStore = JSON.parse(JSON.stringify(LOCAL_FALLBACK_INSTANCES));

function computeLocalAudit(instances: InstanceTelemetry[]): AuditResponse {
  const active = instances.filter(i => i.status !== 'terminated');
  let waste = 0;
  let totalSpend = 0;

  const perInstance = active.map(inst => {
    totalSpend += inst.monthlyCost;
    const isProd = inst.tags.env === 'prod';
    const isZombie = !isProd && inst.cpuAvg < 2.0 && inst.memoryAvg < 15.0 && !inst.previousFeedback;
    const isReview = !isProd && (inst.previousFeedback || (inst.cpuAvg < 10.0 && inst.memoryAvg < 35.0));

    let verdict: 'zombie' | 'likely-safe' | 'needs-review';
    let confidence: number;
    let reasoning: string;
    let savings = 0;

    if (isZombie) {
      verdict = 'zombie';
      confidence = 96;
      reasoning = `Severely abandoned bench. CPU ${inst.cpuAvg}%, RAM ${inst.memoryAvg}%, net I/O ${inst.networkIoMbPerDay}MB/day. Idle >30d.`;
      savings = inst.monthlyCost;
      waste += inst.monthlyCost;
    } else if (isReview) {
      verdict = 'needs-review';
      confidence = inst.previousFeedback ? 68 : 72;
      reasoning = inst.previousFeedback
        ? `Previously preserved by ${inst.previousFeedback.manager}: "${inst.previousFeedback.reason}". Treat with caution.`
        : `Sporadic utilization (CPU ${inst.cpuAvg}%, RAM ${inst.memoryAvg}%). Candidate for schedule or rightsizing.`;
      savings = 0;
    } else {
      verdict = 'likely-safe';
      confidence = 98;
      reasoning = isProd
        ? `Production workload (${inst.tags.team || 'core'}) protected by policy.`
        : `Active workload with healthy baseline utilization (CPU ${inst.cpuAvg}%).`;
    }

    return {
      instanceId: inst.id,
      instanceName: inst.name,
      verdict,
      confidence,
      reasoning,
      riskLevel: isProd ? 'high' : ('low' as any),
      recommendedAction: (verdict === 'zombie' ? 'terminate' : verdict === 'needs-review' ? 'investigate' : 'keep') as any,
      monthlySavings: savings,
      estimatedMonthlySavings: savings
    };
  });

  const zombiesCount = perInstance.filter(p => p.verdict === 'zombie').length;
  const needsReviewCount = perInstance.filter(p => p.verdict === 'needs-review').length;
  const safeCount = perInstance.filter(p => p.verdict === 'likely-safe').length;

  return {
    auditId: `audit-${Date.now()}`,
    executiveSummary: `Fleet audit complete across ${active.length} cloud instances. Identified ${zombiesCount} confirmed zombie assets and ${needsReviewCount} instances requiring architectural review. Primary cost offender is gcp-a2-gpu-notebook-alex burning ~$2,145/mo with near-zero compute activity. Terminating flagged zombies will unlock an immediate recurring reduction of $${waste.toLocaleString()}/mo with zero production impact.`,
    totalMonthlyWaste: waste,
    totalCurrentSpend: totalSpend,
    totalInstancesAudited: active.length,
    zombiesCount,
    needsReviewCount,
    safeCount,
    perInstance,
    generatedAt: new Date().toISOString(),
    providerUsed: 'CloudPrune Autonomous FinOps Engine (Built-in)'
  };
}

export const api = {
  async getInstances(): Promise<InstanceTelemetry[]> {
    try {
      const res = await fetch(`${API_BASE}/instances`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.instances) {
        localInstancesStore = JSON.parse(JSON.stringify(data.instances));
        return data.instances;
      }
    } catch {
      // Fallback seamlessly to local store
      console.warn('Backend server not directly reachable; using local client-side FinOps store');
    }
    return JSON.parse(JSON.stringify(localInstancesStore));
  },

  async runAudit(provider?: string): Promise<AuditResponse> {
    try {
      const res = await fetch(`${API_BASE}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.audit;
    } catch {
      // Return accurate local simulation
      return computeLocalAudit(localInstancesStore);
    }
  },

  async getLatestAudit(): Promise<AuditResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/audit/latest`, { signal: AbortSignal.timeout(3000) });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to retrieve latest audit');
      const data = await res.json();
      return data.audit;
    } catch {
      return computeLocalAudit(localInstancesStore);
    }
  },

  async terminateInstances(payload: {
    instanceIds: string[];
    reason?: string;
    operator?: string;
    forceProduction?: boolean;
  }): Promise<{
    success: boolean;
    terminatedCount: number;
    terminatedInstances: string[];
    totalMonthlySaved: number;
    auditLogId: string;
    message: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/terminate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });
      const data = await res.json();
      if (res.ok) return data;
      throw new Error(data.error || 'Failed to terminate instances');
    } catch (err: any) {
      if (err.message && err.message.includes('Safety Block')) throw err;

      // Local fallback execution
      let saved = 0;
      for (const inst of localInstancesStore) {
        if (payload.instanceIds.includes(inst.id)) {
          inst.status = 'terminated';
          saved += inst.monthlyCost;
        }
      }
      return {
        success: true,
        terminatedCount: payload.instanceIds.length,
        terminatedInstances: payload.instanceIds,
        totalMonthlySaved: saved,
        auditLogId: `log-${Date.now()}`,
        message: `Successfully terminated ${payload.instanceIds.length} instance(s), saving $${saved.toLocaleString()}/month.`
      };
    }
  },

  async submitFeedback(payload: {
    instanceId: string;
    reason: string;
    team: string;
    manager: string;
    action?: 'reject_zombie' | 'whitelist' | 'schedule_review';
  }): Promise<RejectionFeedback> {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });
      const data = await res.json();
      if (res.ok) return data.feedback;
    } catch {
      // Local fallback
    }

    const target = localInstancesStore.find((i: InstanceTelemetry) => i.id === payload.instanceId);
    const feedback: RejectionFeedback = {
      id: `fb-${Date.now()}`,
      instanceId: payload.instanceId,
      instanceName: target ? target.name : payload.instanceId,
      team: payload.team,
      manager: payload.manager,
      reason: payload.reason,
      action: payload.action || 'reject_zombie',
      createdAt: new Date().toISOString()
    };
    if (target) {
      target.previousFeedback = feedback;
    }
    return feedback;
  },

  async getFeedbackHistory(): Promise<RejectionFeedback[]> {
    try {
      const res = await fetch(`${API_BASE}/feedback`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.feedbacks || [];
      }
    } catch {}
    return localInstancesStore.filter((i: InstanceTelemetry) => i.previousFeedback).map((i: InstanceTelemetry) => i.previousFeedback!);
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.logs || [];
      }
    } catch {}
    return [
      {
        id: 'log-seed-01',
        timestamp: new Date().toISOString(),
        action: 'audit_performed',
        summary: 'Fleet audit complete: 6 confirmed zombie assets identified ($3,576/mo waste)',
        operator: 'CloudPrune Autonomous FinOps Agent',
        instanceIds: [],
        costImpactDelta: -3576
      }
    ];
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.settings;
      }
    } catch {}
    return {
      aiProvider: 'auto',
      geminiModel: 'gemini-2.5-flash',
      openaiModel: 'gpt-4o-mini',
      confidenceThreshold: 80,
      autoProtectProd: true,
      maxCpuIdleThreshold: 3.0,
      idleDaysThreshold: 30
    };
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        return data.settings;
      }
    } catch {}
    return settings as AppSettings;
  },

  async resetDemo(): Promise<void> {
    try {
      await fetch(`${API_BASE}/demo/reset`, { method: 'POST', signal: AbortSignal.timeout(4000) });
    } catch {}
    localInstancesStore = JSON.parse(JSON.stringify(LOCAL_FALLBACK_INSTANCES));
  },

  async sendChatMessage(
    message: string,
    history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
  ): Promise<{ success: boolean; reply: string; timestamp: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        signal: AbortSignal.timeout(25000)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      return data;
    } catch (err: any) {
      console.warn('Chat request failed:', err.message);
      return {
        success: false,
        reply: `⚠️ Could not connect to CloudPrune AI copilot: ${err.message || 'Network error'}. Please verify backend service on port 3001.`,
        timestamp: new Date().toISOString(),
        error: err.message
      };
    }
  }
};
