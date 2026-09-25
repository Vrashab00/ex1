"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminationService = exports.TerminationService = void 0;
const telemetryService_js_1 = require("./telemetryService.js");
const auditLogService_js_1 = require("./auditLogService.js");
const auditService_js_1 = require("./auditService.js");
class TerminationService {
    async terminateApprovedInstances(payload) {
        const allInstances = await telemetryService_js_1.telemetryService.fetchInstances();
        const targetMap = new Map(allInstances.map(i => [i.id, i]));
        const validTargets = payload.instanceIds.map(id => targetMap.get(id)).filter(Boolean);
        if (validTargets.length === 0) {
            throw new Error('No valid instances found matching the provided IDs');
        }
        // Safety check for production environments
        const prodInstances = validTargets.filter(inst => inst?.tags.env === 'prod' || inst?.tags.protected === 'true');
        if (prodInstances.length > 0 && !payload.forceProduction) {
            throw new Error(`Safety Block: ${prodInstances.map(i => i?.name).join(', ')} is tagged as PRODUCTION. Production terminations require explicit operator override confirmation.`);
        }
        const { terminatedIds, failedIds } = await telemetryService_js_1.telemetryService.terminateInstances(payload.instanceIds);
        let totalMonthlySaved = 0;
        const names = [];
        for (const id of terminatedIds) {
            const inst = targetMap.get(id);
            if (inst) {
                totalMonthlySaved += inst.monthlyCost;
                names.push(inst.name);
            }
        }
        const log = auditLogService_js_1.auditLogService.addLog({
            action: 'instances_terminated',
            summary: `Terminated ${terminatedIds.length} instance(s): ${names.slice(0, 3).join(', ')}${names.length > 3 ? ` and ${names.length - 3} others` : ''}. Saved $${totalMonthlySaved.toLocaleString()}/mo.`,
            operator: payload.operator || 'FinOps Admin',
            instanceIds: terminatedIds,
            costImpactDelta: -totalMonthlySaved,
            metadata: {
                reason: payload.reason || 'Approved zombie cleanup',
                terminatedCount: terminatedIds.length,
                failedIds
            }
        });
        // Re-run or update audit stats to reflect new savings
        await auditService_js_1.auditService.runAudit();
        return {
            success: true,
            terminatedCount: terminatedIds.length,
            terminatedInstances: terminatedIds,
            failedInstances: failedIds,
            totalMonthlySaved,
            auditLogId: log.id,
            timestamp: log.timestamp,
            message: `Successfully terminated ${terminatedIds.length} instance(s), saving $${totalMonthlySaved.toLocaleString()}/month.`
        };
    }
}
exports.TerminationService = TerminationService;
exports.terminationService = new TerminationService();
