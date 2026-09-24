import React, { useState } from 'react';
import { 
  Cpu, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Building2, 
  ChevronRight, 
  Award, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Utensils
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodDonation, ShelterRequest, SmartMatchOption } from '../types';

export const SmartMatchView: React.FC = () => {
  const { 
    donations, 
    requests, 
    volunteers, 
    selectedDonationForMatch, 
    setSelectedDonationForMatch,
    dispatchMatch,
    setActiveScreen 
  } = useApp();

  // If no donation selected, pick first pending or first donation
  const currentDonation = selectedDonationForMatch || donations.find(d => d.status === 'Pending Match') || donations[0];

  // Calculate algorithmically ranked matches for this donation
  const calculateMatches = (donation: FoodDonation): SmartMatchOption[] => {
    return requests.map(shelter => {
      // 1. Proximity score (Max 35): closer is better
      const dist = Math.abs(shelter.location.lat - donation.location.lat) * 111 + 
                   Math.abs(shelter.location.lng - donation.location.lng) * 95;
      const distanceKm = Number(dist.toFixed(1));
      const proximity = Math.max(5, Math.round(35 - distanceKm * 3.2));

      // 2. Quantity compatibility (Max 25): how close the donation satisfies the shelter's deficit
      const deficit = shelter.requiredMeals - shelter.receivedMeals;
      const ratio = Math.min(donation.quantityMeals, deficit) / Math.max(donation.quantityMeals, deficit);
      const quantityFit = Math.round(ratio * 25);
      const quantityMatchPercentage = Math.round(ratio * 100);

      // 3. Time Urgency & Expiry Buffer (Max 25): Critical/High urgency shelters get priority
      let timeUrgency = 15;
      if (shelter.urgency === 'Critical') timeUrgency = 25;
      else if (shelter.urgency === 'High') timeUrgency = 22;
      else if (shelter.urgency === 'Medium') timeUrgency = 18;

      // 4. Dietary & Handling (Max 15): Diet match
      const dietarySafety = shelter.dietaryPreference === donation.dietary ? 15 : 10;

      const totalScore = Math.min(98, proximity + quantityFit + timeUrgency + dietarySafety);

      const etaMinutes = Math.round(distanceKm * 2.8 + 6);

      return {
        shelter,
        matchScore: totalScore,
        distanceKm,
        etaMinutes,
        urgencyBonus: timeUrgency,
        quantityMatchPercentage,
        scoreBreakdown: {
          proximity,
          quantityFit,
          timeUrgency,
          dietarySafety
        },
        reasoning: `${distanceKm} km transit corridor via Tonk Rd. Fulfills ${Math.min(donation.quantityMeals, deficit)} of ${deficit} needed meals with ${donation.pickupDeadline} buffer.`
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const rankedMatches = calculateMatches(currentDonation);
  const recommendedMatch = rankedMatches[0];

  const [selectedShelterId, setSelectedShelterId] = useState<string>(recommendedMatch?.shelter.id || '');

  const handleDispatch = (shelterId: string) => {
    dispatchMatch(currentDonation.id, shelterId);
    setActiveScreen('live-tracking');
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Multi-Factor Logistics Optimization Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Smart Match Dispatch Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Algorithmic matching pairing surplus batches with highest-need shelters based on real-time transit distance, portion volume, food perishability, and dietary compliance.
            </p>
          </div>

          {/* Donor Switcher Dropdown */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500">Matching For Surplus Batch:</span>
            <select
              value={currentDonation.id}
              onChange={(e) => {
                const found = donations.find(d => d.id === e.target.value);
                if (found) setSelectedDonationForMatch(found);
              }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {donations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.donorName} — {d.quantityMeals} meals ({d.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Match Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Active Surplus Donation Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Surplus Batch
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {currentDonation.status}
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl">
                    {currentDonation.donorName}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                    {currentDonation.foodName}
                  </p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-800 font-medium">Batch Volume</span>
                    <div className="text-3xl font-black text-emerald-950 mt-0.5">
                      {currentDonation.quantityMeals}
                    </div>
                    <span className="text-[11px] text-emerald-700">fresh meals (~{currentDonation.weightKg || 38} kg)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-emerald-800 font-medium">Dietary Type</span>
                    <div className="text-sm font-bold text-emerald-900 mt-0.5">
                      {currentDonation.dietary}
                    </div>
                    <span className="text-[11px] text-emerald-700">{currentDonation.category}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-slate-800">Origin Location:</strong>
                      <div>{currentDonation.location.address}</div>
                      <div className="text-slate-500 font-medium">{currentDonation.location.area}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Pickup Window Deadline: <strong className="text-slate-900">{currentDonation.pickupDeadline}</strong></span>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>Packaging:</strong> {currentDonation.packaging} • {currentDonation.storageTemp}
                  </div>
                </div>

                {/* Algorithmic Weighting Legend */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-2">Scoring Model Weights:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="bg-slate-50 p-2 rounded-lg">📍 Proximity: <strong>35%</strong></div>
                    <div className="bg-slate-50 p-2 rounded-lg">⚖️ Quantity Fit: <strong>25%</strong></div>
                    <div className="bg-slate-50 p-2 rounded-lg">⏳ Urgency/Buffer: <strong>25%</strong></div>
                    <div className="bg-slate-50 p-2 rounded-lg">🥗 Dietary Safety: <strong>15%</strong></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: Ranked Match Options (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Ranked Match Options</span>
                <span className="text-xs font-semibold text-slate-400">
                  (Calculated across {requests.length} open shelter demand points)
                </span>
              </h2>
            </div>

            {rankedMatches.map((option, idx) => {
              const isRecommended = idx === 0;
              const { shelter, matchScore, distanceKm, etaMinutes, scoreBreakdown } = option;
              const isSelected = selectedShelterId === shelter.id;

              return (
                <div
                  key={shelter.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden relative ${
                    isRecommended
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {/* Recommended Banner */}
                  {isRecommended && (
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2 text-xs font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-200" />
                        <span>Recommended Match — Optimal Efficiency Score</span>
                      </div>
                      <span className="font-mono text-[11px] bg-emerald-800/60 px-2 py-0.5 rounded">
                        Transit &lt; {etaMinutes} mins
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      
                      {/* Shelter Title & Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold text-slate-900">
                            {shelter.shelterName}
                          </h3>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {shelter.shelterCode}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            {shelter.location.area} ({distanceKm} km away)
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            Deadline: <strong>{shelter.deadlineTime}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Match Score Display */}
                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Match Score
                          </span>
                          <span className={`text-3xl font-black ${
                            matchScore >= 90 ? 'text-emerald-600' : matchScore >= 75 ? 'text-blue-600' : 'text-amber-600'
                          }`}>
                            {matchScore}%
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Needs & Progress Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Meals Needed:</span>
                        <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                          {shelter.requiredMeals - shelter.receivedMeals} meals
                        </div>
                        <span className="text-[10px] text-slate-400">Total target: {shelter.requiredMeals}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 font-medium">Transit Route:</span>
                        <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                          {distanceKm} km • {etaMinutes} mins
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">Fastest clear corridor</span>
                      </div>

                      <div>
                        <span className="text-slate-500 font-medium">Shelter Urgency:</span>
                        <div className="font-extrabold text-rose-600 text-sm mt-0.5">
                          {shelter.urgency} Urgency
                        </div>
                        <span className="text-[10px] text-slate-400">{shelter.beneficiaryCount} residents</span>
                      </div>
                    </div>

                    {/* Factor Breakdown Bars */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Logistics Factor Breakdown:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400">Proximity</span>
                          <div className="font-bold text-slate-800">{scoreBreakdown.proximity} / 35 pts</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400">Quantity Fit</span>
                          <div className="font-bold text-slate-800">{scoreBreakdown.quantityFit} / 25 pts</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400">Urgency Buffer</span>
                          <div className="font-bold text-slate-800">{scoreBreakdown.timeUrgency} / 25 pts</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400">Dietary Safety</span>
                          <div className="font-bold text-slate-800">{scoreBreakdown.dietarySafety} / 15 pts</div>
                        </div>
                      </div>
                    </div>

                    {/* Dispatch CTA */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        {option.reasoning}
                      </div>

                      <button
                        onClick={() => handleDispatch(shelter.id)}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer ${
                          isRecommended
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span>Dispatch Match & Route Volunteer</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </div>
  );
};
