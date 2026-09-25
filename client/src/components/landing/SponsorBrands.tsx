import React from 'react';
import { Award, Cloud, Cpu, Database, Server, Layers, ShieldCheck, ExternalLink } from 'lucide-react';

interface SponsorBrand {
  id: string;
  name: string;
  tier: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const SPONSORS: SponsorBrand[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    tier: 'Advanced Technology Partner',
    category: 'Cloud Infrastructure',
    description: 'Deep integration with AWS Cost Explorer, EC2 Spot Instances, and Aurora RDS telemetry.',
    icon: Cloud,
    tag: 'APN Certified'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    tier: 'Premier AI FinOps Partner',
    category: 'AI & Data Cloud',
    description: 'Native telemetry pipelines for Compute Engine, Vertex AI GPU clusters, and BigQuery.',
    icon: Cpu,
    tag: 'Google Cloud Premier'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    tier: 'Azure AI Cloud Alliance',
    category: 'Enterprise Cloud',
    description: 'Certified automated remediation for Azure Virtual Machines and AKS cluster nodes.',
    icon: Server,
    tag: 'Azure Verified'
  },
  {
    id: 'datadog',
    name: 'Datadog Partner Network',
    tier: 'Ecosystem Technology Partner',
    category: 'Observability & Metrics',
    description: 'Bidirectional sync with Datadog APM metrics for zero-false-positive zombie detection.',
    icon: Layers,
    tag: 'Ecosystem Alliance'
  },
  {
    id: 'snowflake',
    name: 'Snowflake Ventures',
    tier: 'Enterprise Data Partner',
    category: 'Cloud Warehousing',
    description: 'Optimized FinOps intelligence for autonomous data warehouse and batch compute clusters.',
    icon: Database,
    tag: 'Strategic Partner'
  },
  {
    id: 'cncf',
    name: 'Cloud Native (CNCF)',
    tier: 'Certified Kubernetes Partner',
    category: 'Container Orchestration',
    description: 'Standards-compliant pod and node remediation across multi-region Kubernetes clusters.',
    icon: ShieldCheck,
    tag: 'CNCF Member'
  }
];

export const SponsorBrands: React.FC = () => {
  return (
    <section id="sponsors-section" className="w-full space-y-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#2A2421] pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#C49A6C]/10 text-[#C49A6C] border border-[#C49A6C]/30 inline-flex items-center gap-1.5 mb-2">
            <Award className="w-3 h-3" />
            Official Sponsor & Partner Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Backed & Co-Engineered with Cloud Giants
          </h2>
          <p className="text-sm text-[#A0A0A0] mt-1 max-w-2xl">
            FinOps AI partners with major cloud providers and enterprise infrastructure networks to ensure certified, zero-downtime remediation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8E8B85]">
          <span className="w-2 h-2 rounded-full bg-[#B2E0A6] animate-pulse" />
          <span>SOC2 Type II & Cloud Security Certified</span>
        </div>
      </div>

      {/* Sponsor Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SPONSORS.map((sponsor) => {
          const Icon = sponsor.icon;
          return (
            <div
              key={sponsor.id}
              className="p-4 rounded-xl bg-[#141414] border border-[#2A2421] hover:border-[#C49A6C]/40 hover:bg-[#1A1816] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#1C1A18] border border-[#2A2421] group-hover:border-[#C49A6C]/30 flex items-center justify-center text-[#C49A6C] mb-3 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-[#F5F3F0] transition-colors">
                  {sponsor.name}
                </h4>
                <p className="text-[10px] text-[#C49A6C] font-mono mt-0.5">
                  {sponsor.tier}
                </p>
                <p className="text-[11px] text-[#8E8B85] mt-2 line-clamp-2 leading-relaxed">
                  {sponsor.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#221D1B] flex items-center justify-between">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1F1D1B] text-[#A0A0A0] border border-[#2A2421]">
                  {sponsor.tag}
                </span>
                <ExternalLink className="w-3 h-3 text-[#666666] group-hover:text-[#C49A6C] transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
