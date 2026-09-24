import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Truck, 
  Building2, 
  Plus, 
  Sparkles, 
  ChevronRight,
  Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KPICards } from './KPICards';
import { InteractiveRescueMap } from './InteractiveRescueMap';
import { Sidebar, DashboardSubTab } from './Sidebar';
import { 
  VolunteersFleetView, 
  NgosDirectoryView, 
  RoutesCorridorView, 
  SettingsAndEmptyStatesView 
} from './DashboardSubViews';
import { RescueStatus } from '../types';

interface MainDashboardProps {
  onOpenAddDonationModal: () => void;
  onOpenCreateRequestModal: () => void;
  onOpenNotifications: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ 
  onOpenAddDonationModal,
  onOpenCreateRequestModal,
  onOpenNotifications
}) => {
  const { 
    donations, 
    setActiveScreen, 
    setSelectedDonationForMatch,
    selectedLocationFilter,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'active' | 'in_transit' | 'completed'>('all');
  const [currentSubTab, setCurrentSubTab] = useState<DashboardSubTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Filter donations according to status, location, and search
  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.location.area.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = selectedLocationFilter === 'All Jaipur' || 
                            d.location.area.toLowerCase().includes(selectedLocationFilter.toLowerCase());

    if (!matchesSearch || !matchesLocation) return false;

    if (activeTabFilter === 'active') return d.status === 'Pending Match' || d.status === 'Matched';
    if (activeTabFilter === 'in_transit') return d.status === 'Volunteer Assigned' || d.status === 'In Transit';
    if (activeTabFilter === 'completed') return d.status === 'Delivered';
    return true;
  });

  const getStatusBadge = (status: RescueStatus) => {
    switch (status) {
      case 'Pending Match':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">🟡 Pending Match</span>;
      case 'Matched':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">🔵 Matched</span>;
      case 'Volunteer Assigned':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">🚚 Assigned</span>;
      case 'In Transit':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">🟠 In Transit</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">🟢 Delivered</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="flex-1 flex min-h-[calc(100vh-64px)] bg-slate-50">
      
      {/* 1. Collapsible Left Sidebar (as required in prompt Section 2) */}
      <Sidebar 
        currentTab={currentSubTab}
        onSelectTab={(tab) => setCurrentSubTab(tab)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenNotifications={onOpenNotifications}
        onOpenAddModal={onOpenAddDonationModal}
      />

      {/* 2. Main Dashboard Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Search & Filter Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 sticky top-0 z-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search donor, food type, Jaipur area or volunteer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenCreateRequestModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Food Request</span>
              </button>

              <button
                onClick={onOpenAddDonationModal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add Surplus Food</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab-driven Content Area */}
        <main className="p-4 sm:p-6 w-full space-y-6 flex-1">
          
          {/* A. OVERVIEW TAB: KPI Cards + Map + Activity Feed */}
          {currentSubTab === 'overview' && (
            <>
              {/* KPI Summary Cards */}
              <section aria-label="Key Performance Indicators">
                <KPICards />
              </section>

              {/* Live Rescue Map Section (Main Visual Element) */}
              <section aria-label="Live Rescue Map" className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Jaipur Real-Time Food Rescue Routing
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500">
                      Live interactive dispatch matrix connecting donors (🟢), shelters (🔵), and active volunteer vehicles (🟠).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Active Zone:</span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {selectedLocationFilter}
                    </span>
                  </div>
                </div>

                {/* Interactive Leaflet Map */}
                <InteractiveRescueMap height="500px" />
              </section>

              {/* Live Rescue Activity Table / Feed */}
              <section aria-label="Live Rescue Dispatch Activity" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Live Rescues & Active Donations</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Monitoring {filteredDonations.length} surplus batches in routing queue.
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 self-start md:self-auto">
                    <button
                      onClick={() => setActiveTabFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        activeTabFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                      }`}
                    >
                      All ({donations.length})
                    </button>
                    <button
                      onClick={() => setActiveTabFilter('active')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        activeTabFilter === 'active' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                      }`}
                    >
                      Surplus Ready ({donations.filter(d => d.status === 'Pending Match' || d.status === 'Matched').length})
                    </button>
                    <button
                      onClick={() => setActiveTabFilter('in_transit')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        activeTabFilter === 'in_transit' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                      }`}
                    >
                      In Transit ({donations.filter(d => d.status === 'Volunteer Assigned' || d.status === 'In Transit').length})
                    </button>
                    <button
                      onClick={() => setActiveTabFilter('completed')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        activeTabFilter === 'completed' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                      }`}
                    >
                      Delivered
                    </button>
                  </div>
                </div>

                {/* Table List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Donor & Food Details</th>
                        <th className="py-3 px-4">Meals / Qty</th>
                        <th className="py-3 px-4">Pickup Deadline</th>
                        <th className="py-3 px-4">Matched Destination</th>
                        <th className="py-3 px-4">Volunteer</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDonations.map((don) => (
                        <tr key={don.id} className="hover:bg-slate-50/60 transition-colors">
                          
                          {/* Donor Details */}
                          <td className="py-3.5 px-4">
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{don.donorName}</div>
                              <div className="text-slate-600 font-medium truncate max-w-xs">{don.foodName}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-600" />
                                <span>{don.location.area}</span>
                                <span>•</span>
                                <span>{don.category}</span>
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-slate-900 text-sm">
                              {don.quantityMeals} meals
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              ~{don.weightKg || Math.round(don.quantityMeals * 0.45)} kg
                            </div>
                          </td>

                          {/* Deadline */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 font-semibold text-slate-800">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>{don.pickupDeadline}</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Prep: {don.preparedTime}
                            </div>
                          </td>

                          {/* Matched Shelter */}
                          <td className="py-3.5 px-4">
                            {don.matchedShelterName ? (
                              <div>
                                <div className="font-semibold text-blue-700">{don.matchedShelterName}</div>
                                <div className="text-[11px] text-slate-400">Direct Delivery Target</div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Awaiting Smart Match</span>
                            )}
                          </td>

                          {/* Volunteer */}
                          <td className="py-3.5 px-4">
                            {don.assignedVolunteerName ? (
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                <Truck className="w-3.5 h-3.5 text-orange-500" />
                                <span>{don.assignedVolunteerName}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4">
                            {getStatusBadge(don.status)}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right">
                            {don.status === 'Pending Match' ? (
                              <button
                                onClick={() => {
                                  setSelectedDonationForMatch(don);
                                  setActiveScreen('smart-match');
                                }}
                                className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Smart Match</span>
                              </button>
                            ) : don.status === 'Volunteer Assigned' || don.status === 'In Transit' ? (
                              <button
                                onClick={() => setActiveScreen('live-tracking')}
                                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs"
                              >
                                <Navigation className="w-3 h-3" />
                                <span>Track Live</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedDonationForMatch(don);
                                  setActiveScreen('donations');
                                }}
                                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 text-xs"
                              >
                                <span>Details</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div>Showing {filteredDonations.length} of {donations.length} recorded food surplus batches</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-emerald-700">● Live Stream Synchronized</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* B. VOLUNTEERS FLEET TAB */}
          {currentSubTab === 'volunteers' && <VolunteersFleetView />}

          {/* C. NGOS DIRECTORY TAB */}
          {currentSubTab === 'ngos' && <NgosDirectoryView />}

          {/* D. ROUTES & ARTERIES TAB */}
          {currentSubTab === 'routes' && <RoutesCorridorView />}

          {/* E. SETTINGS & EMPTY STATES INSPECTOR TAB */}
          {currentSubTab === 'settings' && <SettingsAndEmptyStatesView />}

        </main>
      </div>

    </div>
  );
};
