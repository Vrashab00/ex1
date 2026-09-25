import { InstanceTelemetry, CloudProvider } from '../types/index.js';

export interface CloudTelemetryAdapter {
  fetchInstances(): Promise<InstanceTelemetry[]>;
  terminateInstances(instanceIds: string[]): Promise<{ terminatedIds: string[]; failedIds: string[] }>;
}

const INITIAL_INSTANCES: InstanceTelemetry[] = [
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

export class MockCloudTelemetryAdapter implements CloudTelemetryAdapter {
  private instances: InstanceTelemetry[];

  constructor() {
    this.instances = JSON.parse(JSON.stringify(INITIAL_INSTANCES));
  }

  async fetchInstances(): Promise<InstanceTelemetry[]> {
    // Returns current state of servers (could query AWS DescribeInstances / GCP compute.instances.list)
    return JSON.parse(JSON.stringify(this.instances));
  }

  async terminateInstances(instanceIds: string[]): Promise<{ terminatedIds: string[]; failedIds: string[] }> {
    const terminatedIds: string[] = [];
    const failedIds: string[] = [];

    const idSet = new Set(instanceIds);

    for (const inst of this.instances) {
      if (idSet.has(inst.id)) {
        if (inst.status === 'terminated') {
          failedIds.push(inst.id);
        } else {
          inst.status = 'terminated';
          terminatedIds.push(inst.id);
        }
      }
    }

    return { terminatedIds, failedIds };
  }

  // Update instance with manager feedback
  setInstanceFeedback(instanceId: string, feedback: any): void {
    const inst = this.instances.find(i => i.id === instanceId);
    if (inst) {
      inst.previousFeedback = feedback;
    }
  }

  // Reset to initial mock state (useful for live demos)
  resetDemo(): void {
    this.instances = JSON.parse(JSON.stringify(INITIAL_INSTANCES));
  }
}

export const telemetryService = new MockCloudTelemetryAdapter();
