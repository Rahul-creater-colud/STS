import React from 'react';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Circle, 
  Truck, 
  ShieldCheck, 
  Play, 
  Pause, 
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InteractiveRescueMap } from './InteractiveRescueMap';

export const LiveTrackingView: React.FC = () => {
  const { 
    activeMission, 
    updateMissionStatus, 
    advanceVolunteerStep, 
    isSimulatingGps, 
    setIsSimulatingGps,
    setActiveScreen 
  } = useApp();

  const isDelivered = activeMission.status === 'Delivered';

  return (
    <div className="flex-1 min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Dispatch Telemetry
              </span>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Mission #{activeMission.rescueCode.replace('RESCUE-', '')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Real-Time Rescue Route & Delivery Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live GPS telemetry connecting {activeMission.donorName} → Volunteer {activeMission.volunteerName} → {activeMission.shelterName}.
            </p>
          </div>

          {/* Quick Simulation Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulatingGps(!isSimulatingGps)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-sm transition-all cursor-pointer ${
                isSimulatingGps
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              }`}
            >
              {isSimulatingGps ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isSimulatingGps ? 'Pause GPS Simulation' : 'Simulate Live Vehicle Movement'}</span>
            </button>
          </div>
        </div>

        {/* Main Map View */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <InteractiveRescueMap height="480px" showFloatingPanel={false} />
        </div>

        {/* Bottom Tracking Panel (as specified in prompt) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Rescue Specs & Volunteer Info (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
            
            {/* Top Stat Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rescue Mission
                </span>
                <div className="text-2xl font-black text-slate-900">
                  Rescue #{activeMission.rescueCode.replace('RESCUE-', '')}
                </div>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {activeMission.foodName} ({activeMission.category})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Cargo Volume
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    {activeMission.mealsCount} meals
                  </span>
                </div>
                <div className="text-right pl-3 border-l border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    ETA
                  </span>
                  <span className="text-2xl font-black text-orange-600 font-mono">
                    {activeMission.etaMinutes} min
                  </span>
                </div>
              </div>
            </div>

            {/* Current Status & Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium">Current Status</span>
                <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>{activeMission.status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium">Pickup Step</span>
                <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Completed (6:51 PM)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium">Delivery Step</span>
                <div className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-1">
                  {isDelivered ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Fulfilled</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-400" />
                      <span>Pending Handover</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Volunteer Driver Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-lg">
                  🛵
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-white">{activeMission.volunteerName}</h4>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Verified Driver
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {activeMission.volunteerVehicle} • Rating: {activeMission.volunteerRating}⭐
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeMission.volunteerPhone}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact</span>
                </a>

                {!isDelivered ? (
                  <button
                    onClick={advanceVolunteerStep}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Advance Status</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl">
                    Delivered
                  </span>
                )}
              </div>
            </div>

            {/* Direct Corridor Routing Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Origin (Donor)
                </span>
                <h5 className="font-bold text-slate-900 mt-1">{activeMission.donorName}</h5>
                <p className="text-slate-500 text-[11px] mt-0.5">{activeMission.donorLocation.address}</p>
                <div className="mt-2 text-[11px] text-slate-400">Loading bay code: verified</div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Destination (Shelter)
                </span>
                <h5 className="font-bold text-slate-900 mt-1">{activeMission.shelterName}</h5>
                <p className="text-slate-500 text-[11px] mt-0.5">{activeMission.shelterLocation.address}</p>
                <div className="mt-2 text-[11px] text-blue-600 font-semibold">Staff awaiting on site</div>
              </div>
            </div>

          </div>

          {/* Detailed Timeline (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Mission Audit Timeline
                </h3>
                <span className="text-xs font-semibold text-emerald-700">Live Sync</span>
              </div>

              {/* Timeline Items */}
              <div className="mt-5 space-y-5 text-xs">
                {activeMission.timeline.map((event, idx) => {
                  const isDone = event.status === 'completed';
                  const isCurrent = event.status === 'current';

                  return (
                    <div key={idx} className="flex items-start gap-3 relative">
                      {/* Vertical line */}
                      {idx < activeMission.timeline.length - 1 && (
                        <div
                          className={`absolute left-3 top-6 bottom-0 w-0.5 -ml-px ${
                            isDone ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-transform ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-orange-500 text-white ring-4 ring-orange-100 animate-pulse'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        ) : (
                          <Circle className="w-2.5 h-2.5" />
                        )}
                      </div>

                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-bold ${isCurrent ? 'text-orange-700 text-sm' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                            {event.title}
                          </h4>
                          <span className="font-mono text-[11px] text-slate-400 font-semibold">
                            {event.time}
                          </span>
                        </div>
                        <p className={`mt-0.5 text-[11px] ${isCurrent ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Footer CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Digital Handover Hash: #7492-Jaipur</span>
              <button
                onClick={() => setActiveScreen('volunteer-mobile')}
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>Volunteer View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
