import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Utensils, 
  ChevronRight, 
  Sparkles,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShelterRequest, UrgencyLevel } from '../types';

interface NgoDashboardProps {
  onOpenCreateRequestModal: () => void;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({ onOpenCreateRequestModal }) => {
  const { requests, donations, setActiveScreen, setSelectedDonationForMatch } = useApp();
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const filteredRequests = requests.filter(r => {
    if (filterUrgency === 'all') return true;
    return r.urgency.toLowerCase() === filterUrgency.toLowerCase();
  });

  const totalRequired = requests.reduce((acc, curr) => acc + curr.requiredMeals, 0);
  const totalReceived = requests.reduce((acc, curr) => acc + curr.receivedMeals, 0);

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
            Critical Need
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            High Urgency
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Low
          </span>
        );
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Intake Quota Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-800/60 text-blue-200 border border-blue-500/30 mb-3">
                <Building2 className="w-3.5 h-3.5 text-blue-300" />
                <span>NGO & Shelter Food Bank Coordinator Network</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Food Requests & Shelter Intake
              </h1>
              <p className="text-blue-100 text-sm mt-1 max-w-xl">
                Real-time nutritional demand queue matching registered shelters with commercial food rescue logistics.
              </p>
            </div>

            <button
              onClick={onOpenCreateRequestModal}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-extrabold px-5 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>+ Create Request</span>
            </button>
          </div>

          {/* Quota Progress Summary */}
          <div className="mt-6 pt-6 border-t border-blue-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-blue-300 font-medium">Tonight's Meal Demand</span>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{totalRequired} meals</div>
            </div>
            <div>
              <span className="text-blue-300 font-medium">Fulfilled from Surplus</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{totalReceived} meals</div>
            </div>
            <div>
              <span className="text-blue-300 font-medium">Remaining Deficit</span>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">{totalRequired - totalReceived} meals</div>
            </div>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterUrgency('all')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filterUrgency === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              All Requests ({requests.length})
            </button>
            <button
              onClick={() => setFilterUrgency('critical')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filterUrgency === 'critical' ? 'bg-rose-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              🚨 Critical ({requests.filter(r => r.urgency === 'Critical').length})
            </button>
            <button
              onClick={() => setFilterUrgency('high')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filterUrgency === 'high' ? 'bg-amber-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              High Urgency ({requests.filter(r => r.urgency === 'High').length})
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Active Shelter Needs: {filteredRequests.length} centers
          </span>
        </div>

        {/* Request Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((req) => {
            const percentage = Math.round((req.receivedMeals / req.requiredMeals) * 100);
            const isFulfilled = req.receivedMeals >= req.requiredMeals;
            const remaining = req.requiredMeals - req.receivedMeals;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  {/* Top Bar with Urgency and Code */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {req.shelterCode}
                    </span>
                    {getUrgencyBadge(req.urgency)}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                      {req.shelterName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.beneficiaryCount} resident beneficiaries</span>
                    </p>
                  </div>

                  {/* Progress Bar (60 / 60 meals fulfilled) */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        {req.receivedMeals} / {req.requiredMeals} meals fulfilled
                      </span>
                      <span className={`font-mono font-bold ${isFulfilled ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFulfilled ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between pt-0.5">
                      <span>{isFulfilled ? '✅ Fully Satiated' : `Deficit: ${remaining} meals needed`}</span>
                      <span>Preference: {req.dietaryPreference}</span>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">{req.location.area}</span>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{req.location.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Deadline: {req.deadlineTime}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                        ~2.4 km from donors
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  {isFulfilled ? (
                    <button
                      onClick={() => setActiveScreen('live-tracking')}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs py-2 rounded-xl transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivery Active • View Tracker</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const matchingDon = donations.find(d => d.status === 'Pending Match') || donations[0];
                        setSelectedDonationForMatch(matchingDon);
                        setActiveScreen('smart-match');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Find Surplus Match</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
