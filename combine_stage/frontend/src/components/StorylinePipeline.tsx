import React from 'react';
import { 
  CheckCircle2, 
  Utensils, 
  UploadCloud, 
  Radar, 
  Cpu, 
  UserCheck, 
  Navigation, 
  PackageCheck, 
  Truck, 
  HeartHandshake, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const STAGES = [
  { id: 'surplus', label: 'Food Available', icon: Utensils, screen: 'donations', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'posted', label: 'Donation Posted', icon: UploadCloud, screen: 'donations', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'demand', label: 'Demand Detected', icon: Radar, screen: 'requests', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'match', label: 'Smart Match', icon: Cpu, screen: 'smart-match', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'assigned', label: 'Volunteer Assigned', icon: UserCheck, screen: 'volunteer-mobile', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'route', label: 'Route Generated', icon: Navigation, screen: 'live-tracking', color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'pickup', label: 'Food Picked Up', icon: PackageCheck, screen: 'volunteer-mobile', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'tracking', label: 'Live Tracking', icon: Truck, screen: 'live-tracking', color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { id: 'delivered', label: 'Food Delivered', icon: HeartHandshake, screen: 'live-tracking', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'impact', label: 'Impact Updated', icon: TrendingUp, screen: 'analytics', color: 'text-rose-600 bg-rose-50 border-rose-200' },
];

export const StorylinePipeline: React.FC = () => {
  const { activeScreen, setActiveScreen, activeMission } = useApp();

  // Determine current active step based on activeMission & screen
  const getCurrentStepIndex = () => {
    if (activeScreen === 'analytics') return 9;
    if (activeScreen === 'requests') return 2;
    if (activeScreen === 'smart-match') return 3;
    if (activeScreen === 'donations') return 1;
    if (activeScreen === 'volunteer-mobile') {
      return activeMission.status === 'Delivered' ? 8 : activeMission.status === 'In Transit' ? 6 : 4;
    }
    if (activeScreen === 'live-tracking') {
      return activeMission.status === 'Delivered' ? 8 : 7;
    }
    return 5;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-xs px-4 py-2.5 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[980px] text-xs">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-200 font-semibold text-slate-700 whitespace-nowrap">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
            9
          </span>
          <span className="hidden sm:inline">Rescue Pipeline</span>
        </div>

        <div className="flex items-center flex-1 justify-between px-3">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <React.Fragment key={stage.id}>
                <button
                  type="button"
                  onClick={() => setActiveScreen(stage.screen as any)}
                  className={`group flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all text-left cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-xs ring-1 ring-emerald-500/30'
                      : isCompleted
                      ? 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                  title={`Jump to ${stage.label}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-transform group-hover:scale-110 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white font-bold'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] whitespace-nowrap ${isCurrent ? 'font-bold' : ''}`}>
                    {stage.label}
                  </span>
                </button>

                {idx < STAGES.length - 1 && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      idx < currentStep ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
