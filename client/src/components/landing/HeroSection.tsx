import React, { useRef, useEffect, useState } from 'react';
import { ArrowDown, RotateCcw, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
  onRunAudit: () => void;
  onViewAuditTrail: () => void;
  isAuditing: boolean;
  totalMonthlyWaste: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRunAudit,
  onViewAuditTrail,
  isAuditing,
  totalMonthlyWaste
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Seamless fade-loop: fade out near end → reset → fade back in
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE_BEFORE_END = 1.2; // seconds before end to start fade

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= FADE_BEFORE_END && isVisible) {
        setIsVisible(false);
      }
    };

    const handleEnded = () => {
      // After fade-out completes, reset & play, then fade in
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        setFadeKey(k => k + 1);
        setIsVisible(true);
      }, 400); // matches fade-out duration
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isVisible]);

  const handleScrollToFleet = () => {
    const el = document.getElementById('fleet-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuditClick = () => {
    onRunAudit();
    handleScrollToFleet();
  };

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[88vh] flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-16 pb-12 overflow-hidden bg-[#0A0A0A]">

      {/* ── Background Video with smooth fade-loop ── */}
      <AnimatePresence mode="wait">
        <motion.video
          key={fadeKey}
          ref={videoRef}
          autoPlay
          muted
          playsInline
          poster="./assets/hero-bg.jpg"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 0.78 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover object-center md:object-right z-0"
        >
          <source src="./assets/background-video.mp4" type="video/mp4" />
          <source src="./background-video.mp4" type="video/mp4" />
          <source src="./gemini_generated_video_a53d7be8.mp4" type="video/mp4" />
          <source src="/background-video.mp4" type="video/mp4" />
          <source src="/assets/background-video.mp4" type="video/mp4" />
        </motion.video>
      </AnimatePresence>

      {/* ── Atmospheric Depth / Halo Overlays ── */}
      {/* Vignette — dark edges all around */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(10,10,10,0.82) 100%)'
        }}
      />
      {/* Bottom-to-centre dark gradient (ground anchor) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/55 to-transparent z-[1] pointer-events-none" />
      {/* Left-edge fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/35 to-black/55 z-[1] pointer-events-none" />

      {/* ── Warm halo bloom (centre-left) ── */}
      <div
        className="absolute z-[2] pointer-events-none"
        style={{
          top: '18%', left: '15%',
          width: 480, height: 380,
          background: 'radial-gradient(ellipse, rgba(214,85,31,0.13) 0%, transparent 72%)',
          filter: 'blur(48px)',
        }}
      />
      {/* ── Cool deep-space halo (top-right) ── */}
      <div
        className="absolute z-[2] pointer-events-none"
        style={{
          top: '-5%', right: '10%',
          width: 520, height: 420,
          background: 'radial-gradient(ellipse, rgba(100,120,180,0.09) 0%, transparent 70%)',
          filter: 'blur(56px)',
        }}
      />
      {/* ── Subtle scan-line texture ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)'
        }}
      />

      {/* Topbar spacer */}
      <div className="w-full h-8 z-10" />

      {/* ── Central Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center my-auto py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.08] font-['Space_Grotesk',sans-serif] drop-shadow-md"
        >
          Prune idle cloud waste
          <br />
          with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6551F] via-[#F2994A] to-[#D6551F] drop-shadow-[0_2px_18px_rgba(214,85,31,0.45)]">
            Autonomous AI
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2994A] via-[#D6551F] to-[#F2994A] drop-shadow-[0_2px_18px_rgba(214,85,31,0.45)]">
            Precision
          </span>
        </motion.h1>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={handleAuditClick}
            disabled={isAuditing}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-[0_4px_24px_rgba(196,154,108,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isAuditing ? 'Auditing Telemetry...' : 'Run Free Infrastructure Audit'}</span>
            <ArrowDown className={`w-4 h-4 ${isAuditing ? 'animate-bounce' : ''}`} />
          </button>

          <button
            onClick={onViewAuditTrail}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-medium tracking-wide text-[#EDEAE5] bg-[#1A1816]/75 hover:bg-[#25221F] border border-[#3E3833] backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:border-[#D6551F]/50"
          >
            <RotateCcw className="w-4 h-4 text-[#C49A6C]" />
            <span>View Audit Trail</span>
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-[13px] text-[#A6A29A] font-['Work_Sans',sans-serif]"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C49A6C]" />
            <span>Human Approval Required</span>
          </div>
          <span className="text-[#55504A] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C49A6C]" />
            <span>Zero Downtime Risk</span>
          </div>
          <span className="text-[#55504A] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C49A6C]" />
            <span>SOC2 Type II Certified</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll chevron */}
      <motion.button
        onClick={handleScrollToFleet}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="relative z-10 text-[#8E8B85] hover:text-[#EDEAE5] transition-colors p-2 cursor-pointer"
        aria-label="Scroll to fleet dashboard"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
};
