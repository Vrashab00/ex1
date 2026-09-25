import React, { useEffect, useState } from 'react';
import { ShieldAlert, User, Users, Calendar } from 'lucide-react';
import { RejectionFeedback } from '../../types/index.js';
import { api } from '../../api/client.js';

export const FeedbackHistoryView: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<RejectionFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await api.getFeedbackHistory();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-['Work_Sans',sans-serif]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-['Space_Grotesk',sans-serif] font-bold tracking-[0.16em] uppercase text-[#D6551F] block mb-1">
            ■ Manager Knowledge Store
          </span>
          <h1 className="text-2xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F3F0] tracking-tight">
            Registered Manager Exemptions & Feedback
          </h1>
          <p className="text-xs text-[#A0A0A0] font-mono mt-1">
            Archived business intent and preservation justifications informing the autonomous FinOps agent
          </p>
        </div>

        <button
          onClick={loadFeedback}
          className="btn-pill-ghost text-xs cursor-pointer"
        >
          REFRESH ARCHIVE
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#666666] font-mono text-sm animate-pulse">
          Loading exemption archive...
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#141414] border border-[#2A2421]">
          <ShieldAlert className="w-10 h-10 text-[#444444] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#F5F3F0] font-['Space_Grotesk',sans-serif]">
            No exemptions registered
          </h3>
          <p className="text-xs text-[#A0A0A0] mt-1">
            When managers reject an AI recommendation, their reasoning is indexed here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="p-6 rounded-2xl bg-[#141414] border border-[#2A2421] hover:border-[#3D3430] transition-all duration-200 shadow-editorial-card space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#F5F3F0] font-['Space_Grotesk',sans-serif] tracking-tight">
                    {fb.instanceName}
                  </h3>
                  <span className="text-[11px] font-mono text-[#666666]">
                    ID: {fb.instanceId}
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-['Space_Grotesk',sans-serif] font-bold uppercase bg-[#221812] text-[#FFB59B] border border-[#3E2519]">
                  {fb.action.replace('_', ' ')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161616] border border-[#2A2421] text-xs font-mono text-[#D5D2CD] leading-relaxed">
                <span className="text-[#D6551F] font-['Space_Grotesk',sans-serif] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Preservation Justification:
                </span>
                "{fb.reason}"
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#221D1B] text-xs font-mono text-[#A0A0A0]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#666666]" />
                  <span className="text-[#F5F3F0]">{fb.manager}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#666666]" />
                  <span className="text-[#A0A0A0]">Team: {fb.team}</span>
                </div>

                <div className="flex items-center gap-1 text-[#666666]">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
