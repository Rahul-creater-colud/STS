import React from 'react';
import { 
  HeartHandshake, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Building2, 
  Utensils, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Leaf, 
  Award,
  ChevronRight,
  UploadCloud,
  Cpu,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InteractiveRescueMap } from './InteractiveRescueMap';

interface LandingPageProps {
  onOpenAddModal: () => void;
  onOpenCreateRequestModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onOpenAddModal, 
  onOpenCreateRequestModal 
}) => {
  const { kpis, setActiveScreen } = useApp();

  const trustPartners = [
    { name: 'Jaipur Marriott', type: 'Hospitality Partner' },
    { name: 'Taj Jai Mahal Palace', type: 'Luxury Hotel' },
    { name: 'Clarks Amer Banquets', type: 'Convention Center' },
    { name: 'Robin Hood Army', type: 'Volunteer Guild' },
    { name: 'Akshaya Patra Foundation', type: 'Community Kitchen' },
    { name: 'Apna Ghar Sansthan', type: 'Night Shelter Network' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Surplus Food Posted',
      desc: 'Hotels, hostels & caterers log excess untouched food with portion counts, temperature & pickup deadlines in under 60 seconds.',
      icon: UploadCloud,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      num: '02',
      title: 'Smart Matching',
      desc: 'Our logistics algorithm instantly scores nearby shelters factoring transit distance, portion capacity, and food shelf-life urgency.',
      icon: Cpu,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      num: '03',
      title: 'Volunteer Assigned',
      desc: 'Hyperlocal volunteer drivers receive turn-by-turn navigation with thermal seal verification and contact coordinates.',
      icon: UserCheck,
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      num: '04',
      title: 'Food Delivered',
      desc: 'Warm, nutritious meals reach destitute children and families before expiration. Digital receipt and carbon savings logged.',
      icon: HeartHandshake,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  return (
    <div className="flex-1 bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-slate-50">
        
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-200/30 to-teal-100/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Real-Time Food Rescue Logistics Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Turn Surplus Food Into <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy underline-offset-8">Real Impact</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Connect surplus food with nearby shelters, coordinate rescue volunteers, and deliver food before it goes to waste.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={onOpenAddModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Donate Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCreateRequestModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xs transition hover:border-slate-300 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Request Food</span>
              </button>

              <button
                onClick={() => setActiveScreen('dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-slate-600 hover:text-emerald-700 font-bold text-xs px-4 py-3 cursor-pointer"
              >
                <span>Open Command Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Hero Visual: Stylized Live City Map with Floating Stats */}
          <div className="mt-12 relative max-w-5xl mx-auto">
            
            {/* The Live Interactive Map */}
            <div className="rounded-3xl shadow-2xl border border-slate-200 overflow-hidden bg-white ring-8 ring-slate-100/80">
              <InteractiveRescueMap height="460px" showFloatingPanel={true} />
            </div>

            {/* 4 Small Floating Statistics Badges (as required by prompt) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  🍲
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">
                    {kpis.mealsRescued.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">Meals Rescued</span>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  🚚
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">
                    {kpis.successfulDeliveries}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">Successful Deliveries</span>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  🏠
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">
                    {kpis.partnerNgos}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">Partner NGOs</span>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  🤝
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">
                    {kpis.activeVolunteers}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">Active Volunteers</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST / IMPACT SECTION (Logos & Placeholders) */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by Rajasthan's Leading Hospitality, Shelter Networks & Volunteer Guilds
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80">
            {trustPartners.map((p, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-base font-extrabold text-slate-700 tracking-tight">{p.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">{p.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4-Step Visual Flow with connecting lines) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Seamless Logistics Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Surplus-to-Shelter Works
            </h2>
            <p className="text-sm text-slate-500">
              Transforming banquet surplus into hot meals in 4 automated, time-critical steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold ${step.color} transition-transform group-hover:scale-110`}>
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="font-mono text-2xl font-black text-slate-200 group-hover:text-emerald-300 transition-colors">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <span>Verified Real-time Step</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. IMPACT SECTION (Detailed Counters & Calculator) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 rounded-[36px] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  Measurable Humanitarian Impact
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Zero Edible Food to Landfill. 100% Dignity to Shelters.
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                  Every meal diverted prevents methane generation in municipal landfills and provides complete, warm nutritional security to vulnerable night shelter residents.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400">Carbon Offset</span>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5">4,280 kg</div>
                    <span className="text-[10px] text-slate-400">CO₂e emissions saved</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Economic Value</span>
                    <div className="text-2xl font-black text-amber-400 mt-0.5">₹14.2 Lakhs</div>
                    <span className="text-[10px] text-slate-400">commercial food value</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Average Transit</span>
                    <div className="text-2xl font-black text-white mt-0.5">&lt; 25 mins</div>
                    <span className="text-[10px] text-slate-400">door-to-door delivery</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <span>Interactive Impact Calculator</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Select your daily surplus capacity to calculate monthly environmental and social impact:
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between text-slate-200 font-semibold">
                    <span>Surplus Meals per Event:</span>
                    <span className="text-emerald-400 font-bold font-mono">100 meals</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Shelter residents fed:</span>
                      <strong className="text-white">100 individuals</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Landfill methane avoided:</span>
                      <strong className="text-emerald-300">45 kg CO₂e</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">CSR Tax Exemption:</span>
                      <strong className="text-amber-300">100% 80G Certified</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenAddModal}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs transition cursor-pointer"
                >
                  Join as Registered Donor
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION (as specified in prompt) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Have surplus food? Help us rescue it.
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Whether you manage a 5-star hotel banquet, student hostel mess, or want to volunteer 1 hour a week with your vehicle, join the real-time food rescue network today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenAddModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              Donate Food
            </button>
            <button
              onClick={() => setActiveScreen('volunteer-mobile')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition cursor-pointer"
            >
              Join as Volunteer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-400">
        <p>© 2026 Surplus-to-Shelter — Real-Time Food Rescue Routing. Built with passion for national hackathon excellence.</p>
      </footer>

    </div>
  );
};
