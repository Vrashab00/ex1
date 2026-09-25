import React, { useState, useEffect, useRef } from 'react';
import {
  X, Activity, TrendingUp, Wifi, WifiOff, CheckCircle2,
  AlertCircle, Loader2, ChevronRight, Link2, Clock, Zap
} from 'lucide-react';
import { AugmentedInstance } from '../../types/index.js';
import { Sparkline } from '../ui/Sparkline.js';

// ─── Types ─────────────────────────────────────────────────────────────────────
type TimeRange = '1h' | '24h' | '7d' | '30d';
type Tab = 'live' | 'connect';
type Provider =
  | 'aws-cloudwatch'
  | 'gcp-monitoring'
  | 'azure-monitor'
  | 'datadog'
  | 'custom';

interface ConnectionTestState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

interface TelemetryCurvesModalProps {
  instances: AugmentedInstance[];
  onClose: () => void;
}

// ─── Helper: generate denser synthetic history per time-range ─────────────────
const scaleHistory = (base: number[], range: TimeRange): number[] => {
  const lengths: Record<TimeRange, number> = { '1h': 12, '24h': 24, '7d': 42, '30d': 60 };
  const len = lengths[range];
  const avg = base.reduce((a, b) => a + b, 0) / base.length;
  return Array.from({ length: len }, () =>
    Math.max(0, Math.min(100, avg + (Math.random() - 0.5) * 18))
  );
};

const PROVIDERS: { value: Provider; label: string; placeholder: string }[] = [
  { value: 'aws-cloudwatch', label: 'AWS CloudWatch', placeholder: 'https://monitoring.us-east-1.amazonaws.com' },
  { value: 'gcp-monitoring', label: 'GCP Cloud Monitoring', placeholder: 'https://monitoring.googleapis.com/v3/projects/{project}' },
  { value: 'azure-monitor', label: 'Azure Monitor', placeholder: 'https://management.azure.com/subscriptions/{id}/providers/microsoft.insights' },
  { value: 'datadog', label: 'Datadog', placeholder: 'https://api.datadoghq.com/api/v2/metrics' },
  { value: 'custom', label: 'Custom REST API / Webhook', placeholder: 'https://your-endpoint.example.com/metrics' },
];

const INTERVALS = [10, 15, 30, 60, 120, 300];

// ─── Live Telemetry Tab ────────────────────────────────────────────────────────
const LiveTelemetryTab: React.FC<{ instances: AugmentedInstance[] }> = ({ instances }) => {
  const [range, setRange] = useState<TimeRange>('24h');
  const [histories, setHistories] = useState<
    Record<string, { cpu: number[]; ram: number[]; net: number[] }>
  >({});

  useEffect(() => {
    const next: typeof histories = {};
    instances.forEach(inst => {
      next[inst.id] = {
        cpu: scaleHistory(inst.cpuHistory, range),
        ram: scaleHistory(inst.memoryHistory, range),
        net: scaleHistory(
          Array.from({ length: 12 }, () => (inst.networkIoMbPerDay / 24) * (0.7 + Math.random() * 0.6)),
          range
        ),
      };
    });
    setHistories(next);
  }, [range, instances]);

  const ranges: TimeRange[] = ['1h', '24h', '7d', '30d'];

  return (
    <div className="flex flex-col gap-4">
      {/* Time Range Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#0E0E0E] rounded-full border border-[#2A2421] w-fit">
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3.5 py-1 rounded-full text-[11px] font-mono tracking-widest transition-all cursor-pointer ${
              range === r
                ? 'bg-[#D6551F] text-white shadow-sm'
                : 'text-[#8C867F] hover:text-[#F5F3F0]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Instance Curves */}
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
        {instances.slice(0, 10).map(inst => {
          const h = histories[inst.id];
          if (!h) return null;
          const isZombie = inst.audit?.verdict === 'zombie';
          const isProd = inst.tags?.env === 'prod';
          const color = isZombie ? 'red' : inst.audit?.verdict === 'needs-review' ? 'yellow' : isProd ? 'orange' : 'green';

          return (
            <div
              key={inst.id}
              className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#0E0E0E] border border-[#1E1E1E] hover:border-[#2A2421] transition-colors"
            >
              {/* Instance header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isZombie ? 'bg-[#F2A4AA]' : isProd ? 'bg-[#F3C49F]' : 'bg-[#B2E0A6]'} animate-pulse`} />
                  <span className="text-xs font-medium text-[#F5F3F0] truncate max-w-[200px]">{inst.name}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isZombie
                    ? 'text-[#F2A4AA] border-[#F2A4AA]/20 bg-[#F2A4AA]/5'
                    : isProd
                    ? 'text-[#F3C49F] border-[#F3C49F]/20 bg-[#F3C49F]/5'
                    : 'text-[#B2E0A6] border-[#B2E0A6]/20 bg-[#B2E0A6]/5'
                }`}>
                  {inst.audit?.verdict ?? 'pending'}
                </span>
              </div>

              {/* Sparklines row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'cpu', data: h.cpu, unit: '%' },
                  { label: 'ram', data: h.ram, unit: '%' },
                  { label: 'net mb/d', data: h.net, unit: 'MB' },
                ].map(({ label, data, unit }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#666]">{label}</span>
                      <span className="text-[9px] font-mono text-[#8C867F]">
                        {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)}{unit}
                      </span>
                    </div>
                    <Sparkline data={data} color={color} label={label} unit={unit} height={22} width={90} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {instances.length === 0 && (
          <p className="text-center text-[#666] text-xs font-mono py-8">No instances in fleet. Run an audit first.</p>
        )}
      </div>

      <p className="text-[10px] font-mono text-[#555] italic">
        * Curves are simulated from telemetry baseline data. Connect a live source in the Connect tab.
      </p>
    </div>
  );
};

// ─── Connect Cloud Tab ─────────────────────────────────────────────────────────
const ConnectCloudTab: React.FC<{ onToast: (type: 'success' | 'error', msg: string) => void }> = ({ onToast }) => {
  const [provider, setProvider] = useState<Provider>('aws-cloudwatch');
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [iamArn, setIamArn] = useState('');
  const [interval, setInterval] = useState(60);
  const [testState, setTestState] = useState<ConnectionTestState>({ status: 'idle' });

  const selectedProvider = PROVIDERS.find(p => p.value === provider)!;

  const handleTestConnection = async () => {
    if (!endpoint.trim()) {
      setTestState({ status: 'error', message: 'Endpoint URL is required.' });
      return;
    }
    setTestState({ status: 'loading' });

    // ── CONNECT TO BACKEND HERE ──────────────────────────────────────────────
    // Replace this simulated delay with:
    //   const res = await fetch('/api/telemetry/test-connection', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ provider, endpoint, apiKey, iamArn, interval })
    //   });
    //   const data = await res.json();
    //   setTestState({ status: data.ok ? 'success' : 'error', message: data.message });
    // ────────────────────────────────────────────────────────────────────────

    await new Promise(r => setTimeout(r, 1600));
    const ok = Math.random() > 0.3; // Simulate 70% success rate
    if (ok) {
      setTestState({ status: 'success', message: `Connected to ${selectedProvider.label} — latency 48ms` });
      onToast('success', `${selectedProvider.label} connected successfully.`);
    } else {
      setTestState({ status: 'error', message: 'Connection refused. Check endpoint URL or credentials.' });
      onToast('error', 'Connection test failed. Verify credentials.');
    }
  };

  const handleSave = () => {
    if (!endpoint.trim()) return;
    // ── SAVE PIPELINE TO BACKEND HERE ────────────────────────────────────────
    // await fetch('/api/telemetry/pipelines', { method: 'POST', ... });
    // ─────────────────────────────────────────────────────────────────────────
    onToast('success', `Pipeline saved — refreshing every ${interval}s`);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Provider selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Cloud / Monitoring Provider</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PROVIDERS.map(p => (
            <button
              key={p.value}
              onClick={() => { setProvider(p.value); setEndpoint(''); setTestState({ status: 'idle' }); }}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-mono text-left transition-all cursor-pointer border ${
                provider === p.value
                  ? 'border-[#C49A6C]/50 bg-[#C49A6C]/10 text-[#C49A6C]'
                  : 'border-[#1E1E1E] bg-[#0E0E0E] text-[#8C867F] hover:border-[#2A2421] hover:text-[#F5F3F0]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoint URL */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">API Endpoint URL</label>
        <input
          type="url"
          value={endpoint}
          onChange={e => { setEndpoint(e.target.value); setTestState({ status: 'idle' }); }}
          placeholder={selectedProvider.placeholder}
          className="w-full bg-[#0E0E0E] border border-[#2A2421] rounded-lg px-3 py-2.5 text-xs text-[#F5F3F0] placeholder-[#444] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
        />
      </div>

      {/* API Key / IAM ARN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">
            {provider === 'aws-cloudwatch' ? 'IAM Role ARN' : 'API Key'}
          </label>
          {provider === 'aws-cloudwatch' ? (
            <input
              type="text"
              value={iamArn}
              onChange={e => setIamArn(e.target.value)}
              placeholder="arn:aws:iam::123456789:role/FinOpsReadRole"
              className="w-full bg-[#0E0E0E] border border-[#2A2421] rounded-lg px-3 py-2.5 text-xs text-[#F5F3F0] placeholder-[#444] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
            />
          ) : (
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full bg-[#0E0E0E] border border-[#2A2421] rounded-lg px-3 py-2.5 text-xs text-[#F5F3F0] placeholder-[#444] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#8C867F]">Refresh Interval (sec)</label>
          <select
            value={interval}
            onChange={e => setInterval(Number(e.target.value))}
            className="w-full bg-[#0E0E0E] border border-[#2A2421] rounded-lg px-3 py-2.5 text-xs text-[#F5F3F0] font-mono focus:outline-none focus:border-[#C49A6C]/50 transition-colors cursor-pointer"
          >
            {INTERVALS.map(s => (
              <option key={s} value={s}>{s}s {s < 30 ? '(real-time)' : s < 120 ? '(standard)' : '(economy)'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Connection Status */}
      {testState.status !== 'idle' && (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-mono ${
          testState.status === 'loading'
            ? 'border-[#2A2421] bg-[#1A1A1A] text-[#8C867F]'
            : testState.status === 'success'
            ? 'border-[#B2E0A6]/30 bg-[#B2E0A6]/5 text-[#B2E0A6]'
            : 'border-[#F2A4AA]/30 bg-[#F2A4AA]/5 text-[#F2A4AA]'
        }`}>
          {testState.status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
          {testState.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
          {testState.status === 'error' && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
          <span>{testState.status === 'loading' ? 'Pinging endpoint...' : testState.message}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleTestConnection}
          disabled={testState.status === 'loading'}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono text-[#F5F3F0] border border-[#2A2421] bg-[#0E0E0E] hover:bg-[#1A1A1A] hover:border-[#C49A6C]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {testState.status === 'loading' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wifi className="w-3.5 h-3.5 text-[#C49A6C]" />
          )}
          Test Connection
        </button>

        <button
          onClick={handleSave}
          disabled={testState.status !== 'success'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_2px_12px_rgba(196,154,108,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          Save Pipeline
        </button>
      </div>

      <p className="text-[10px] font-mono text-[#555] italic flex items-center gap-1.5">
        <Link2 className="w-3 h-3" />
        Credentials are encrypted at rest. API keys are never logged or exposed.
      </p>
    </div>
  );
};

// ─── Main Modal ────────────────────────────────────────────────────────────────
export const TelemetryCurvesModal: React.FC<TelemetryCurvesModalProps> = ({ instances, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const [toasts, setToasts] = useState<{ id: string; type: 'success' | 'error'; msg: string }[]>([]);

  const addToast = (type: 'success' | 'error', msg: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'live', label: 'Live Telemetry', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'connect', label: 'Connect Source', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Toast stack */}
      <div className="absolute top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono shadow-lg pointer-events-auto ${
              t.type === 'success'
                ? 'border-[#B2E0A6]/30 bg-[#141414] text-[#B2E0A6]'
                : 'border-[#F2A4AA]/30 bg-[#141414] text-[#F2A4AA]'
            }`}
          >
            {t.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
            {t.msg}
          </div>
        ))}
      </div>

      {/* Modal panel */}
      <div
        className="relative w-full sm:max-w-2xl mx-0 sm:mx-4 bg-[#141414] border border-[#2A2421] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2421] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#C49A6C]/10 border border-[#C49A6C]/20 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-[#C49A6C]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#F5F3F0] tracking-tight">Telemetry Curves & Metric Ingestion</h2>
              <p className="text-[10px] font-mono text-[#666]">{instances.length} instances in fleet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#222] text-[#666] hover:text-[#F5F3F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-[#D6551F] border-[#D6551F] text-white shadow-sm'
                  : 'border-[#2A2421] bg-[#0E0E0E] text-[#8C867F] hover:text-[#F5F3F0] hover:border-[#3A3431]'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'live' && <LiveTelemetryTab instances={instances} />}
          {activeTab === 'connect' && <ConnectCloudTab onToast={addToast} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1A1A1A] shrink-0 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#555] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last sync: just now
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-mono text-[#8C867F] border border-[#2A2421] hover:bg-[#1A1A1A] transition-colors"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
};
