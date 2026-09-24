import React, { useState } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Bell, 
  Plus, 
  Compass, 
  LayoutDashboard, 
  Utensils, 
  Building2, 
  Cpu, 
  Smartphone, 
  Navigation, 
  BarChart3, 
  User, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveScreen } from '../types';
import { setAuthToken } from '../services/api';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, onOpenNotifications }) => {
  const { 
    activeScreen, 
    setActiveScreen, 
    userRole, 
    notifications, 
    selectedLocationFilter, 
    setSelectedLocationFilter 
  } = useApp();

  const [locMenuOpen, setLocMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks: { id: ActiveScreen; label: string; icon: React.ElementType }[] = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'dashboard', label: 'Command Hub', icon: LayoutDashboard },
    { id: 'donations', label: 'Donations', icon: Utensils },
    { id: 'requests', label: 'Food Requests', icon: Building2 },
    { id: 'smart-match', label: 'Smart Match', icon: Cpu },
    { id: 'volunteer-mobile', label: 'Volunteer App', icon: Smartphone },
    { id: 'live-tracking', label: 'Live Tracking', icon: Navigation },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const locations = [
    'All Jaipur',
    'C-Scheme',
    'Malviya Nagar',
    'Tonk Road',
    'Raja Park',
    'Vaishali Nagar',
    'Pink City / Sanganer'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveScreen('landing')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Surplus-to-Shelter
                  <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Jaipur Logistics
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Turn surplus food into real impact.
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeScreen === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveScreen(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs ring-1 ring-emerald-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Location Selector */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setLocMenuOpen(!locMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="max-w-[100px] truncate">{selectedLocationFilter}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {locMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Jaipur Logistics Zones
                  </div>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocationFilter(loc);
                        setLocMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-800 transition ${
                        selectedLocationFilter === loc ? 'font-semibold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      {loc}
                      {selectedLocationFilter === loc && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span className="capitalize">{userRole}</span>
              </span>
            </div>

            <button type="button" onClick={() => { setAuthToken(null); window.location.reload(); }} className="text-xs font-semibold text-slate-600 hover:text-slate-900">Sign out</button>

            {/* Primary Action Button: Donate Food */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm shadow-emerald-600/30 hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Donate Food</span>
              <span className="sm:hidden">Donate</span>
            </button>

          </div>
        </div>

        {/* Mobile secondary link strip */}
        <div className="flex xl:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1 text-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeScreen === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveScreen(link.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3 h-3" />
                {link.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
