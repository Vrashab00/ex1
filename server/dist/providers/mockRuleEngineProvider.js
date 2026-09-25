"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRuleEngineProvider = void 0;
const auditSchemas_js_1 = require("../schemas/auditSchemas.js");
class MockRuleEngineProvider {
    name = 'FinOps Heuristic Engine (Built-in)';
    async auditFleet(instances, options) {
        const verdicts = [];
        let totalSavings = 0;
        for (const inst of instances) {
            const isProd = inst.tags.env === 'prod' || inst.tags.protected === 'true';
            const hasPreviousRejection = !!inst.previousFeedback;
            const isExtremeIdle = inst.cpuAvg < 2.0 && inst.memoryAvg < 15.0 && inst.networkIoMbPerDay < 50;
            const isModerateIdle = inst.cpuAvg < 10.0 && inst.memoryAvg < 35.0;
            let verdict;
            let confidence;
            let reasoning;
            let riskLevel;
            let recommendedAction;
            let estimatedMonthlySavings = 0;
            if (options?.autoProtectProd && isProd) {
                verdict = 'likely-safe';
                confidence = 98;
                reasoning = `Production workload (${inst.tags.team || 'core'}) protected by policy. Utilization: CPU ${inst.cpuAvg}%, RAM ${inst.memoryAvg}%.`;
                riskLevel = 'high';
                recommendedAction = 'keep';
                estimatedMonthlySavings = 0;
            }
            else if (hasPreviousRejection) {
                // Human previously rejected termination!
                verdict = 'needs-review';
                confidence = 68;
                reasoning = `Previously preserved by ${inst.previousFeedback?.manager} (${inst.previousFeedback?.team}): "${inst.previousFeedback?.reason}". Treat with caution.`;
                riskLevel = 'medium';
                recommendedAction = 'investigate';
                estimatedMonthlySavings = 0;
            }
            else if (isExtremeIdle && !isProd) {
                // High confidence zombie
                verdict = 'zombie';
                confidence = Math.min(98, Math.max(88, Math.round(98 - inst.cpuAvg * 3)));
                const ownerTag = inst.tags.owner ? `Owner: ${inst.tags.owner}. ` : '';
                reasoning = `Severely abandoned bench. CPU ${inst.cpuAvg}%, RAM ${inst.memoryAvg}%, net I/O ${inst.networkIoMbPerDay}MB/day. ${ownerTag}No active traffic for >30d.`;
                riskLevel = 'low';
                recommendedAction = 'terminate';
                estimatedMonthlySavings = inst.monthlyCost;
                totalSavings += inst.monthlyCost;
            }
            else if (isModerateIdle && !isProd) {
                // Ambiguous case / needs review or downscale
                verdict = 'needs-review';
                confidence = 72;
                reasoning = `Sporadic utilization detected (CPU ${inst.cpuAvg}%, RAM ${inst.memoryAvg}%). Potential candidate for right-sizing or scheduled auto-stop.`;
                riskLevel = 'medium';
                recommendedAction = inst.monthlyCost > 200 ? 'downscale' : 'investigate';
                estimatedMonthlySavings = Math.round(inst.monthlyCost * 0.5);
            }
            else {
                // Likely safe / active workload
                verdict = 'likely-safe';
                confidence = 94;
                reasoning = `Active workload with healthy baseline utilization (CPU ${inst.cpuAvg}%, RAM ${inst.memoryAvg}%, Network ${inst.networkIoMbPerDay}MB/day).`;
                riskLevel = isProd ? 'high' : 'low';
                recommendedAction = 'keep';
                estimatedMonthlySavings = 0;
            }
            verdicts.push({
                instanceId: inst.id,
                verdict,
                confidence,
                reasoning,
                riskLevel,
                recommendedAction,
                estimatedMonthlySavings
            });
        }
        const zombieCount = verdicts.filter(v => v.verdict === 'zombie').length;
        const reviewCount = verdicts.filter(v => v.verdict === 'needs-review').length;
        const topWaste = instances
            .filter(i => verdicts.find(v => v.instanceId === i.id)?.verdict === 'zombie')
            .sort((a, b) => b.monthlyCost - a.monthlyCost)[0];
        const executiveSummary = `Fleet audit complete across ${instances.length} cloud instances. Identified ${zombieCount} confirmed zombie assets and ${reviewCount} instances requiring architectural review. Primary cost offender is ${topWaste ? topWaste.name : 'abandoned GPU/dev instances'} burning ~$${topWaste ? topWaste.monthlyCost.toLocaleString() : '0'}/mo with near-zero compute activity. Terminating flagged zombies will unlock an immediate recurring reduction of $${totalSavings.toLocaleString()}/mo with zero production impact.`;
        const rawOutput = {
            executiveSummary,
            totalEstimatedMonthlySavings: totalSavings,
            instances: verdicts
        };
        // Validate with Zod before returning to ensure contract compliance
        return auditSchemas_js_1.llmAuditOutputSchema.parse(rawOutput);
    }
}
exports.MockRuleEngineProvider = MockRuleEngineProvider;
