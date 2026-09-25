import { AuditResponse, AppSettings } from '../types/index.js';
import { telemetryService } from './telemetryService.js';
import { getAIProvider } from '../providers/providerFactory.js';
import { auditLogService } from './auditLogService.js';

class AuditService {
  private latestAudit: AuditResponse | null = null;
  private settings: AppSettings = {
    aiProvider: 'auto',
    geminiModel: 'gemini-2.5-flash',
    openaiModel: 'gpt-4o-mini',
    confidenceThreshold: 80,
    autoProtectProd: true,
    maxCpuIdleThreshold: 3.0,
    idleDaysThreshold: 30
  };

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...newSettings };
    return this.getSettings();
  }

  getLatestAudit(): AuditResponse | null {
    return this.latestAudit;
  }

  async runAudit(preferredProvider?: string): Promise<AuditResponse> {
    const instances = await telemetryService.fetchInstances();
    // Filter only running or stopped instances (exclude already terminated)
    const activeInstances = instances.filter(i => i.status !== 'terminated');

    const provider = getAIProvider(preferredProvider || this.settings.aiProvider);

    const auditOutput = await provider.auditFleet(activeInstances, {
      autoProtectProd: this.settings.autoProtectProd,
      confidenceThreshold: this.settings.confidenceThreshold
    });

    const instanceMap = new Map(activeInstances.map(i => [i.id, i]));
    const totalCurrentSpend = activeInstances.reduce((sum, i) => sum + i.monthlyCost, 0);

    const perInstance = auditOutput.instances.map(res => {
      const inst = instanceMap.get(res.instanceId);
      return {
        ...res,
        monthlySavings: res.estimatedMonthlySavings,
        instanceName: inst ? inst.name : res.instanceId
      };
    });

    const zombiesCount = perInstance.filter(p => p.verdict === 'zombie').length;
    const needsReviewCount = perInstance.filter(p => p.verdict === 'needs-review').length;
    const safeCount = perInstance.filter(p => p.verdict === 'likely-safe').length;

    // Calculate actual total monthly waste for zombies
    const calculatedWaste = perInstance
      .filter(p => p.verdict === 'zombie')
      .reduce((sum, p) => {
        const inst = instanceMap.get(p.instanceId);
        return sum + (inst ? inst.monthlyCost : 0);
      }, 0);

    const auditId = `audit-${Date.now()}`;
    const auditResponse: AuditResponse = {
      auditId,
      executiveSummary: auditOutput.executiveSummary,
      totalMonthlyWaste: calculatedWaste,
      totalCurrentSpend,
      totalInstancesAudited: activeInstances.length,
      zombiesCount,
      needsReviewCount,
      safeCount,
      perInstance,
      generatedAt: new Date().toISOString(),
      providerUsed: provider.name
    };

    this.latestAudit = auditResponse;

    // Log the audit action
    auditLogService.addLog({
      action: 'audit_performed',
      summary: `Fleet audit identified ${zombiesCount} zombie instances ($${calculatedWaste.toLocaleString()}/mo potential savings)`,
      operator: `${provider.name}`,
      instanceIds: perInstance.filter(p => p.verdict === 'zombie').map(p => p.instanceId),
      costImpactDelta: -calculatedWaste,
      metadata: {
        zombiesCount,
        needsReviewCount,
        safeCount,
        providerUsed: provider.name
      }
    });

    return auditResponse;
  }
}

export const auditService = new AuditService();
