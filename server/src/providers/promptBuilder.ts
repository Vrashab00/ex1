import { InstanceTelemetry } from '../types/index.js';
import { AuditAuditOptions } from './aiProvider.js';

export function buildFinOpsAuditPrompt(instances: InstanceTelemetry[], options?: AuditAuditOptions): string {
  const telemetrySummary = instances.map(inst => ({
    instanceId: inst.id,
    name: inst.name,
    provider: inst.provider,
    region: inst.region,
    instanceType: inst.instanceType,
    monthlyCostUSD: inst.monthlyCost,
    cpuAvgPercent: inst.cpuAvg,
    cpuPeakPercent: inst.cpuPeak,
    memoryAvgPercent: inst.memoryAvg,
    networkIoMbPerDay: inst.networkIoMbPerDay,
    diskIoOpsPerSec: inst.diskIoOpsPerSec,
    lastDeployDate: inst.lastDeployDate,
    lastActiveDate: inst.lastActiveDate,
    tags: inst.tags,
    status: inst.status,
    previouslyRejected: inst.previousFeedback ? {
      rejectedBy: inst.previousFeedback.manager,
      team: inst.previousFeedback.team,
      reason: inst.previousFeedback.reason,
      date: inst.previousFeedback.createdAt
    } : null
  }));

  return `You are FinOps AI, an autonomous, expert FinOps agent specializing in cloud waste identification and remediation.
Your task is to perform an exhaustive FinOps audit of the following cloud compute instances and classify each one.

GUIDELINES FOR CLASSIFICATION:
1. "zombie":
   - Severely underutilized instances (e.g. CPU < 3%, Memory < 15%, minimal network I/O).
   - Abandoned dev/QA/sandbox benches, unattached GPU instances, POC remnants, departed employee owners.
   - Deploy dates older than 30-90 days with flatline activity.
   - Recommended action: "terminate". High confidence (80-99).

2. "needs-review":
   - Low or intermittent utilization (e.g., 3-15% CPU) with ambiguous purpose (e.g., weekly batch sync, test runner).
   - Any instance that was PREVIOUSLY REJECTED by an engineering manager or lead (treat with extreme caution).
   - Sandbox or staging instances with unverified owners or irregular cron patterns.
   - Recommended action: "investigate" or "downscale". Medium confidence (45-75).

3. "likely-safe":
   - Production instances (tag env:prod, protected:true, core services, databases, ingress gateways).
   - Instances with active workloads (CPU > 20%, Memory > 40%, high network I/O, recent deploy).
   - Recommended action: "keep". Confidence (85-100).
   ${options?.autoProtectProd ? '- STRICT RULE: If tags.env == "prod" or tags.protected == "true", NEVER classify as zombie! Classify as "likely-safe" or "needs-review" at most.' : ''}

INPUT INSTANCES TELEMETRY:
${JSON.stringify(telemetrySummary, null, 2)}

OUTPUT FORMAT:
Return a JSON object conforming strictly to this schema:
{
  "executiveSummary": "2-3 sentences providing an executive summary of total waste found, highest cost drains, and immediate recommendation.",
  "totalEstimatedMonthlySavings": number (sum of monthly costs of all instances classified as 'zombie'),
  "instances": [
    {
      "instanceId": "matching string from input",
      "verdict": "zombie" | "likely-safe" | "needs-review",
      "confidence": number between 0 and 100,
      "reasoning": "A concise, sharp one-line justification citing metrics and tags",
      "riskLevel": "low" | "medium" | "high",
      "recommendedAction": "terminate" | "keep" | "downscale" | "investigate",
      "estimatedMonthlySavings": number (monthlyCost if zombie or downscaled savings, else 0)
    }
  ]
}
Ensure every single input instance is evaluated and included in the instances array. Return valid JSON only.`;
}
