import React, { useState } from 'react';
import { 
  Plus, 
  Utensils, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Building2, 
  Navigation, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Calendar,
  Leaf,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodDonation, RescueStatus } from '../types';

interface DonorDashboardProps {
  onOpenAddModal: () => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ onOpenAddModal }) => {
  const { 
    donations, 
    setActiveScreen, 
    setSelectedDonationForMatch 
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'matched' | 'in_transit' | 'delivered'>('all');

  const filtered = donations.filter(d => {
    if (filterTab === 'pending') return d.status === 'Pending Match';
    if (filterTab === 'matched') return d.status === 'Matched';
    if (filterTab === 'in_transit') return d.status === 'Volunteer Assigned' || d.status === 'In Transit';
    if (filterTab === 'delivered') return d.status === 'Delivered';
    return true;
  });

  const totalMealsDonated = donations.reduce((acc, curr) => acc + curr.quantityMeals, 0);

  return (
    <div className="flex-1 min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Donor Banner & Impact Overview */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 text-emerald-200 border border-emerald-500/30 mb-3">
                <Award className="w-3.5 h-3.5 text-emerald-300" />
                <span>Verified Commercial Food Donor • Jaipur Chapter</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                My Food Donations
              </h1>
              <p className="text-emerald-100 text-sm mt-1 max-w-xl">
                Track surplus food batches, monitor volunteer dispatch in real-time, and download CSR compliance & tax impact receipts.
              </p>
            </div>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold px-5 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              <Plus className="w-5 h-5 stroke-[2.5] text-emerald-600" />
              <span>+ Add Surplus Food</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-700/50 text-xs">
            <div>
              <span className="text-emerald-300 font-medium">Total Rescued</span>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{totalMealsDonated} meals</div>
            </div>
            <div>
              <span className="text-emerald-300 font-medium">CO₂ Averted</span>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{Math.round(totalMealsDonated * 0.35)} kg CO₂e</div>
            </div>
            <div>
              <span className="text-emerald-300 font-medium">Active Shelters Fed</span>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">8 Shelters</div>
            </div>
            <div>
              <span className="text-emerald-300 font-medium">Avg Pickup Time</span>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">22 mins</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filterTab === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              All Batches ({donations.length})
            </button>
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filterTab === 'pending' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Pending Match ({donations.filter(d => d.status === 'Pending Match').length})
            </button>
            <button
              onClick={() => setFilterTab('matched')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filterTab === 'matched' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Matched ({donations.filter(d => d.status === 'Matched').length})
            </button>
            <button
              onClick={() => setFilterTab('in_transit')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filterTab === 'in_transit' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              In Transit ({donations.filter(d => d.status === 'Volunteer Assigned' || d.status === 'In Transit').length})
            </button>
            <button
              onClick={() => setFilterTab('delivered')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                filterTab === 'delivered' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Delivered
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium px-2">
            Showing {filtered.length} food postings
          </span>
        </div>

        {/* Donation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((don) => {
            const isPending = don.status === 'Pending Match';
            const isMatched = don.status === 'Matched';
            const isInTransit = don.status === 'In Transit' || don.status === 'Volunteer Assigned';
            const isDelivered = don.status === 'Delivered';

            return (
              <div
                key={don.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                      {don.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {don.dietary}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                      {don.foodName}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-slate-900">{don.quantityMeals}</span>
                      <span className="text-xs font-semibold text-slate-500">fresh meals</span>
                      <span className="text-xs text-slate-400 font-mono">({don.weightKg || 35} kg)</span>
                    </div>
                  </div>

                  {/* Location & Times */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">{don.location.area}</span>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{don.location.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Pickup before <strong className="text-slate-800">{don.pickupDeadline}</strong></span>
                    </div>
                  </div>

                  {/* Logistics Status Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Logistics Status:</span>
                      {isPending && (
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                          🟡 Pending Match
                        </span>
                      )}
                      {isMatched && (
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          ✅ Matched
                        </span>
                      )}
                      {isInTransit && (
                        <span className="font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-[11px]">
                          🚚 Volunteer Assigned
                        </span>
                      )}
                      {isDelivered && (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          🟢 Delivered
                        </span>
                      )}
                    </div>

                    {don.matchedShelterName && (
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span className="truncate"><strong>Matched NGO:</strong> {don.matchedShelterName}</span>
                      </div>
                    )}

                    {don.assignedVolunteerName && (
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Truck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span><strong>Volunteer:</strong> {don.assignedVolunteerName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isPending ? (
                    <button
                      onClick={() => {
                        setSelectedDonationForMatch(don);
                        setActiveScreen('smart-match');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Find Best Match</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveScreen('live-tracking')}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Track Delivery</span>
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
