import React from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Building2, 
  Navigation, 
  Users, 
  Compass, 
  BarChart3, 
  Bell, 
  Settings, 
  Route, 
  HeartHandshake, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveScreen } from '../types';

export type DashboardSubTab = 
  | 'overview' 
  | 'live-rescues' 
  | 'volunteers' 
  | 'ngos' 
  | 'routes' 
  | 'settings';

interface SidebarProps {
  currentTab: DashboardSubTab;
  onSelectTab: (tab: DashboardSubTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenNotifications: () => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  onOpenNotifications,
  onOpenAddModal
}) => {
  const { 
    activeScreen, 
    setActiveScreen, 
    donations, 
    requests, 
    kpis, 
    notifications 
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingDonations = donations.filter(d => d.status === 'Pending Match' || d.status === 'Matched').length;
  const activeDeliveries = kpis.activeDeliveries;

  const mainNavItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      screen: 'dashboard' as ActiveScreen,
      tab: 'overview' as DashboardSubTab
    },
    {
      id: 'donations',
      label: 'Donations',
      icon: Utensils,
      screen: 'donations' as ActiveScreen,
      badge: pendingDonations > 0 ? pendingDonations : undefined
    },
    {
      id: 'requests',
      label: 'Food Requests',
      icon: Building2,
      screen: 'requests' as ActiveScreen,
      badge: requests.length
    },
    {
      id: 'live-rescues',
      label: 'Live Rescues',
      icon: Navigation,
      screen: 'live-tracking' as ActiveScreen,
      badge: activeDeliveries > 0 ? activeDeliveries : undefined,
      badgeColor: 'bg-orange-500 text-white'
    },
    {
      id: 'volunteers',
      label: 'Volunteers',
      icon: Users,
      screen: 'dashboard' as ActiveScreen,
      tab: 'volunteers' as DashboardSubTab
    },
    {
      id: 'ngos',
      label: 'NGOs',
      icon: HeartHandshake,
      screen: 'dashboard' as ActiveScreen,
      tab: 'ngos' as DashboardSubTab
    },
    {
      id: 'routes',
      label: 'Routes',
      icon: Route,
      screen: 'dashboard' as ActiveScreen,
      tab: 'routes' as DashboardSubTab
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      screen: 'analytics' as ActiveScreen
    }
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200/90 transition-all duration-300 flex flex-col justify-between z-20 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Brand & Menu Header */}
      <div>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm shadow-emerald-600/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  Rescue Command
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Jaipur City Grid
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer mx-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-2 space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            
            const isTabActive = activeScreen === item.screen && (
              item.tab ? currentTab === item.tab : true
            );

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.screen !== activeScreen) {
                    setActiveScreen(item.screen);
                  }
                  if (item.tab) {
                    onSelectTab(item.tab);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isTabActive
                    ? 'bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isTabActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                }`} />

                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.badgeColor || 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Notifications & Settings */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        
        {/* Quick Add Surplus CTA when expanded */}
        {!collapsed && (
          <button
            onClick={onOpenAddModal}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 transition mb-3 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Log Surplus Food</span>
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
          title={collapsed ? 'Notifications' : undefined}
        >
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-400" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-orange-600 absolute -top-0.5 -right-0.5" />
            )}
          </div>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            setActiveScreen('dashboard');
            onSelectTab('settings');
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeScreen === 'dashboard' && currentTab === 'settings'
              ? 'bg-slate-100 text-slate-900 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          {!collapsed && <span className="flex-1 text-left">Settings</span>}
        </button>

        {/* Operational Status Pill */}
        {!collapsed && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Jaipur Grid Active</span>
            </span>
            <span className="font-mono text-[10px]">v2.4</span>
          </div>
        )}

      </div>
    </aside>
  );
};
