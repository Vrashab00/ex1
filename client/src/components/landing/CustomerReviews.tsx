import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, ShieldCheck, ThumbsUp, Quote, Sparkles } from 'lucide-react';

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  savings: string;
  verified: boolean;
  content: string;
  cloudProvider: 'AWS' | 'GCP' | 'Azure' | 'Multi-Cloud';
  date: string;
}

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Elena Rostova',
    role: 'VP of Infrastructure',
    company: 'NeuralGrid AI',
    avatar: '/pfp.jpg',
    rating: 5,
    savings: '$42,500/mo',
    verified: true,
    cloudProvider: 'GCP',
    date: '2 days ago',
    content: 'FinOps AI recovered over $42,000 in abandoned GPU clusters within our first 72 hours. The autonomous detection surfaced idle A100s that completely escaped our existing monitoring tools.'
  },
  {
    id: 'rev-2',
    name: 'Marcus Vance',
    role: 'Principal Cloud Architect',
    company: 'FinScale Payments',
    avatar: '/pfp.jpg',
    rating: 5,
    savings: '$18,900/mo',
    verified: true,
    cloudProvider: 'AWS',
    date: '1 week ago',
    content: 'The manager feedback loop is extraordinary. When our QA lead rejected a zombie flag, the agent learned the nocturnal test cycle pattern and never raised a false positive again.'
  },
  {
    id: 'rev-3',
    name: 'Sarah Chen',
    role: 'Director of Platform Engineering',
    company: 'Veloce Data',
    avatar: '/pfp.jpg',
    rating: 5,
    savings: '$64,200/mo',
    verified: true,
    cloudProvider: 'Multi-Cloud',
    date: '2 weeks ago',
    content: 'Terminating 85 orphaned test workers with one verified click saved our SRE team 20+ hours of manual Jira ticket tracking every sprint. Best FinOps platform we have deployed.'
  },
  {
    id: 'rev-4',
    name: 'Devon Brooks',
    role: 'Staff Site Reliability Engineer',
    company: 'Krypton Cloud',
    avatar: '/pfp.jpg',
    rating: 5,
    savings: '$27,800/mo',
    verified: true,
    cloudProvider: 'Azure',
    date: '3 weeks ago',
    content: 'The zero-downtime safety freeze for production databases gave our leadership complete peace of mind. Transparent reasoning for every recommendation eliminates the black-box fear.'
  }
];

interface CustomerReviewsProps {
  onNotify?: (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ onNotify }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSavings, setNewSavings] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newProvider, setNewProvider] = useState<'AWS' | 'GCP' | 'Azure' | 'Multi-Cloud'>('Multi-Cloud');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContent.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Engineering Lead',
      company: newCompany.trim() || 'Tech Enterprise',
      avatar: '/pfp.jpg',
      rating: newRating,
      savings: newSavings.trim() || '$12,400/mo',
      verified: true,
      cloudProvider: newProvider,
      date: 'Just now',
      content: newContent.trim()
    };

    setReviews([newRev, ...reviews]);
    setModalOpen(false);
    setNewName('');
    setNewRole('');
    setNewCompany('');
    setNewSavings('');
    setNewContent('');

    if (onNotify) {
      onNotify('success', 'Feedback Submitted', 'Thank you! Your verified review has been published.');
    }
  };

  return (
    <section id="reviews-section" className="w-full space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2A2421] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#C49A6C]/10 text-[#C49A6C] border border-[#C49A6C]/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Verified FinOps Feedback
            </span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
              ))}
              <span className="text-xs font-mono text-[#EDEAE5] ml-1.5 font-bold">5.0 (240+ Reviews)</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            What Cloud Engineering Teams Are Saying
          </h2>
          <p className="text-sm text-[#A0A0A0] mt-1 max-w-2xl">
            Real feedback from infrastructure architects, VPs of engineering, and FinOps leaders saving tens of thousands each month with FinOps AI.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-pill-ghost text-xs py-2 px-4 flex items-center gap-2 cursor-pointer self-start sm:self-auto hover:border-[#C49A6C] hover:text-white"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#C49A6C]" />
          <span>Write Feedback</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-[#141414] border border-[#2A2421] hover:border-[#3E3430] transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Header with Avatar, Name, Rating & Savings */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#2A2421] group-hover:border-[#C49A6C]/50 transition-colors"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white tracking-tight">{rev.name}</h4>
                      {rev.verified && (
                        <span title="Verified Customer">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C49A6C]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8E8B85]">
                      {rev.role} • <span className="text-[#C2BEB7]">{rev.company}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#B2E0A6] bg-[#B2E0A6]/10 border border-[#B2E0A6]/30 block font-semibold">
                    Saved {rev.savings}
                  </span>
                  <span className="text-[10px] font-mono text-[#666666] block mt-1">{rev.date}</span>
                </div>
              </div>

              {/* Rating stars & Cloud Tag */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-[#8E8B85] px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2A2421]">
                  {rev.cloudProvider}
                </span>
              </div>

              {/* Content */}
              <p className="text-xs sm:text-sm text-[#C2BEB7] leading-relaxed relative">
                "{rev.content}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#221D1B] flex items-center justify-between text-[11px] text-[#8E8B85]">
              <span className="flex items-center gap-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5 text-[#B2E0A6]" />
                Zero-Downtime Verified
              </span>
              <button
                className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                title="Helpful review"
              >
                <ThumbsUp className="w-3 h-3 text-[#C49A6C]" />
                <span>Helpful</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-[#141414] border border-[#3E3430] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2421] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C49A6C]/10 border border-[#C49A6C]/30 flex items-center justify-center text-[#C49A6C]">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Share Your Feedback</h3>
                  <p className="text-xs text-[#8E8B85]">Help other engineering teams optimize their cloud fleet</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#8E8B85] hover:text-white text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-medium">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C]"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-medium">Your Role</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Lead Cloud Architect"
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-medium">Company</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Acme Cloud Corp"
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C]"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-medium">Monthly Savings Unlocked</label>
                  <input
                    type="text"
                    value={newSavings}
                    onChange={(e) => setNewSavings(e.target.value)}
                    placeholder="e.g. $14,500/mo"
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-medium">Cloud Environment</label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C]"
                  >
                    <option value="AWS">Amazon Web Services (AWS)</option>
                    <option value="GCP">Google Cloud Platform (GCP)</option>
                    <option value="Azure">Microsoft Azure</option>
                    <option value="Multi-Cloud">Multi-Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-medium">Rating</label>
                  <div className="flex items-center gap-1.5 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-[#3E3833]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-1 font-medium">Review Content *</label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe how CloudPrune AI helped remediate waste, protect workloads, or automate FinOps..."
                  className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2421] text-white focus:outline-none focus:border-[#C49A6C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2421]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#8E8B85] hover:text-white bg-[#1A1A1A] border border-[#2A2421] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#C49A6C] to-[#B38350] hover:from-[#B88B5B] hover:to-[#A37442] shadow-md cursor-pointer"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
