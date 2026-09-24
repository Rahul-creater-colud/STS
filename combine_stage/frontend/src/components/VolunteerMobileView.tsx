import React, { useState } from 'react';
import { 
  Smartphone, 
  Navigation, 
  Phone, 
  ShieldCheck, 
  PackageCheck, 
  CheckCircle2,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VolunteerMobileView: React.FC = () => {
  const { 
    activeMission, 
    advanceVolunteerStep, 
    setActiveScreen,
    isSimulatingGps,
    setIsSimulatingGps 
  } = useApp();

  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [enteredOtp, setEnteredOtp] = useState<string>('7492');
  const [temperatureVerified, setTemperatureVerified] = useState<boolean>(true);
  const [recipientSignature, setRecipientSignature] = useState<string>('Sunita Sharma (Superintendent)');

  const isAssigned = activeMission.status === 'Volunteer Assigned' || activeMission.status === 'En Route to Pickup';
  const isInTransit = activeMission.status === 'In Transit' || activeMission.status === 'Food Picked Up';
  const isDelivered = activeMission.status === 'Delivered';

  const steps = [
    { id: 'assigned', label: 'Assigned', completed: true, current: isAssigned },
    { id: 'pickup', label: 'Pickup', completed: isInTransit || isDelivered, current: isAssigned },
    { id: 'transit', label: 'In Transit', completed: isDelivered, current: isInTransit },
    { id: 'delivered', label: 'Delivered', completed: isDelivered, current: isDelivered },
  ];

  return (
    <div className="flex-1 min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center justify-start">
      
      {/* Device Viewport Toggle Toolbar */}
      <div className="mb-6 flex items-center justify-between w-full max-w-md bg-white p-2 rounded-2xl shadow-xs border border-slate-200 text-xs font-semibold">
        <div className="flex items-center gap-1.5 px-2 text-slate-700">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Volunteer Driver Mobile UX</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDeviceFrameMode(true)}
            className={`px-3 py-1 rounded-xl transition cursor-pointer ${
              deviceFrameMode ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Phone Frame
          </button>
          <button
            onClick={() => setDeviceFrameMode(false)}
            className={`px-3 py-1 rounded-xl transition cursor-pointer ${
              !deviceFrameMode ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Full Width
          </button>
        </div>
      </div>

      {/* Main Container / Phone Mockup Wrapper */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceFrameMode
            ? 'max-w-sm rounded-[40px] border-[8px] border-slate-900 shadow-2xl bg-white overflow-hidden ring-4 ring-slate-300'
            : 'max-w-3xl rounded-3xl border border-slate-200 shadow-lg bg-white overflow-hidden'
        }`}
      >
        {/* Phone Notch & Status Bar (in Phone Frame Mode) */}
        {deviceFrameMode && (
          <div className="bg-slate-900 px-6 pt-3 pb-2 flex items-center justify-between text-white text-[11px] font-mono">
            <span>7:14 PM</span>
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <span>5G</span>
              <span>94%</span>
            </div>
          </div>
        )}

        {/* Header: Active Rescue */}
        <div className="bg-slate-900 text-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Rescue Mission
              </span>
              <h1 className="text-lg font-black tracking-tight">
                Active Rescue #{activeMission.rescueCode.replace('RESCUE-', '')}
              </h1>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeMission.status}
            </span>
          </div>

          {/* Step Progress Indicator: Assigned → Pickup → In Transit → Delivered */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-colors ${
                      s.completed
                        ? 'bg-emerald-500 text-white'
                        : s.current
                        ? 'bg-orange-500 text-white ring-2 ring-orange-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {s.completed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={`mt-1 font-medium ${s.current || s.completed ? 'text-white' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1.5 transition-colors ${
                      steps[idx + 1].completed || steps[idx + 1].current
                        ? 'bg-emerald-500'
                        : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Quick Metrics Bar (Food, Distance, ETA) */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Food Cargo</span>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {activeMission.mealsCount} meals
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">{activeMission.dietary}</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Distance</span>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {activeMission.totalDistanceKm} km
              </div>
              <span className="text-[10px] text-slate-500">Fast corridor</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">ETA</span>
              <div className="text-sm font-black text-orange-600 mt-0.5">
                {activeMission.etaMinutes} mins
              </div>
              <span className="text-[10px] text-slate-500">Live GPS</span>
            </div>
          </div>

          {/* Route Segment Visual Card */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
            
            {/* PICKUP */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                🟢
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  PICKUP
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">
                  {activeMission.donorName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeMission.donorLocation.address}, {activeMission.donorLocation.area}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href="tel:+919829011420"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    Call Kitchen
                  </a>
                </div>
              </div>
            </div>

            {/* Connecting Route Indicator */}
            <div className="flex items-center gap-3 pl-4">
              <div className="w-0.5 h-6 bg-slate-200 border-l border-dashed border-slate-400 ml-3" />
              <span className="text-[11px] text-slate-400 font-mono">
                ↓ 3.2 km via JLN Marg
              </span>
            </div>

            {/* DROPOFF */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                🔵
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  DROPOFF
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">
                  {activeMission.shelterName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeMission.shelterLocation.address}, {activeMission.shelterLocation.area}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href="tel:+919829087341"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                  >
                    <Phone className="w-3 h-3 text-blue-600" />
                    Call Superintendent
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Check Verification Form */}
          {isAssigned && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Pickup Verification Code:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Donor OTP:</span>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-20 px-2 py-1 bg-white border border-amber-300 rounded font-mono font-bold text-center text-slate-900"
                />
                <label className="flex items-center gap-1 text-[11px] text-amber-800 ml-auto cursor-pointer">
                  <input
                    type="checkbox"
                    checked={temperatureVerified}
                    onChange={(e) => setTemperatureVerified(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Temp &gt; 60°C Verified</span>
                </label>
              </div>
            </div>
          )}

          {isInTransit && (
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Delivery Handover Protocol:</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Food crates inspected and handed over to shelter intake manager.
              </p>
              <input
                type="text"
                value={recipientSignature}
                onChange={(e) => setRecipientSignature(e.target.value)}
                placeholder="Recipient name / signature"
                className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-slate-800"
              />
            </div>
          )}

          {/* Touch-Friendly Large CTA Buttons */}
          <div className="space-y-2.5 pt-2">
            
            {/* Primary Action Button */}
            {isAssigned && (
              <div className="space-y-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeMission.donorLocation.lat},${activeMission.donorLocation.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Start Navigation to Pickup</span>
                </a>

                <button
                  onClick={advanceVolunteerStep}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Confirm Pickup (OTP Verified)</span>
                </button>
              </div>
            )}

            {isInTransit && (
              <div className="space-y-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeMission.shelterLocation.lat},${activeMission.shelterLocation.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Route in Google Maps</span>
                </a>

                <button
                  onClick={advanceVolunteerStep}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md shadow-orange-600/30 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Delivery & Sign-off</span>
                </button>
              </div>
            )}

            {isDelivered && (
              <div className="text-center py-4 space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  Mission Accomplished!
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  {activeMission.mealsCount} meals safely delivered. +50 Volunteer impact credits awarded.
                </p>
                <button
                  onClick={() => setActiveScreen('analytics')}
                  className="inline-flex items-center gap-1.5 mt-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <span>View Impact Dashboard</span>
                </button>
              </div>
            )}

            {/* GPS Simulation Toggle */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span>Volunteer: <strong>{activeMission.volunteerName}</strong></span>
              <button
                onClick={() => setIsSimulatingGps(!isSimulatingGps)}
                className="text-emerald-700 hover:text-emerald-800 font-semibold underline cursor-pointer"
              >
                {isSimulatingGps ? 'Pause GPS Sim' : 'Simulate Vehicle Movement'}
              </button>
            </div>

          </div>

        </div>

        {/* Phone Bottom Home Bar */}
        {deviceFrameMode && (
          <div className="bg-slate-900 py-3 flex justify-center">
            <div className="w-32 h-1 bg-slate-700 rounded-full" />
          </div>
        )}

      </div>

    </div>
  );
};
