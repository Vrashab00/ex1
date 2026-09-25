import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Shield, Zap, DollarSign, Lock, UserPlus, ArrowRight, KeyRound, Mail, RefreshCw } from 'lucide-react';

interface NavInfoModalProps {
  type: 'features' | 'reviews' | 'pricing' | 'signin' | 'register' | null;
  onClose: () => void;
  onNotify?: (type: 'success' | 'info' | 'warning', title: string, message?: string) => void;
}

export const NavInfoModal: React.FC<NavInfoModalProps> = ({ type, onClose, onNotify }) => {
  // Auth state
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('finops.lead@enterprise.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('DevOps Architect');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [demoCode, setDemoCode] = useState('849201');
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Reset state on open
    if (type === 'signin' || type === 'register') {
      setAuthStep('credentials');
      setOtp(['', '', '', '', '', '']);
      setCountdown(30);
    }
  }, [type]);

  useEffect(() => {
    let timer: any;
    if (authStep === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [authStep, countdown]);

  if (!type) return null;

  // Direct Sign In (no OTP needed)
  const handleDirectSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onNotify?.('warning', 'Missing Details', 'Please provide your email and password.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onNotify?.('success', 'Authenticated', `Welcome back, FinOps Lead (${email}).`);
      onClose();
    }, 500);
  };

  // Register: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onNotify?.('warning', 'Missing Details', 'Please provide both email and password.');
      return;
    }
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoCode(randomCode);
    setAuthStep('otp');
    setCountdown(30);
    onNotify?.('info', 'One-Time Passcode Sent', `Verification code sent to ${email}. (Demo Code: ${randomCode})`);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) {
      onNotify?.('warning', 'Invalid OTP', 'Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onNotify?.('success', 'Registration Verified', `Welcome, ${fullName}! Account created and authenticated via OTP.`);
      onClose();
    }, 600);
  };

  const handleAutoFillCode = () => {
    setOtp(demoCode.split(''));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-xl bg-[#141414] border border-[#2A2421] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#8E8B85] hover:text-white hover:bg-[#201D1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* FEATURES MODAL */}
          {type === 'features' && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D6551F] uppercase mb-1">
                ■ CORE CAPABILITIES
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-4">
                Autonomous FinOps Architecture
              </h2>
              <div className="space-y-4 text-sm text-[#D1CEC7]">
                <div className="p-4 rounded-xl bg-[#1A1816] border border-[#2A2421] flex gap-3">
                  <Zap className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Heuristic & Multi-LLM Telemetry Auditing</h4>
                    <p className="text-xs text-[#8E8B85] mt-1">
                      Swappable Gemini 1.5 Pro, OpenAI GPT-4o, and deterministic rule engines continuously audit CPU, RAM, network I/O, and deployment tags.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#1A1816] border border-[#2A2421] flex gap-3">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Human-In-The-Loop Blast Radius Defense</h4>
                    <p className="text-xs text-[#8E8B85] mt-1">
                      Production workload safeguards prevent accidental termination. Explicit manager override code required for prod servers.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#1A1816] border border-[#2A2421] flex gap-3">
                  <DollarSign className="w-5 h-5 text-[#D6551F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Instant FinOps Realized Savings</h4>
                    <p className="text-xs text-[#8E8B85] mt-1">
                      One-click decommission workflow with rollback protection and instant monthly burn rate remediation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS MODAL */}
          {type === 'reviews' && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D6551F] uppercase mb-1">
                ■ CUSTOMER BENCHMARKS
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-4">
                Industry FinOps Feedback
              </h2>
              <div className="space-y-3">
                {[
                  {
                    name: 'Alex Rivera',
                    role: 'VP of Platform, ScaleOps',
                    quote: 'FinOps AI identified $24,500/mo of unattached staging clusters in our first 10 minutes. The LLM audit explanations gave our engineers 100% confidence to hit decommission.',
                    rating: 5
                  },
                  {
                    name: 'Sarah Chen',
                    role: 'Lead DevOps Architect, Datastream',
                    quote: 'The human-in-the-loop diff view and zero-downtime tags prevented our team from killing critical batch runners while clearing out true zombies.',
                    rating: 5
                  }
                ].map((r, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#1A1816] border border-[#2A2421]">
                    <div className="flex items-center gap-1 text-[#C49A6C] mb-2">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-[#EDEAE5] italic leading-relaxed">"{r.quote}"</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#8E8B85]">
                      <span className="font-medium text-white">{r.name}</span>
                      <span>{r.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRICING MODAL */}
          {type === 'pricing' && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D6551F] uppercase mb-1">
                ■ INVESTMENT ARCHITECTURE
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-4">
                ROI-Aligned Pricing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#1A1816] border border-[#2A2421] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#8E8B85] uppercase">PILOT EDITION</span>
                    <div className="text-3xl font-bold text-white font-['Outfit'] mt-2">$0</div>
                    <p className="text-xs text-[#8E8B85] mt-1">Free for fleets up to 50 cloud instances.</p>
                    <ul className="mt-4 space-y-2 text-xs text-[#EDEAE5]">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C49A6C]" /> Multi-Cloud Telemetry</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C49A6C]" /> AI Zombie Detection</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C49A6C]" /> Audit Trail Logging</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      onNotify?.('success', 'Pilot Tier Active', 'You are currently enjoying full unlimited Pilot features!');
                      onClose();
                    }}
                    className="mt-6 w-full py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#25221F] hover:bg-[#302B27] text-white border border-[#3E3833] transition-colors"
                  >
                    Current Plan
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-b from-[#1F1916] to-[#141414] border border-[#D6551F]/40 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-[#D6551F] text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    POPULAR
                  </div>
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#D6551F] uppercase">ENTERPRISE FINOPS</span>
                    <div className="text-3xl font-bold text-white font-['Outfit'] mt-2">10% <span className="text-xs font-normal text-[#8E8B85]">of savings</span></div>
                    <p className="text-xs text-[#8E8B85] mt-1">Pay only when verified waste is recovered.</p>
                    <ul className="mt-4 space-y-2 text-xs text-[#EDEAE5]">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D6551F]" /> Multi-Cloud Telemetry</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D6551F]" /> Automated Bi-Weekly Audits</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#D6551F]" /> Dedicated FinOps Engineer</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      onNotify?.('info', 'Enterprise Inquiry Sent', 'Our FinOps team will contact you shortly.');
                      onClose();
                    }}
                    className="mt-6 w-full py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] text-white transition-all shadow-md"
                  >
                    Schedule Inquiry ↗
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIGN IN MODAL (DIRECT LOGIN WITH EMAIL + PASSWORD, NO OTP) */}
          {type === 'signin' && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#C49A6C] uppercase mb-1">
                ■ SECURE PORTAL
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-2">
                Sign In to FinOps.Ai
              </h2>
              <p className="text-xs text-[#8E8B85] mb-6">
                Access your autonomous FinOps console and cloud audit permissions.
              </p>

              <form onSubmit={handleDirectSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1.5">Work Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C]"
                    />
                    <Mail className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C]"
                    />
                    <Lock className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full mt-3 py-3 rounded-full text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_4px_20px_rgba(196,154,108,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isVerifying ? 'Authenticating...' : 'Sign In to Console ↗'}</span>
                </button>
              </form>
            </div>
          )}

          {/* REGISTER MODAL (ASKS EMAIL & PASSWORD, THEN GETS OTP) */}
          {type === 'register' && (
            <div>
              {authStep === 'credentials' ? (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#C49A6C] uppercase mb-1">
                    ■ CREATE ACCOUNT
                  </div>
                  <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-2">
                    Join FinOps.Ai
                  </h2>
                  <p className="text-xs text-[#8E8B85] mb-6">
                    Enter your email address and password to receive a secure One-Time Passcode (OTP).
                  </p>

                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Lead Platform Engineer"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1.5 flex items-center justify-between">
                        <span>Work Email Address</span>
                        <span className="text-[#666666] text-[10px]">OTP destination</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C]"
                        />
                        <Mail className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C]"
                        />
                        <Lock className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-3 py-3 rounded-full text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_4px_20px_rgba(196,154,108,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Send OTP Passcode →</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* STEP 2: OTP VERIFICATION SCREEN */
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono tracking-widest text-[#D6551F] uppercase">
                      ■ STEP 2 OF 2: VERIFICATION
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuthStep('credentials')}
                      className="text-xs text-[#8E8B85] hover:text-[#EDEAE5] underline"
                    >
                      Change Email
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-2">
                    Enter Verification Code
                  </h2>
                  <p className="text-xs text-[#8E8B85] mb-2">
                    We sent a 6-digit one-time passcode (OTP) to <span className="text-white font-semibold">{email}</span>.
                  </p>

                  <div className="my-4 p-3 rounded-xl bg-[#1A1816] border border-[#3E3833] flex items-center justify-between text-xs font-mono text-[#D1CEC7]">
                    <span>Demo OTP Code: <strong className="text-[#C49A6C] tracking-wider text-sm">{demoCode}</strong></span>
                    <button
                      type="button"
                      onClick={handleAutoFillCode}
                      className="px-2.5 py-1 rounded-md bg-[#25221F] hover:bg-[#332E29] text-[#C49A6C] text-[11px] font-semibold border border-[#443D36] transition-colors cursor-pointer"
                    >
                      Auto-fill Code
                    </button>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-6 mt-4">
                    {/* 6 Digit Inputs */}
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                              const prev = document.getElementById(`otp-input-${idx - 1}`);
                              prev?.focus();
                            }
                          }}
                          className="w-11 sm:w-14 h-12 text-center text-xl font-bold font-mono rounded-xl bg-[#1A1816] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C]"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-3 rounded-full text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_4px_20px_rgba(196,154,108,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <span>Verifying Security Token...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Verify & Complete Registration ↗</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs text-[#8E8B85]">
                      <span>Didn't receive code?</span>
                      {countdown > 0 ? (
                        <span className="font-mono text-[11px]">Resend in {countdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const newRandom = Math.floor(100000 + Math.random() * 900000).toString();
                            setDemoCode(newRandom);
                            setCountdown(30);
                            onNotify?.('info', 'New Code Sent', `New OTP code: ${newRandom}`);
                          }}
                          className="text-[#C49A6C] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend Code</span>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
