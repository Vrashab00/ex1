import React, { useEffect, useState } from 'react';
import { History, Trash2, Bot, AlertOctagon, Calendar, ArrowDownRight, User } from 'lucide-react';
import { AuditLogEntry } from '../../types/index.js';
import { api } from '../../api/client.js';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionMeta = (action: string) => {
    switch (action) {
      case 'instances_terminated':
        return {
          icon: Trash2,
          color: 'text-[#D6551F]',
          bg: 'bg-[#2A140B] border-[#D6551F]',
          label: 'Decommission Executed'
        };
      case 'recommendation_rejected':
        return {
          icon: AlertOctagon,
          color: 'text-[#E5C287]',
          bg: 'bg-[#261E14] border-[#B48448]',
          label: 'Manager Exemption'
        };
      case 'audit_performed':
      default:
        return {
          icon: Bot,
          color: 'text-[#F5F3F0]',
          bg: 'bg-[#1C1B1B] border-[#2A2421]',
          label: 'Autonomous Audit'
        };
    }
  };

  return (
    <div className="space-y-6 font-['Work_Sans',sans-serif]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-['Space_Grotesk',sans-serif] font-bold tracking-[0.16em] uppercase text-[#D6551F] block mb-1">
            ■ Immutable Specimen Log
          </span>
          <h1 className="text-2xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F3F0] tracking-tight">
            Audit Trail & Remediation History
          </h1>
          <p className="text-xs text-[#A0A0A0] font-mono mt-1">
            Ledger of autonomous telemetry audits, manager overrides, and executed cost prunings
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="btn-pill-ghost text-xs cursor-pointer"
        >
          REFRESH LOGS
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#666666] font-mono text-sm animate-pulse">
          Loading audit ledger...
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#141414] border border-[#2A2421]">
          <History className="w-10 h-10 text-[#444444] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#F5F3F0] font-['Space_Grotesk',sans-serif]">
            No ledger entries recorded
          </h3>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Run an audit or approve decommissions to populate the action trail.
          </p>
        </div>
      ) : (
        <div className="relative border-l border-[#2A2421] pl-6 ml-3 space-y-6">
          {logs.map((log) => {
            const meta = getActionMeta(log.action);
            const Icon = meta.icon;

            return (
              <div key={log.id} className="relative group">
                <div
                  className={`absolute -left-[37px] top-1.5 w-7 h-7 rounded-full border ${meta.bg} flex items-center justify-center ${meta.color} shadow-lg`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="p-5 rounded-2xl bg-[#141414] border border-[#2A2421] hover:border-[#3D3430] transition-all duration-200 shadow-editorial-card space-y-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-['Space_Grotesk',sans-serif] uppercase font-bold px-2.5 py-0.5 rounded-full border ${meta.bg} ${meta.color}`}>
                        {meta.label}
                      </span>
                      <span className="text-xs font-mono text-[#666666]">
                        {log.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#666666]">
                      <Calendar className="w-3.5 h-3.5 text-[#666666]" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#F5F3F0] font-['Space_Grotesk',sans-serif] tracking-tight">
                    {log.summary}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#221D1B] text-xs font-mono text-[#A0A0A0]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#666666]" />
                      <span className="text-[#666666]">Operator:</span>
                      <span className="text-[#F5F3F0]">{log.operator}</span>
                    </div>

                    {log.costImpactDelta !== 0 && (
                      <div className="flex items-center gap-1 text-[#D6551F] font-bold">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>Savings: -${Math.abs(log.costImpactDelta).toLocaleString()}/mo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
