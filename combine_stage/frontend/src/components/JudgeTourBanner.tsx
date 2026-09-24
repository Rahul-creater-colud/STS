import React, { useState } from 'react';
import { 
  Award, 
  HelpCircle, 
  Cpu, 
  Flame, 
  Sparkles, 
  Zap, 
  RotateCcw, 
  X, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JudgeTourBanner: React.FC = () => {
  const { isJudgeMode, setIsJudgeMode, triggerJudgeDemo, setActiveScreen } = useApp();
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'impact'>('problem');

  if (!isJudgeMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsJudgeMode(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-xl hover:bg-slate-800 transition-all font-medium text-xs border border-slate-700 hover:scale-105 cursor-pointer"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Hackathon Judge Mode</span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Hackathon Judge & Presentation Tour" className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          
          {/* Header & Badges */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wide uppercase text-emerald-400">
                  Hackathon Presentation Mode
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  10-Second Pitch Guide
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logistics engine matching commercial surplus food to shelters before expiration.
              </p>
            </div>
          </div>

          {/* 3 Core Judge Questions Tabs */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/80 text-xs">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'problem' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
              1. The Problem
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'solution' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              2. The Solution
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'impact' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              3. The Impact
            </button>
          </div>

          {/* Quick Demo Simulator Triggers */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">1-Click Demos:</span>
            <button
              onClick={() => triggerJudgeDemo('banquet_surplus')}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer"
              title="Post 180-meal banquet surplus and auto-navigate to Smart Match"
            >
              <Sparkles className="w-3 h-3 text-emerald-200" />
              +180 Meal Surplus
            </button>
            <button
              onClick={() => triggerJudgeDemo('instant_rescue')}
              className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-500 text-white text-xs px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer"
              title="Execute live dispatch and trigger GPS tracking simulator"
            >
              <Zap className="w-3 h-3 text-orange-200" />
              Auto-Dispatch Route
            </button>
            <button
              onClick={() => setIsJudgeMode(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
              title="Minimize Pitch Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Detail Explanations */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 text-xs flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-300">
          {activeTab === 'problem' && (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-rose-300">🚨 The Core Problem:</span>
              <span>40% of food in Jaipur banquets, hostels, and hotels is discarded within 4 hours while 42 local shelters face chronic nightly shortages.</span>
              <span className="text-slate-400">Traditional charitable food dropoffs are too slow and uncoordinated to prevent microbial spoilage.</span>
            </div>
          )}

          {activeTab === 'solution' && (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-blue-300">⚡ The System Solution:</span>
              <span>Automated algorithmic matching (<span className="text-emerald-300 font-mono font-bold">&lt;60s</span>) scores distance, capacity, dietary fit & expiry deadlines.</span>
              <span>Hyperlocal volunteer dispatch guarantees delivery in <span className="text-emerald-300 font-mono font-bold">&lt;25 minutes</span>.</span>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-emerald-300">🌱 Real-World Impact:</span>
              <span><strong className="text-white">12,450+</strong> nutritious meals delivered to homeless, children & elderly shelters.</span>
              <span><strong className="text-white">4,280 kg</strong> CO₂e greenhouse gas averted from landfills.</span>
              <span><strong className="text-white">₹14.2 Lakhs</strong> commercial food value recovered.</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
