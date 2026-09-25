import React, { useState } from 'react';
import { Lock, UserPlus, Cloud, RotateCcw, ArrowUpRight, Menu, X, ShieldAlert, Sliders, ScrollText, MessageSquareQuote, LogOut, User as UserIcon } from 'lucide-react';
import { WasteCounter } from '../dashboard/WasteCounter.js';
import { useAuth } from '../../context/AuthContext.js';

interface TopbarProps {
  totalMonthlyWaste: number;
  totalFleetSpend: number;
  providerUsed?: string;
  isAuditing: boolean;
  onRunAudit: () => void;
  onResetDemo: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenNavModal: (type: 'features' | 'reviews' | 'pricing' | 'signin' | 'register') => void;
  zombieCount?: number;
  feedbackCount?: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  totalMonthlyWaste,
  totalFleetSpend,
  providerUsed = 'Built-in Engine',
  isAuditing,
  onRunAudit,
  onResetDemo,
  currentView,
  onNavigate,
  onOpenNavModal,
  zombieCount = 0,
  feedbackCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E0E0E]/95 backdrop-blur-xl border-b border-[#2A2421] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo matching screenshot */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#A6A29A] hover:text-[#181614] hover:bg-[#EAE2D5] rounded-lg bg-[#181614] border border-[#2A2421] hover:border-[#D6CCC0] cursor-pointer transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            {/* Golden-tan logo mark from screenshot */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C49A6C] via-[#B88B5B] to-[#D6551F] flex items-center justify-center text-white shadow-md shadow-amber-900/30 group-hover:scale-105 transition-transform">
              <Cloud className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
            </div>

            <span className="font-sans font-bold text-xl tracking-tight text-white transition-colors">
              FinOps<span className="text-[#C49A6C]">.Ai</span>
            </span>
          </button>
        </div>

        {/* Center: Top Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium tracking-wide">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-all duration-200 cursor-pointer relative px-3.5 py-1.5 rounded-full ${
              currentView === 'dashboard'
                ? 'text-white font-semibold hover:bg-[#EAE2D5] hover:text-[#181614]'
                : 'text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614]'
            }`}
          >
            Dashboard
            {currentView === 'dashboard' && (
              <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#C49A6C] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('audit-log')}
            className={`transition-all duration-200 cursor-pointer relative px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${
              currentView === 'audit-log'
                ? 'text-white font-semibold hover:bg-[#EAE2D5] hover:text-[#181614]'
                : 'text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614]'
            }`}
          >
            <span>Audit Trail</span>
            {currentView === 'audit-log' && (
              <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#C49A6C] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('feedback')}
            className={`transition-all duration-200 cursor-pointer relative px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${
              currentView === 'feedback'
                ? 'text-white font-semibold hover:bg-[#EAE2D5] hover:text-[#181614]'
                : 'text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614]'
            }`}
          >
            <span>Feedback</span>
            {currentView === 'feedback' && (
              <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#C49A6C] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`transition-all duration-200 cursor-pointer relative px-3.5 py-1.5 rounded-full ${
              currentView === 'settings'
                ? 'text-white font-semibold hover:bg-[#EAE2D5] hover:text-[#181614]'
                : 'text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614]'
            }`}
          >
            Settings
            {currentView === 'settings' && (
              <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#C49A6C] rounded-full" />
            )}
          </button>

          <span className="text-[#332F2B] px-1 transition-colors">|</span>

          <button
            onClick={() => {
              if (currentView !== 'dashboard') onNavigate('dashboard');
              setTimeout(() => {
                document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614] px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
          >
            Reviews
          </button>

          <button
            onClick={() => {
              if (currentView !== 'dashboard') onNavigate('dashboard');
              setTimeout(() => {
                document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614] px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
          >
            Pricing
          </button>

          <button
            onClick={() => {
              if (currentView !== 'dashboard') onNavigate('dashboard');
              setTimeout(() => {
                document.getElementById('terms-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614] px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
          >
            Terms
          </button>
        </nav>

        {/* Right: Auth & User Session Buttons */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              {/* User Profile Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1A18] border border-[#2A2421]">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#C49A6C] to-[#B38350] text-[#0E0E0E] flex items-center justify-center font-bold text-[10px] uppercase">
                  {user.email?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-mono text-[#D5D0C8] max-w-[130px] truncate hidden sm:inline">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="group/logout px-3.5 py-1.5 rounded-full text-xs font-medium text-[#EDEAE5] bg-[#1A1816] hover:bg-[#EAE2D5] hover:text-[#181614] hover:border-[#D6CCC0] border border-[#3E3833] transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Sign out of Supabase session"
              >
                <LogOut className="w-3.5 h-3.5 text-[#C49A6C] group-hover/logout:text-[#8C6239] transition-colors" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Sign In Button */}
              <button
                onClick={() => openAuthModal('signin')}
                className="group/signin px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-[#EDEAE5] bg-[#1A1816] hover:bg-[#EAE2D5] hover:text-[#181614] hover:border-[#D6CCC0] border border-[#3E3833] transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-[#C49A6C] group-hover/signin:text-[#8C6239] transition-colors" />
                <span>Sign In</span>
              </button>

              {/* Register Button (Golden-Tan Solid Pill) */}
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_2px_14px_rgba(196,154,108,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+Register</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#2A2421] space-y-2">
          {user && (
            <div className="px-3 py-2 rounded-lg bg-[#1C1A18] border border-[#2A2421] flex items-center justify-between">
              <span className="text-xs text-[#A6A29A] font-mono truncate">{user.email}</span>
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-[#D6551F] font-semibold hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
          <button
            onClick={() => {
              onNavigate('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'dashboard' ? 'bg-[#25221F] text-white' : 'text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              onNavigate('audit-log');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
              currentView === 'audit-log' ? 'bg-[#25221F] text-white' : 'text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614]'
            }`}
          >
            <span>Audit Trail</span>
            {zombieCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-[#D6551F] text-white rounded-full">
                {zombieCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onNavigate('feedback');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'feedback' ? 'bg-[#25221F] text-white' : 'text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614]'
            }`}
          >
            Feedback History
          </button>
          <button
            onClick={() => {
              onNavigate('settings');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'settings' ? 'bg-[#25221F] text-white' : 'text-[#A6A29A] hover:bg-[#EAE2D5] hover:text-[#181614]'
            }`}
          >
            Settings
          </button>

          {!user && (
            <div className="pt-2 border-t border-[#2A2421] flex gap-2">
              <button
                onClick={() => {
                  openAuthModal('signin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-medium text-white bg-[#1A1816] border border-[#2A2421] rounded-lg hover:bg-[#EAE2D5] hover:text-[#181614] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  openAuthModal('register');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-semibold text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] rounded-lg transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
