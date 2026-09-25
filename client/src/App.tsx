import React, { useEffect, useState, useMemo } from 'react';
import { Topbar } from './components/layout/Topbar.js';
import { SummaryBanner } from './components/dashboard/SummaryBanner.js';
import { StatsOverview } from './components/dashboard/StatsOverview.js';
import { FilterToolbar } from './components/dashboard/FilterToolbar.js';
import { InstanceTable } from './components/dashboard/InstanceTable.js';
import { InstanceCards } from './components/dashboard/InstanceCards.js';
import { SkeletonTable } from './components/ui/SkeletonTable.js';
import { ToastContainer, ToastMessage } from './components/ui/Toast.js';
import { fireCelebrationConfetti } from './components/ui/Confetti.js';
import { ApprovalModal } from './components/modals/ApprovalModal.js';
import { RejectionModal } from './components/modals/RejectionModal.js';
import { InstanceDetailModal } from './components/modals/InstanceDetailModal.js';
import { AuditLogView } from './components/audit-log/AuditLogView.js';
import { FeedbackHistoryView } from './components/feedback/FeedbackHistoryView.js';
import { SettingsView } from './components/settings/SettingsView.js';
import { HeroSection } from './components/landing/HeroSection.js';
import { CustomerReviews } from './components/landing/CustomerReviews.js';
import { SponsorBrands } from './components/landing/SponsorBrands.js';
import { PricingPlans } from './components/landing/PricingPlans.js';
import { TermsAndConditions } from './components/landing/TermsAndConditions.js';
import { NavInfoModal } from './components/modals/NavInfoModal.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { ChatbotWidget } from './components/chat/ChatbotWidget.js';
import { TelemetryCurvesModal } from './components/dashboard/TelemetryCurvesModal.js';
import { useAuth } from './context/AuthContext.js';
import { LogOut } from 'lucide-react';
import { api } from './api/client.js';
import { InstanceTelemetry, AuditResponse, AugmentedInstance } from './types/index.js';

export function App() {
  const { user, signOut, openAuthModal } = useAuth();
  const [instances, setInstances] = useState<InstanceTelemetry[]>([]);
  const [audit, setAudit] = useState<AuditResponse | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'audit-log' | 'feedback' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [navModalType, setNavModalType] = useState<'features' | 'reviews' | 'pricing' | 'signin' | 'register' | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState('all');
  const [selectedEnv, setSelectedEnv] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');

  // Modals state
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionTarget, setRejectionTarget] = useState<AugmentedInstance | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<AugmentedInstance | null>(null);
  const [telemetryModalOpen, setTelemetryModalOpen] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [fetchedInstances, latestAudit] = await Promise.all([
        api.getInstances(),
        api.getLatestAudit().catch(() => null)
      ]);
      setInstances(fetchedInstances);

      if (latestAudit) {
        setAudit(latestAudit);
      } else {
        // Run audit if none exists
        handleRunAudit();
      }
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to connect to backend', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    try {
      setIsAuditing(true);
      const newAudit = await api.runAudit();
      setAudit(newAudit);
      addToast(
        'success',
        'Fleet Audit Complete',
        `Identified ${newAudit.zombiesCount} zombie instances with $${newAudit.totalMonthlyWaste.toLocaleString()}/mo potential savings.`
      );
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Audit Failed', err.message);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleResetDemo = async () => {
    try {
      setLoading(true);
      await api.resetDemo();
      setSelectedIds(new Set());
      await loadInitialData();
      addToast('info', 'Demo State Reset', 'Restored 12 pristine cloud instances and fresh audit.');
    } catch (err: any) {
      addToast('error', 'Reset Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Augment instances with current audit result
  const augmentedInstances: AugmentedInstance[] = useMemo(() => {
    const auditMap = new Map((audit?.perInstance || []).map((a) => [a.instanceId, a]));
    return instances.map((inst) => ({
      ...inst,
      audit: auditMap.get(inst.id),
      isSelected: selectedIds.has(inst.id)
    }));
  }, [instances, audit, selectedIds]);

  // Filter instances
  const filteredInstances = useMemo(() => {
    return augmentedInstances.filter((inst) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = inst.name.toLowerCase().includes(q);
        const matchesId = inst.id.toLowerCase().includes(q);
        const matchesOwner = inst.tags.owner?.toLowerCase().includes(q) || false;
        const matchesTeam = inst.tags.team?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesId && !matchesOwner && !matchesTeam) return false;
      }

      // Verdict filter
      if (selectedVerdict !== 'all') {
        if (inst.audit?.verdict !== selectedVerdict) return false;
      }

      // Env filter
      if (selectedEnv !== 'all') {
        if (inst.tags.env !== selectedEnv) return false;
      }

      // Provider filter
      if (selectedProvider !== 'all') {
        if (inst.provider !== selectedProvider) return false;
      }

      return true;
    });
  }, [augmentedInstances, searchQuery, selectedVerdict, selectedEnv, selectedProvider]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllZombies = () => {
    const zombieIds = augmentedInstances
      .filter((i) => i.audit?.verdict === 'zombie' && i.status !== 'terminated')
      .map((i) => i.id);
    setSelectedIds(new Set(zombieIds));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredInstances.filter((i) => i.status !== 'terminated').map((i) => i.id);
    const allSelected = visibleIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleIds));
    }
  };

  // Termination workflow
  const selectedInstances = useMemo(() => {
    return augmentedInstances.filter((i) => selectedIds.has(i.id));
  }, [augmentedInstances, selectedIds]);

  const selectedSavings = useMemo(() => {
    return selectedInstances.reduce((sum, i) => sum + i.monthlyCost, 0);
  }, [selectedInstances]);

  const handleOpenApprovalModal = () => {
    if (selectedInstances.length === 0) return;
    setApprovalModalOpen(true);
  };

  const handleQuickTerminate = (instance: AugmentedInstance) => {
    setSelectedIds(new Set([instance.id]));
    setApprovalModalOpen(true);
  };

  const handleConfirmTermination = async (
    instanceIds: string[],
    reason: string,
    forceProduction: boolean
  ) => {
    // Optimistic UI state update
    const previousInstances = [...instances];
    const previousAudit = audit ? { ...audit } : null;

    setInstances((prev) =>
      prev.map((inst) =>
        instanceIds.includes(inst.id) ? { ...inst, status: 'terminated' } : inst
      )
    );

    setSelectedIds((prev) => {
      const next = new Set(prev);
      instanceIds.forEach((id) => next.delete(id));
      return next;
    });

    try {
      const res = await api.terminateInstances({
        instanceIds,
        reason,
        forceProduction
      });

      // Celebration burst!
      fireCelebrationConfetti();

      addToast(
        'success',
        'Instances Decommissioned',
        `Successfully terminated ${res.terminatedCount} server(s). Monthly recurring savings unlocked: $${res.totalMonthlySaved.toLocaleString()}/mo.`
      );

      // Refresh fresh instances and audit
      const [updatedList, updatedAudit] = await Promise.all([
        api.getInstances(),
        api.getLatestAudit()
      ]);
      setInstances(updatedList);
      if (updatedAudit) setAudit(updatedAudit);
    } catch (err: any) {
      // Rollback on failure
      setInstances(previousInstances);
      if (previousAudit) setAudit(previousAudit);
      addToast('error', 'Termination Blocked', err.message);
      throw err;
    }
  };

  // Rejection & feedback workflow
  const handleOpenFeedbackModal = (instance: AugmentedInstance) => {
    setRejectionTarget(instance);
    setRejectionModalOpen(true);
  };

  const handleSubmitFeedback = async (data: {
    instanceId: string;
    reason: string;
    team: string;
    manager: string;
    action: 'reject_zombie' | 'whitelist' | 'schedule_review';
  }) => {
    try {
      const feedback = await api.submitFeedback(data);
      addToast(
        'info',
        'Manager Feedback Saved',
        `Flag rejected. Instance tagged with "Treat Cautiously" for ${feedback.team}.`
      );

      // Refresh instances to show previousFeedback badge
      const updatedList = await api.getInstances();
      setInstances(updatedList);
    } catch (err: any) {
      addToast('error', 'Feedback Submission Failed', err.message);
    }
  };

  // Inspection modal
  const handleInspect = (instance: AugmentedInstance) => {
    setDetailTarget(instance);
    setDetailModalOpen(true);
  };

  const activeZombieCount = augmentedInstances.filter(
    (i) => i.audit?.verdict === 'zombie' && i.status !== 'terminated'
  ).length;

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#EDEAE5] selection:bg-[#D6551F] selection:text-white pb-20 md:pb-0 flex flex-col w-full">
      <Topbar
        totalMonthlyWaste={audit?.totalMonthlyWaste || 0}
        totalFleetSpend={audit?.totalCurrentSpend || 0}
        providerUsed={audit?.providerUsed}
        isAuditing={isAuditing}
        onRunAudit={handleRunAudit}
        onResetDemo={handleResetDemo}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
        onOpenNavModal={(type) => setNavModalType(type)}
        zombieCount={activeZombieCount}
        feedbackCount={instances.filter((i) => i.previousFeedback).length}
      />

        {currentView === 'dashboard' && (
          <HeroSection
            onRunAudit={handleRunAudit}
            onViewAuditTrail={() => setCurrentView('audit-log')}
            isAuditing={isAuditing}
            totalMonthlyWaste={audit?.totalMonthlyWaste || 0}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {currentView === 'dashboard' && (
            <div id="fleet-section" className="space-y-6">
              {/* Dashboard User Session & Logout Bar */}
              {user ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#141414] border border-[#C49A6C]/30 shadow-editorial-card">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C49A6C] to-[#B38350] text-[#0E0E0E] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {user.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white font-sans">
                          {user.user_metadata?.full_name || user.email}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#B2E0A6] bg-[#B2E0A6]/10 border border-[#B2E0A6]/30">
                          Active Supabase Session
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8B85] font-mono mt-0.5">
                        Authenticated via Supabase Auth • Autonomous fleet control active
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[#EDEAE5] bg-[#1A1816] hover:bg-[#EAE2D5] hover:text-[#181614] hover:border-[#D6CCC0] border border-[#3E3833] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    title="Sign out of Supabase session"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#C49A6C]" />
                    <span>Dashboard Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#141414] border border-[#2A2421]">
                  <div className="flex items-center gap-2.5 text-xs text-[#A6A29A]">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span>Demo Mode. Sign in with Supabase to persist cloud credentials and custom audit rules.</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openAuthModal('signin')}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white bg-[#1C1A18] border border-[#2A2421] hover:border-[#C49A6C]/40 transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] transition-colors cursor-pointer"
                    >
                      +Register
                    </button>
                  </div>
                </div>
              )}

              {/* Executive Summary Card with Typewriter Effect */}
              {audit && (
                <SummaryBanner
                  summary={audit.executiveSummary}
                  providerUsed={audit.providerUsed}
                  generatedAt={audit.generatedAt}
                  zombieCount={audit.zombiesCount}
                  totalWaste={audit.totalMonthlyWaste}
                />
              )}

              {/* Stats KPI Overview */}
              <StatsOverview audit={audit} totalInstances={instances.length} />

              {/* Filter and Action Toolbar */}
              <FilterToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedVerdict={selectedVerdict}
                onVerdictChange={setSelectedVerdict}
                selectedEnv={selectedEnv}
                onEnvChange={setSelectedEnv}
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
                selectedCount={selectedIds.size}
                totalZombiesCount={activeZombieCount}
                onSelectAllZombies={handleSelectAllZombies}
                onDeselectAll={handleDeselectAll}
                onOpenApprovalModal={handleOpenApprovalModal}
                selectedSavings={selectedSavings}
                isAuditing={isAuditing}
                onRunAudit={handleRunAudit}
                onOpenTelemetry={() => setTelemetryModalOpen(true)}
              />

              {/* Fleet Instances: Skeleton loader during audit or table */}
              {isAuditing ? (
                <SkeletonTable />
              ) : filteredInstances.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#141414] border border-[#2A2421]">
                  <p className="text-[#8E8B85] font-mono text-sm">
                    No instances match the current filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedVerdict('all');
                      setSelectedEnv('all');
                      setSelectedProvider('all');
                    }}
                    className="mt-3 px-4 py-1.5 text-xs font-mono tracking-wider uppercase text-[#D6551F] bg-[#D6551F]/10 border border-[#D6551F]/30 rounded-full hover:bg-[#D6551F]/20 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block">
                    <InstanceTable
                      instances={filteredInstances}
                      selectedIds={selectedIds}
                      onToggleSelect={handleToggleSelect}
                      onSelectAllVisible={handleSelectAllVisible}
                      onInspect={handleInspect}
                      onQuickTerminate={handleQuickTerminate}
                      onOpenFeedbackModal={handleOpenFeedbackModal}
                      onOpenTelemetry={() => setTelemetryModalOpen(true)}
                    />
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden">
                    <InstanceCards
                      instances={filteredInstances}
                      selectedIds={selectedIds}
                      onToggleSelect={handleToggleSelect}
                      onInspect={handleInspect}
                      onQuickTerminate={handleQuickTerminate}
                      onOpenFeedbackModal={handleOpenFeedbackModal}
                    />
                  </div>
                </>
              )}

              {/* 1. Feedback Section with Good Reviews */}
              <CustomerReviews onNotify={addToast} />

              {/* 2. Sponsor Brand Names */}
              <SponsorBrands />

              {/* 3. Basic Plan & Pro Plan to Buy */}
              <PricingPlans onNotify={addToast} />

              {/* 4. Terms & Conditions with Legal Templates & UI */}
              <TermsAndConditions onNotify={addToast} />
            </div>
          )}

          {currentView === 'audit-log' && <AuditLogView />}

          {currentView === 'feedback' && <FeedbackHistoryView />}

          {currentView === 'settings' && (
            <SettingsView onNotify={addToast} onResetDemo={handleResetDemo} />
          )}

          {/* Editorial Footer */}
          <footer className="mt-16 pt-8 pb-10 border-t border-[#2A2421] text-center space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#8E8B85]">
              CLOUDFLEET FINOPS AGENT © 2026 — ALL EDITIONS RESERVED
            </p>
            <p className="font-serif italic text-xs text-[#8E8B85]/70 max-w-lg mx-auto">
              Crafted with deliberate architectural restraint for those who define the skyline of modern infrastructure governance.
            </p>
          </footer>
        </main>

      {/* Mobile Bottom Dock Bar (matching screenshot layout) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-xl border-t border-[#2A2421] px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-colors ${
            currentView === 'dashboard' ? 'text-[#D6551F]' : 'text-[#8E8B85] hover:text-[#EDEAE5]'
          }`}
        >
          <span className="text-base leading-none">◫</span>
          <span>STUDIO</span>
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-mono tracking-widest uppercase text-[#8E8B85] hover:text-[#EDEAE5] transition-colors"
        >
          <span className="text-base leading-none">⌘</span>
          <span>WORKS</span>
        </button>
        <button
          onClick={() => setCurrentView('audit-log')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-colors ${
            currentView === 'audit-log' ? 'text-[#D6551F]' : 'text-[#8E8B85] hover:text-[#EDEAE5]'
          }`}
        >
          <span className="text-base leading-none">▤</span>
          <span>EDITIONS</span>
        </button>
        <button
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-colors ${
            currentView === 'settings' ? 'text-[#D6551F]' : 'text-[#8E8B85] hover:text-[#EDEAE5]'
          }`}
        >
          <span className="text-base leading-none">◌</span>
          <span>CONTACT</span>
        </button>
      </nav>

      {/* Modals */}
      <ApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        instances={selectedInstances}
        totalFleetSpend={audit?.totalCurrentSpend || 0}
        onConfirm={handleConfirmTermination}
      />

      <RejectionModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        instance={rejectionTarget}
        onSubmit={handleSubmitFeedback}
      />

      <InstanceDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        instance={detailTarget}
      />

      {/* Telemetry Curves & Metric Ingestion Modal */}
      {telemetryModalOpen && (
        <TelemetryCurvesModal
          instances={augmentedInstances}
          onClose={() => setTelemetryModalOpen(false)}
        />
      )}


      {/* Nav Info Modal (Features, Reviews, Pricing, Auth) */}
      <NavInfoModal
        type={navModalType}
        onClose={() => setNavModalType(null)}
        onNotify={addToast}
      />

      {/* Supabase Authentication Modal (Sign In, Register, Forgot Password) */}
      <AuthModal onNotify={addToast} />

      {/* Modern Premium Chatbot UI powered by Gemini Flash (multi-turn conversation) */}
      <ChatbotWidget />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
