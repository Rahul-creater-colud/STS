import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  Utensils, 
  Award, 
  PieChart, 
  ArrowUpRight,
  Download,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { kpis, donations, requests } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  // Realistic mock historical trend data
  const rescuedOverTime = [
    { day: 'Mon', meals: 1420, height: 45 },
    { day: 'Tue', meals: 1680, height: 55 },
    { day: 'Wed', meals: 1510, height: 48 },
    { day: 'Thu', meals: 1890, height: 62 },
    { day: 'Fri', meals: 2340, height: 78 },
    { day: 'Sat', meals: 2750, height: 92 },
    { day: 'Sun', meals: 2460, height: 82 },
  ];

  const areaDistribution = [
    { area: 'C-Scheme', count: 48, percentage: 35, color: 'bg-emerald-500' },
    { area: 'Malviya Nagar', count: 36, percentage: 26, color: 'bg-teal-500' },
    { area: 'Tonk Road', count: 24, percentage: 18, color: 'bg-blue-500' },
    { area: 'Vaishali Nagar', count: 18, percentage: 13, color: 'bg-indigo-500' },
    { area: 'Pink City / Old Jaipur', count: 11, percentage: 8, color: 'bg-purple-500' },
  ];

  const categoryDistribution = [
    { label: 'Cooked Hot Meals', percentage: 62, color: 'text-emerald-500', fill: '#10B981' },
    { label: 'Bakery & Bread', percentage: 18, color: 'text-amber-500', fill: '#F59E0B' },
    { label: 'Fresh Produce', percentage: 12, color: 'text-blue-500', fill: '#3B82F6' },
    { label: 'Packaged & Dairy', percentage: 8, color: 'text-purple-500', fill: '#8B5CF6' },
  ];

  const wardsData = [
    { zone: 'Zone 1: C-Scheme / Civil Lines', surplus: 'Very High (Banquets/Hotels)', demand: 'Low', status: 'Net Donor Exporter' },
    { zone: 'Zone 2: Sindhi Camp / Station', surplus: 'Low', demand: 'Critical (Night Shelters)', status: 'High Priority Sink' },
    { zone: 'Zone 3: Sanganer Gate / Pink City', surplus: 'Moderate', demand: 'Very High (Destitute Homes)', status: 'Net Deficit' },
    { zone: 'Zone 4: Malviya Nagar / Tonk Rd', surplus: 'High (Hostels/Cafes)', demand: 'Moderate', status: 'Balanced Routing' },
    { zone: 'Zone 5: Vaishali Nagar', surplus: 'Moderate (Bakeries/Sweetshops)', demand: 'Low', status: 'Surplus Corridor' },
  ];

  return (
    <div className="flex-1 min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Analytics Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Municipal Food Logistics & Environmental Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Impact & Logistics Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comprehensive telemetry measuring meal diversion rates, routing efficiency, carbon offsets, and ward supply/demand balance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timeRange === '7d' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timeRange === '30d' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timeRange === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                All Time
              </button>
            </div>

            <button
              onClick={() => alert('Exporting Official Municipal CSR & Audit Certificate PDF...')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* Efficiency Metric Cards (as specifically requested in prompt) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Delivery Time</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {kpis.avgDeliveryTimeMinutes} min
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>-3.4 mins vs traditional NGOs</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Route Distance</span>
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {kpis.avgRouteDistanceKm} km
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              <span>Hyper-local cluster matching</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Successful Match Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
              {kpis.successfulMatchRate}%
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-medium">
              <span>187 of 190 batches delivered</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Failed Rescue Rate</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {kpis.failedRescueRate}%
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              <span>Industry benchmark: ~18%</span>
            </div>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart 1: Food Rescued Over Time (Line / Bar) - 7 cols */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Food Rescued Over Time
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daily volume of fresh meals rescued across Jaipur
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Total: 13,850 meals
                </span>
              </div>

              {/* Bar/Curve Visual Chart */}
              <div className="mt-8 h-48 flex items-end justify-between gap-3 px-2">
                {rescuedOverTime.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.meals}
                    </div>
                    <div
                      className="w-full bg-emerald-500/80 group-hover:bg-emerald-600 transition-all rounded-t-xl"
                      style={{ height: `${item.height * 1.5}px` }}
                    />
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Peak rescue volume occurs Friday & Saturday nights (wedding banquet peak).</span>
              <span className="font-bold text-slate-800">100% Edible Target Met</span>
            </div>
          </div>

          {/* Chart 2: Category Distribution Donut - 5 cols */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Food Category Breakdown
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Distribution of incoming surplus food types
                  </p>
                </div>
                <PieChart className="w-4 h-4 text-slate-400" />
              </div>

              {/* Donut representation */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Ring background */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                    {/* Segment 1: Cooked Meals (62%) */}
                    <circle
                      cx="18" cy="18" r="14" fill="none" stroke="#059669" strokeWidth="4"
                      strokeDasharray="54.5 33.5" strokeDashoffset="0"
                    />
                    {/* Segment 2: Bakery (18%) */}
                    <circle
                      cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4"
                      strokeDasharray="15.8 72.2" strokeDashoffset="-54.5"
                    />
                    {/* Segment 3: Produce (12%) */}
                    <circle
                      cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4"
                      strokeDasharray="10.5 77.5" strokeDashoffset="-70.3"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-black text-slate-900">62%</span>
                    <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Hot Cooked</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  {categoryDistribution.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                      <span className="text-slate-600 font-medium">{cat.label}:</span>
                      <strong className="text-slate-900 ml-auto">{cat.percentage}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
              Hot cooked meals undergo mandatory thermal checks (&gt;60°C) before dispatch.
            </div>
          </div>

        </div>

        {/* Section: Donations by Area (Bar Chart) & Jaipur Surplus vs Demand Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Donations by Area - 6 cols */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Donations by Jaipur Area
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Surplus generation volume by municipal territory
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {areaDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">{item.area}</span>
                    <span className="font-bold text-slate-900">{item.count} batches ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jaipur Heatmap / Supply vs Demand Matrix - 6 cols */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Jaipur Surplus vs Demand Heatmap
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time equilibrium across commercial supply corridors & shelter demand
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                {wardsData.map((w, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{w.zone}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Surplus: <span className="font-semibold text-emerald-700">{w.surplus}</span> • Demand: <span className="font-semibold text-rose-600">{w.demand}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap">
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Automatic cross-zone rebalancing triggered every 15 minutes.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
