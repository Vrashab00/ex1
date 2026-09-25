import React, { useEffect, useState } from 'react';
import { Save, RotateCcw, ShieldCheck, Bot, ArrowUpRight } from 'lucide-react';
import { AppSettings } from '../../types/index.js';
import { api } from '../../api/client.js';

interface SettingsViewProps {
  onNotify: (type: 'success' | 'error' | 'info', title: string, msg?: string) => void;
  onResetDemo: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNotify, onResetDemo }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      setSettings(data);
    } catch (err: any) {
      onNotify('error', 'Failed to load settings', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      onNotify('success', 'Policies Saved', 'Autonomous FinOps thresholds updated.');
    } catch (err: any) {
      onNotify('error', 'Failed to update settings', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset fleet to initial state with 12 mock servers and fresh audit?')) return;
    setResetting(true);
    try {
      await onResetDemo();
      onNotify('success', 'Fleet State Reset', 'Restored 12 pristine cloud instances and fresh audit.');
    } catch (err: any) {
      onNotify('error', 'Reset failed', err.message);
    } finally {
      setResetting(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-[#666666] font-mono text-sm">Loading FinOps policies...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6 font-['Work_Sans',sans-serif]">
      <div>
        <span className="text-[10px] font-['Space_Grotesk',sans-serif] font-bold tracking-[0.16em] uppercase text-[#D6551F] block mb-1">
          ■ System Architecture & Thresholds
        </span>
        <h1 className="text-2xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F3F0] tracking-tight">
          FinOps Agent Guardrails & Policy Configuration
        </h1>
        <p className="text-xs text-[#A0A0A0] font-mono mt-1">
          Tune autonomous decision thresholds, LLM providers, and safety guardrails
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* LLM Engine Selection */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#2A2421] shadow-editorial-card space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold font-['Space_Grotesk',sans-serif] text-[#D6551F] uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>LLM Intelligence Provider</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-[#A0A0A0] mb-1">
                Active Provider:
              </label>
              <select
                value={settings.aiProvider}
                onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value as any })}
                className="w-full px-3 py-2 text-xs font-['Space_Grotesk',sans-serif] bg-[#161616] border border-[#2A2421] rounded-xl text-[#F5F3F0] focus:outline-none focus:border-[#D6551F] cursor-pointer"
              >
                <option value="auto">Auto (Detect configured API keys)</option>
                <option value="gemini">Google Gemini (Official SDK)</option>
                <option value="openai">OpenAI (gpt-4o-mini)</option>
                <option value="heuristic">Built-in Heuristic FinOps Engine</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-[#A0A0A0] mb-1">
                Gemini Model:
              </label>
              <input
                type="text"
                value={settings.geminiModel}
                onChange={(e) => setSettings({ ...settings, geminiModel: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono bg-[#161616] border border-[#2A2421] rounded-xl text-[#F5F3F0] focus:outline-none focus:border-[#D6551F]"
              />
            </div>
          </div>
        </div>

        {/* Safety & Thresholds */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#2A2421] shadow-editorial-card space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold font-['Space_Grotesk',sans-serif] text-[#FFB59B] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#D6551F]" />
            <span>Guardrails & Idle Detection Policies</span>
          </div>

          {/* Auto Protect Prod Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#161616] border border-[#2A2421]">
            <div>
              <h4 className="text-sm font-bold font-['Space_Grotesk',sans-serif] text-[#F5F3F0]">Strict Production Immunity</h4>
              <p className="text-xs text-[#A0A0A0] font-mono mt-0.5">
                Never classify instances tagged with <code className="text-[#D6551F]">env: prod</code> as zombies regardless of low telemetry.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoProtectProd}
                onChange={(e) => setSettings({ ...settings, autoProtectProd: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#221D1B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D6551F]"></div>
            </label>
          </div>

          {/* Confidence Threshold */}
          <div>
            <div className="flex justify-between items-center text-xs font-['Space_Grotesk',sans-serif] mb-1.5">
              <span className="text-[#A0A0A0]">Minimum AI Confidence Score for Automatic Zombie Flagging:</span>
              <span className="font-bold text-[#D6551F] font-mono">{settings.confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              value={settings.confidenceThreshold}
              onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })}
              className="w-full accent-[#D6551F] cursor-pointer"
            />
          </div>

          {/* Idle CPU */}
          <div>
            <div className="flex justify-between items-center text-xs font-['Space_Grotesk',sans-serif] mb-1.5">
              <span className="text-[#A0A0A0]">Max Idle CPU Ceiling for Zombie Classification:</span>
              <span className="font-bold text-[#D6551F] font-mono">{settings.maxCpuIdleThreshold}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={settings.maxCpuIdleThreshold}
              onChange={(e) => setSettings({ ...settings, maxCpuIdleThreshold: Number(e.target.value) })}
              className="w-full accent-[#D6551F] cursor-pointer"
            />
          </div>

          {/* Idle Days */}
          <div>
            <div className="flex justify-between items-center text-xs font-['Space_Grotesk',sans-serif] mb-1.5">
              <span className="text-[#A0A0A0]">Inactivity Window Threshold:</span>
              <span className="font-bold text-[#D6551F] font-mono">{settings.idleDaysThreshold} days</span>
            </div>
            <input
              type="range"
              min={7}
              max={90}
              value={settings.idleDaysThreshold}
              onChange={(e) => setSettings({ ...settings, idleDaysThreshold: Number(e.target.value) })}
              className="w-full accent-[#D6551F] cursor-pointer"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="btn-pill-ghost text-xs cursor-pointer text-[#FFB59B]"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>RESET DEMO FLEET</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn-pill-primary text-xs cursor-pointer"
          >
            <span>{saving ? 'SAVING...' : 'SAVE POLICIES'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
