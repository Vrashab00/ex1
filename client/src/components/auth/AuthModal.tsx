import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface AuthModalProps {
  onNotify?: (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNotify }) => {
  const { 
    authModalOpen, 
    authModalMode, 
    closeAuthModal, 
    setAuthModalMode, 
    signIn, 
    signUp, 
    resetPassword 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowPassword(false);
  };

  const switchMode = (mode: 'signin' | 'register' | 'forgot-password') => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setAuthModalMode(mode);
  };

  const formatAuthError = (err: any): string => {
    const msg = err?.message || '';
    if (msg.includes('Invalid login credentials')) {
      return 'Incorrect email or password. Please verify your credentials and try again.';
    }
    if (msg.includes('User already registered')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (msg.includes('Password should be at least 6 characters')) {
      return 'Your password must be at least 6 characters long.';
    }
    if (msg.includes('rate limit')) {
      return 'Too many login attempts. Please wait a moment and try again.';
    }
    return msg || 'Authentication failed. Please check your connection and try again.';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await signIn(email.trim(), password);
      if (error) {
        setErrorMessage(formatAuthError(error));
      } else if (data?.user) {
        if (onNotify) {
          onNotify(
            'success',
            'Signed In Successfully',
            `Welcome back to FinOps AI, ${data.user.user_metadata?.full_name || data.user.email}!`
          );
        }
        closeAuthModal();
        resetForm();
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await signUp(email.trim(), password, fullName.trim());
      if (error) {
        setErrorMessage(formatAuthError(error));
      } else {
        if (data?.session) {
          // If auto-confirm is enabled in Supabase project
          if (onNotify) {
            onNotify(
              'success',
              'Account Activated',
              `Welcome aboard! Your FinOps AI session is active.`
            );
          }
          closeAuthModal();
          resetForm();
        } else {
          // If email confirmation is required
          setSuccessMessage(
            'Registration successful! A verification link has been sent to your email. Please verify your address to continue.'
          );
          if (onNotify) {
            onNotify(
              'info',
              'Verification Email Sent',
              `Please check ${email} to complete registration.`
            );
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const { error } = await resetPassword(email.trim());
      if (error) {
        setErrorMessage(formatAuthError(error));
      } else {
        setSuccessMessage('Password reset link has been dispatched to your email address.');
        if (onNotify) {
          onNotify(
            'success',
            'Reset Email Sent',
            `Check your inbox at ${email} for password reset instructions.`
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#141414] border border-[#2A2421] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C49A6C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#D6551F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            closeAuthModal();
            resetForm();
          }}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8E8B85] hover:text-white hover:bg-[#1E1C1A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================================= */}
        {/* SIGN IN FORM */}
        {/* ========================================================================= */}
        {authModalMode === 'signin' && (
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#C49A6C] uppercase mb-1">
              <KeyRound className="w-3 h-3" />
              Secure Supabase Portal
            </div>
            <h2 className="text-2xl font-bold text-white font-sans tracking-tight mb-1.5">
              Sign In to FinOps
            </h2>
            <p className="text-xs text-[#8E8B85] mb-6">
              Access your autonomous FinOps agent and cloud fleet telemetry.
            </p>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C] transition-colors"
                  />
                  <Mail className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase text-[#A6A29A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot-password')}
                    className="text-xs text-[#C49A6C] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#8E8B85] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_4px_20px_rgba(196,154,108,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#2A2421] text-center text-xs text-[#8E8B85]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-[#C49A6C] font-semibold hover:underline cursor-pointer"
              >
                Register now
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REGISTER / SIGN UP FORM */}
        {/* ========================================================================= */}
        {authModalMode === 'register' && (
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#C49A6C] uppercase mb-1">
              <ShieldCheck className="w-3 h-3" />
              Create Supabase Account
            </div>
            <h2 className="text-2xl font-bold text-white font-sans tracking-tight mb-1.5">
              Get Started with FinOps
            </h2>
            <p className="text-xs text-[#8E8B85] mb-5">
              Launch autonomous cloud waste remediation for your infrastructure.
            </p>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C] transition-colors"
                  />
                  <UserIcon className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C] transition-colors"
                  />
                  <Mail className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1">
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#8E8B85] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_4px_20px_rgba(196,154,108,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#2A2421] text-center text-xs text-[#8E8B85]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-[#C49A6C] font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORGOT PASSWORD FORM */}
        {/* ========================================================================= */}
        {authModalMode === 'forgot-password' && (
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#C49A6C] uppercase mb-1">
              <KeyRound className="w-3 h-3" />
              Password Recovery
            </div>
            <h2 className="text-2xl font-bold text-white font-sans tracking-tight mb-1.5">
              Reset Your Password
            </h2>
            <p className="text-xs text-[#8E8B85] mb-6">
              Enter your registered work email and we will send you secure recovery instructions.
            </p>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#A6A29A] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1A18] border border-[#2A2421] text-white text-sm focus:outline-none focus:border-[#C49A6C] transition-colors"
                  />
                  <Mail className="w-4 h-4 text-[#8E8B85] absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_4px_20px_rgba(196,154,108,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#2A2421] text-center text-xs text-[#8E8B85]">
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-[#C49A6C] font-semibold hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
