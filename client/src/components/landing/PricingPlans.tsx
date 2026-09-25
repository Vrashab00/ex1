import React, { useState } from 'react';
import { Check, Zap, Sparkles, Shield, ArrowRight, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { fireCelebrationConfetti } from '../ui/Confetti.js';

interface PricingPlansProps {
  onNotify?: (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onNotify }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('pro');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const basicPrice = isAnnual ? 39 : 49;
  const proPrice = isAnnual ? 159 : 199;

  const handleOpenCheckout = (plan: 'basic' | 'pro') => {
    setSelectedPlan(plan);
    setPurchaseSuccess(false);
    setCheckoutModalOpen(true);
  };

  const handleCompletePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseSuccess(true);
      fireCelebrationConfetti();
      if (onNotify) {
        onNotify(
          'success',
          `${selectedPlan === 'pro' ? 'Pro Plan' : 'Basic Plan'} Activated!`,
          `Welcome to FinOps AI. Your autonomous agent license has been enabled for ${billingEmail || 'your account'}.`
        );
      }
    }, 1200);
  };

  return (
    <section id="pricing-section" className="w-full space-y-6 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2A2421] pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#C49A6C]/10 text-[#C49A6C] border border-[#C49A6C]/30 inline-flex items-center gap-1.5 mb-2">
            <Zap className="w-3 h-3" />
            Transparent Cloud Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Choose Your FinOps Remediation Plan
          </h2>
          <p className="text-sm text-[#A0A0A0] mt-1 max-w-2xl">
            Recover thousands in dormant compute every month. Zero surprise overages, cancel anytime.
          </p>
        </div>

        {/* Annual / Monthly Toggle */}
        <div className="flex items-center gap-2 p-1 rounded-full bg-[#141414] border border-[#2A2421] self-start sm:self-auto">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              !isAnnual ? 'bg-[#25221F] text-white shadow-sm' : 'text-[#8E8B85] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isAnnual ? 'bg-[#C49A6C] text-[#0E0E0E] font-bold shadow-sm' : 'text-[#8E8B85] hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-[#0E0E0E] font-extrabold uppercase tracking-tight">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <div className="p-7 rounded-2xl bg-[#141414] border border-[#2A2421] hover:border-[#3E3430] transition-all flex flex-col justify-between relative shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-sans">Basic Plan</h3>
                <p className="text-xs text-[#8E8B85] mt-1">For startups and lean engineering teams taking control of cloud spend.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#1A1816] text-[#A0A0A0] border border-[#2A2421]">
                Starter Fleet
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-6 font-sans">
              <span className="text-4xl font-extrabold text-white">${basicPrice}</span>
              <span className="text-xs text-[#8E8B85] font-mono">/month</span>
              {isAnnual && (
                <span className="text-[11px] font-mono text-[#B2E0A6] ml-2">billed annually ($468/yr)</span>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-[#221D1B] text-xs">
              <p className="font-semibold text-white uppercase text-[10px] tracking-wider text-[#A0A0A0]">
                Included in Basic:
              </p>
              {[
                'Up to 50 cloud compute & database instances',
                'Single cloud provider connection (AWS or GCP)',
                'Heuristic & rule-based zombie detection engine',
                'Weekly automated fleet audit scans',
                '1-click batch server termination',
                '30-day immutable audit trail history',
                'Standard email alerting & notifications'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-[#C2BEB7]">
                  <Check className="w-4 h-4 text-[#C49A6C] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleOpenCheckout('basic')}
              className="w-full py-3 rounded-full text-xs font-semibold tracking-wide text-white bg-[#1A1816] hover:bg-[#25221F] border border-[#3E3833] hover:border-[#C49A6C]/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Buy Basic Plan</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C49A6C]" />
            </button>
          </div>
        </div>

        {/* Pro Plan (Featured) */}
        <div className="p-7 rounded-2xl bg-gradient-to-b from-[#1A1612] via-[#141414] to-[#12100E] border-2 border-[#C49A6C]/80 hover:border-[#C49A6C] transition-all flex flex-col justify-between relative shadow-xl shadow-amber-950/20">
          {/* Badge */}
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#C49A6C] to-[#B38350] text-[#0E0E0E] shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-[#0E0E0E]" />
            Most Popular • Recommended
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                  Pro Plan
                  <span className="w-2 h-2 rounded-full bg-[#B2E0A6] animate-pulse" />
                </h3>
                <p className="text-xs text-[#8E8B85] mt-1">Autonomous Gemini 2.5 AI agent for high-velocity multi-cloud fleets.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#C49A6C]/20 text-[#C49A6C] border border-[#C49A6C]/40 font-bold">
                Enterprise AI
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-6 font-sans">
              <span className="text-4xl font-extrabold text-white">${proPrice}</span>
              <span className="text-xs text-[#8E8B85] font-mono">/month</span>
              {isAnnual && (
                <span className="text-[11px] font-mono text-[#B2E0A6] ml-2">billed annually ($1,908/yr)</span>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-[#2A2421] text-xs">
              <p className="font-semibold text-white uppercase text-[10px] tracking-wider text-[#C49A6C]">
                Everything in Basic, plus:
              </p>
              {[
                'Unlimited instances across AWS, GCP & Microsoft Azure',
                'Autonomous Gemini 2.5 Flash agent & real-time telemetry curves',
                'Zero-downtime safety protection on production tier',
                'Continuous manager feedback learning loop (no repeat errors)',
                'Automated Slack, Discord & Webhook alert bots',
                'SOC2 Type II & FinOps audit export reports',
                'Dedicated 24/7 FinOps engineering architect support',
                '14-day zero-risk trial with instant setup'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-[#EDEAE5]">
                  <Check className="w-4 h-4 text-[#B2E0A6] shrink-0" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleOpenCheckout('pro')}
              className="w-full py-3 rounded-full text-xs font-bold tracking-wide text-white bg-gradient-to-r from-[#C49A6C] via-[#B88B5B] to-[#D6551F] hover:from-[#B88B5B] hover:to-[#B34516] shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Buy Pro Plan (Start 14-Day Free Trial)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#141414] border border-[#3E3430] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2421] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C49A6C]/10 border border-[#C49A6C]/30 flex items-center justify-center text-[#C49A6C]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Checkout: {selectedPlan === 'pro' ? 'Pro Plan' : 'Basic Plan'}
                  </h3>
                  <p className="text-xs text-[#8E8B85]">
                    {isAnnual ? 'Annual Billing (20% Off)' : 'Monthly Billing'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-[#8E8B85] hover:text-white text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {purchaseSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#B2E0A6]/10 border border-[#B2E0A6]/30 flex items-center justify-center text-[#B2E0A6] mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Purchase Successful!</h4>
                  <p className="text-xs text-[#A0A0A0] mt-1 max-w-xs mx-auto">
                    Your {selectedPlan === 'pro' ? 'Pro Plan' : 'Basic Plan'} license has been provisioned. Autonomous telemetry curves and remediation agents are active.
                  </p>
                </div>
                <button
                  onClick={() => setCheckoutModalOpen(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#C49A6C] hover:bg-[#B88B5B] cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleCompletePurchase} className="space-y-3.5 text-xs">
                {/* Summary banner */}
                <div className="p-3 rounded-xl bg-[#1A1816] border border-[#2A2421] flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">
                      {selectedPlan === 'pro' ? 'Pro Plan License' : 'Basic Plan License'}
                    </span>
                    <span className="text-[#8E8B85] text-[11px]">
                      {isAnnual ? '1 Year License' : '1 Month License'} • Cancel anytime
                    </span>
                  </div>
                  <span className="text-lg font-extrabold text-[#C49A6C]">
                    ${selectedPlan === 'pro' ? proPrice : basicPrice}/mo
                  </span>
                </div>

                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-medium">Work / Billing Email *</label>
                  <input
                    type="email"
                    required
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="architect@company.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C]"
                  />
                </div>

                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-medium">Card Number *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C] font-mono"
                    />
                    <CreditCard className="w-4 h-4 text-[#8E8B85] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#A0A0A0] mb-1 font-medium">Expiry (MM/YY) *</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A0A0A0] mb-1 font-medium">CVC / CWW *</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C] font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[#8E8B85] pt-1">
                  <Lock className="w-3 h-3 text-[#B2E0A6]" />
                  <span>256-Bit SSL Encrypted & Stripe PCI-DSS Level 1 Verified</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2A2421]">
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs text-[#8E8B85] hover:text-white bg-[#1A1A1A] border border-[#2A2421] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authorizing...</span>
                      </>
                    ) : (
                      <span>Complete Purchase (${selectedPlan === 'pro' ? proPrice : basicPrice})</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
