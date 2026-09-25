import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl border flex items-start gap-3 shadow-2xl backdrop-blur-xl bg-[#161616]/95 ${
                isSuccess
                  ? 'border-emerald-500/30 text-emerald-200'
                  : isError
                  ? 'border-rose-500/30 text-rose-200'
                  : isWarning
                  ? 'border-[#D6551F]/40 text-[#EDEAE5]'
                  : 'border-[#D6551F]/30 text-[#EDEAE5]'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-[#D6551F]" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-[#D6551F]" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold tracking-wide text-[#EDEAE5] font-display">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs text-[#8E8B85] mt-0.5 leading-relaxed font-sans">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-[#8E8B85] hover:text-[#EDEAE5] transition-colors p-1 rounded-md"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
