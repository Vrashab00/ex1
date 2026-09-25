import React, { useState } from 'react';
import { Trash2, AlertOctagon, Eye, AlertTriangle, ArrowUpRight, Plus, X, Activity, TrendingUp } from 'lucide-react';
import { AugmentedInstance } from '../../types/index.js';
import { ProviderBadge } from '../ui/ProviderBadge.js';
import { VerdictBadge } from '../ui/VerdictBadge.js';
import { ConfidenceRing } from '../ui/ConfidenceRing.js';
import { Sparkline } from '../ui/Sparkline.js';

interface InstanceTableProps {
  instances: AugmentedInstance[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAllVisible: () => void;
  onInspect: (instance: AugmentedInstance) => void;
  onQuickTerminate: (instance: AugmentedInstance) => void;
  onOpenFeedbackModal: (instance: AugmentedInstance) => void;
  onAddInstance?: (instance: AugmentedInstance) => void;
  onOpenTelemetry?: () => void;
}

const getProperServiceName = (inst: AugmentedInstance): string => {
  const name = inst.name.toLowerCase();
  const provider = inst.provider?.toLowerCase() || '';

  if (name.includes('aurora') || name.includes('postgres')) return 'AWS Aurora Postgres';
  if (name.includes('redis')) return 'AWS Redis Cache';
  if (name.includes('memcached')) return 'AWS Memcached';
  if (name.includes('rabbitmq')) return 'AWS RabbitMQ';
  if (name.includes('ingress') || name.includes('gateway')) return 'AWS EC2 Ingress';
  if (name.includes('k8s') || name.includes('worker') || name.includes('spot')) return 'Amazon EKS';
  if (name.includes('gpu') || name.includes('notebook') || name.includes('alex') || name.includes('a2')) return 'GCP A100 GPU';
  if (name.includes('loadgen') || name.includes('gatling')) return 'GCP N2 Cluster';
  if (name.includes('metabase')) return 'GCP Metabase';
  if (name.includes('elastic') || name.includes('single-node') || name.includes('abandoned')) return 'Azure Elasticsearch';
  if (name.includes('cypress') || name.includes('matrix') || name.includes('runner') || name.includes('qa-e2e')) return 'AWS Cypress Runner';
  if (name.includes('warehouse') || name.includes('sync')) return 'AWS Batch Sync';
  if (provider === 'aws') return 'AWS EC2';
  if (provider === 'gcp') return 'GCP Compute';
  if (provider === 'azure') return 'Azure VM';
  return 'Cloud Compute';
};

/** Generate random sparkline data around a given average */
const genCurve = (avg: number, points = 12, noise = 8): number[] =>
  Array.from({ length: points }, () => Math.max(0, Math.min(100, avg + (Math.random() - 0.5) * noise * 2)));

// ─── Add Telemetry Modal ───────────────────────────────────────────────────────
interface AddCurveModalProps {
  onClose: () => void;
  onAdd: (instance: AugmentedInstance) => void;
}

const PROVIDERS = ['aws', 'gcp', 'azure'] as const;
const REGIONS: Record<string, string[]> = {
  aws: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
  gcp: ['us-central1-a', 'us-central1-f', 'europe-west1-b'],
  azure: ['eastus', 'westus2', 'northeurope'],
};

const AddCurveModal: React.FC<AddCurveModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState<'aws' | 'gcp' | 'azure'>('aws');
  const [instanceType, setInstanceType] = useState('t3.medium');
  const [monthlyCost, setMonthlyCost] = useState('120');
  const [cpuAvg, setCpuAvg] = useState('2');
  const [ramAvg, setRamAvg] = useState('8');
  const [env, setEnv] = useState('dev');
  const [team, setTeam] = useState('');
  const [region, setRegion] = useState('us-east-1');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Instance name is required.'); return; }
    const cost = parseFloat(monthlyCost);
    if (isNaN(cost) || cost < 0) { setError('Enter a valid monthly cost.'); return; }

    const cpu = Math.max(0, Math.min(100, parseFloat(cpuAvg) || 2));
    const ram = Math.max(0, Math.min(100, parseFloat(ramAvg) || 8));

    const newInstance: AugmentedInstance = {
      id: `inst-custom-${Date.now()}`,
      name: name.trim(),
      provider: provider as any,
      region: region,
      instanceType: instanceType.trim() || 't3.medium',
      monthlyCost: cost,
      cpuAvg: cpu,
      cpuPeak: Math.min(100, cpu + Math.random() * 15),
      memoryAvg: ram,
      memoryPeak: Math.min(100, ram + Math.random() * 10),
      networkIoMbPerDay: Math.random() * 500,
      diskIoOpsPerSec: Math.random() * 50,
      lastDeployDate: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
      lastActiveDate: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      tags: { env, team: team.trim() || 'unassigned' },
      status: 'running',
      cpuHistory: genCurve(cpu),
      memoryHistory: genCurve(ram),
    };

    onAdd(newInstance);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg mx-4 bg-[#141414] border border-[#2A2421] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2421]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C49A6C]" />
            <span className="text-sm font-semibold text-[#F5F3F0] tracking-tight">Add Telemetry Curve</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#222] text-[#666] hover:text-[#F5F3F0] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-xs font-mono text-[#F2A4AA] bg-[#F2A4AA]/10 border border-[#F2A4AA]/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Instance Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Instance Name</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="e.g. dev-ml-training-node-01"
              className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] placeholder-[#555] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
            />
          </div>

          {/* Provider + Region */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Provider</label>
              <select
                value={provider}
                onChange={e => {
                  const p = e.target.value as 'aws' | 'gcp' | 'azure';
                  setProvider(p);
                  setRegion(REGIONS[p][0]);
                }}
                className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors cursor-pointer"
              >
                {PROVIDERS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Region</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors cursor-pointer"
              >
                {REGIONS[provider].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Instance Type + Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Instance Type</label>
              <input
                type="text"
                value={instanceType}
                onChange={e => setInstanceType(e.target.value)}
                placeholder="t3.medium"
                className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] placeholder-[#555] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Monthly Cost ($)</label>
              <input
                type="number"
                min="0"
                value={monthlyCost}
                onChange={e => setMonthlyCost(e.target.value)}
                placeholder="120"
                className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] placeholder-[#555] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
              />
            </div>
          </div>

          {/* CPU + RAM avg */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Avg CPU %</label>
              <input
                type="number"
                min="0" max="100"
                value={cpuAvg}
                onChange={e => setCpuAvg(e.target.value)}
                placeholder="2"
                className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] placeholder-[#555] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Avg RAM %</label>
              <input
                type="number"
                min="0" max="100"
                value={ramAvg}
                onChange={e => setRamAvg(e.target.value)}
                placeholder="8"
                className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] placeholder-[#555] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
              />
            </div>
          </div>

          {/* Env + Team */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Environment</label>
              <select
                value={env}
                onChange={e => setEnv(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors cursor-pointer"
              >
                {['dev', 'qa', 'staging', 'prod', 'sandbox'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Team</label>
              <input
                type="text"
                value={team}
                onChange={e => setTeam(e.target.value)}
                placeholder="platform-eng"
                className="w-full bg-[#1A1A1A] border border-[#2A2421] rounded-lg px-3 py-2 text-sm text-[#F5F3F0] placeholder-[#555] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
              />
            </div>
          </div>

          {/* Curve preview hint */}
          <p className="text-[10px] font-mono text-[#666] italic">
            Telemetry curves are generated from avg values with realistic noise.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-full text-xs font-mono text-[#A0A0A0] border border-[#2A2421] hover:bg-[#1E1E1E] transition-colors"
            >
              cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_2px_12px_rgba(196,154,108,0.3)] transition-all"
            >
              Add Curve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Table ────────────────────────────────────────────────────────────────
export const InstanceTable: React.FC<InstanceTableProps> = ({
  instances,
  selectedIds,
  onToggleSelect,
  onSelectAllVisible,
  onInspect,
  onQuickTerminate,
  onOpenFeedbackModal,
  onAddInstance,
  onOpenTelemetry,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const visibleInstances = isExpanded || instances.length <= 6 ? instances : instances.slice(0, 6);
  const allVisibleSelected = visibleInstances.length > 0 && visibleInstances.every(i => selectedIds.has(i.id));

  const handleAdd = (inst: AugmentedInstance) => {
    if (onAddInstance) onAddInstance(inst);
  };

  return (
    <>
      {showAddModal && (
        <AddCurveModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}

      <div className="w-full overflow-hidden rounded-2xl bg-[#141414] border border-[#2A2421] shadow-editorial-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A2421] bg-[#111111] text-[11px] font-sans lowercase tracking-wide text-[#A0A0A0]">
                <th className="py-3.5 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={onSelectAllVisible}
                    className="rounded border-[#3D3430] bg-[#161616] text-[#D6551F] focus:ring-[#D6551F]/30 cursor-pointer"
                    aria-label="Select all visible instances"
                  />
                </th>
                <th className="py-3.5 px-3">workload / specimen</th>
                <th className="py-3.5 px-3">telemetry curves</th>
                <th className="py-3.5 px-3">monthly cost</th>
                <th className="py-3.5 px-3">ai verdict</th>
                <th className="py-3.5 px-3 text-center">confidence</th>
                <th className="py-3.5 pr-4 pl-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span>actions</span>
                    {/* ── TELEMETRY CURVES BUTTON ── */}
                    {onOpenTelemetry && (
                      <button
                        onClick={onOpenTelemetry}
                        title="View telemetry curves & connect cloud sources"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono lowercase tracking-wide text-[#D6551F] border border-[#D6551F]/30 bg-[#D6551F]/5 hover:bg-[#D6551F]/15 hover:border-[#D6551F]/50 transition-all"
                      >
                        <Activity className="w-3 h-3" />
                        curves
                      </button>
                    )}
                    {/* ── ADD INSTANCE BUTTON ── */}
                    <button
                      onClick={() => setShowAddModal(true)}
                      title="Add telemetry curve"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono lowercase tracking-wide text-[#C49A6C] border border-[#C49A6C]/30 bg-[#C49A6C]/5 hover:bg-[#C49A6C]/15 hover:border-[#C49A6C]/50 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      add
                    </button>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#2A2421] text-xs font-sans">
              {visibleInstances.map((instance, idx) => {
                const isSelected = selectedIds.has(instance.id);
                const isTerminated = instance.status === 'terminated';
                const hasPreviousFeedback = !!instance.previousFeedback;
                const isZombie = instance.audit?.verdict === 'zombie';
                const isProd = instance.tags.env === 'prod';
                const rowNum = String(idx + 1).padStart(2, '0');

                return (
                  <tr
                    key={instance.id}
                    className={`editorial-row-hover transition-colors duration-150 ${
                      isSelected
                        ? 'bg-[#2A180F]/40'
                        : isTerminated
                        ? 'opacity-35 bg-[#0E0E0E]'
                        : 'hover:bg-[#181818]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-4 pr-2">
                      <input
                        type="checkbox"
                        disabled={isTerminated}
                        checked={isSelected}
                        onChange={() => onToggleSelect(instance.id)}
                        className="rounded border-[#3D3430] bg-[#161616] text-[#D6551F] focus:ring-[#D6551F]/30 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </td>

                    {/* Server Details & Tags */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#666666]">{rowNum}</span>
                          <span
                            className="font-bold text-sm text-[#F5F3F0] font-sans tracking-tight hover:text-[#C49A6C] transition-colors cursor-pointer"
                            onClick={() => onInspect(instance)}
                          >
                            {instance.name}
                          </span>
                          {isTerminated && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#F2A4AA]/10 text-[#F2A4AA] border border-[#F2A4AA]/30 lowercase">
                              decommissioned
                            </span>
                          )}
                        </div>

                        {isProd && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono">
                            <span className="px-2 py-0.2 rounded-full bg-[#F3C49F]/10 text-[#F3C49F] border border-[#F3C49F]/30 font-semibold lowercase">
                              production
                            </span>
                          </div>
                        )}

                        {hasPreviousFeedback && (
                          <div
                            className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono text-[#F4DD9E] bg-[#F4DD9E]/10 px-2.5 py-0.5 rounded-full border border-[#F4DD9E]/30 w-fit cursor-help lowercase"
                            title={`previously rejected by ${instance.previousFeedback?.manager}: "${instance.previousFeedback?.reason}"`}
                          >
                            <AlertTriangle className="w-3 h-3 text-[#F4DD9E] shrink-0" />
                            <span>previously rejected by manager — treat cautiously</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Telemetry Curves */}
                    <td className="py-3 px-3 min-w-[185px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium text-[#EDEAE5] tracking-tight">
                          {getProperServiceName(instance)}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono text-[#8C867F] lowercase tracking-wide">cpu</span>
                            <Sparkline
                              data={instance.cpuHistory}
                              color={isZombie ? 'red' : instance.audit?.verdict === 'needs-review' ? 'yellow' : isProd ? 'orange' : 'green'}
                              label="CPU"
                              unit="%"
                              height={18}
                              width={55}
                            />
                          </div>
                          <div className="h-3.5 w-px bg-[#2A2421]" />
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono text-[#8C867F] lowercase tracking-wide">ram</span>
                            <Sparkline
                              data={instance.memoryHistory}
                              color={isZombie ? 'red' : instance.audit?.verdict === 'needs-review' ? 'yellow' : isProd ? 'orange' : 'green'}
                              label="RAM"
                              unit="%"
                              height={18}
                              width={55}
                            />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Monthly Cost */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-sans">
                        <span className="text-sm font-bold text-[#F5F3F0] tracking-tight">
                          ${instance.monthlyCost.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#A0A0A0] font-mono">/mo</span>
                      </div>
                      {isZombie && !isTerminated && (
                        <span className="text-[9px] font-mono text-[#F3C49F] block lowercase tracking-wider font-semibold">
                          100% waste
                        </span>
                      )}
                    </td>

                    {/* AI Verdict Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <VerdictBadge
                        verdict={instance.audit?.verdict}
                        reasoning={instance.audit?.reasoning}
                      />
                    </td>

                    {/* Confidence Ring */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {instance.audit ? (
                        <ConfidenceRing score={instance.audit.confidence} size={32} strokeWidth={2.5} />
                      ) : (
                        <span className="text-xs text-[#666666] font-mono">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-4 pl-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspect(instance)}
                          title="View telemetry details"
                          className="p-1.5 rounded-full text-[#A0A0A0] hover:text-[#F5F3F0] hover:bg-[#1E1E1E] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* ── PER-ROW ADD TELEMETRY CURVE BUTTON ── */}
                        {!isTerminated && (
                          <button
                            onClick={() => setShowAddModal(true)}
                            title="Add telemetry curve for this instance"
                            className="p-1.5 rounded-full text-[#A0A0A0] hover:text-[#C49A6C] hover:bg-[#1E1E1E] transition-colors"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isTerminated && (
                          <button
                            onClick={() => onOpenFeedbackModal(instance)}
                            title="Reject recommendation & provide manager feedback"
                            className="p-1.5 rounded-full text-[#A0A0A0] hover:text-[#FFB59B] hover:bg-[#1E1E1E] transition-colors"
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isTerminated ? (
                          <button
                            onClick={() => onQuickTerminate(instance)}
                            title="Approve termination"
                            className="btn-pill-ghost text-[10px] py-1 px-2.5 lowercase"
                          >
                            <span>terminate</span>
                            <ArrowUpRight className="w-3 h-3 text-[#F3C49F]" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#666666] font-mono italic lowercase">
                            terminated
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#111111] border-t border-[#2A2421] flex items-center justify-between text-xs font-mono">
          <span className="text-[#8E8B85]">
            Showing {visibleInstances.length} of {instances.length} cloud telemetry curves
          </span>
          <div className="flex items-center gap-2">
            {instances.length > 6 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3.5 py-1 rounded-full text-xs font-medium text-[#EDEAE5] bg-[#1A1816] hover:bg-[#EAE2D5] hover:text-[#181614] border border-[#2A2421] transition-all cursor-pointer shadow-sm"
              >
                {isExpanded ? 'Show Fewer (Top 6) ▴' : `Show All (${instances.length} Instances) ▾`}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
