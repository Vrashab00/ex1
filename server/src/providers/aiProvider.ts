import { InstanceTelemetry } from '../types/index.js';
import { LLMAuditOutput } from '../schemas/auditSchemas.js';

export interface AuditAuditOptions {
  autoProtectProd?: boolean;
  confidenceThreshold?: number;
  rejectionHistoryContext?: string;
}

export interface AIProvider {
  readonly name: string;
  auditFleet(instances: InstanceTelemetry[], options?: AuditAuditOptions): Promise<LLMAuditOutput>;
}
