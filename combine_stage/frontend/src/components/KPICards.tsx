import React from 'react';
import { 
  UtensilsCrossed, 
  PackageCheck, 
  Truck, 
  Building2, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Leaf 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KPICards: React.FC = () => {
  const { kpis, donations, requests } = useApp();

  const activeDonationsCount = donations.filter(d => d.status !== 'Delivered' && d.status !== 'Cancelled').length;
  const activeDeliveriesCount = kpis.activeDeliveries;
  const partnerNgosCount = kpis.partnerNgos;

  const cards = [
    {
      label: 'Meals Rescued',
      value: kpis.mealsRescued.toLocaleString(),
      subtext: '+1,820 this week',
      trend: '+14.2%',
      trendPositive: true,
      icon: UtensilsCrossed,
      iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      badge: 'Real-time Impact'
    },
    {
      label: 'Active Donations',
      value: activeDonationsCount.toString(),
      subtext: '8 urgent (< 2 hrs left)',
      trend: '+4 today',
      trendPositive: true,
      icon: PackageCheck,
      iconBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      badge: 'Hot Surplus'
    },
    {
      label: 'Active Deliveries',
      value: activeDeliveriesCount.toString(),
      subtext: 'Avg ETA: 14.8 mins',
      trend: '100% on route',
      trendPositive: true,
      icon: Truck,
      iconBg: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      badge: 'Live Routing'
    },
    {
      label: 'Partner NGOs',
      value: partnerNgosCount.toString(),
      subtext: 'Across 14 Jaipur zones',
      trend: '+3 joined',
      trendPositive: true,
      icon: Building2,
      iconBg: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      badge: 'Verified Shelters'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  {card.label}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {card.value}
                </div>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.iconBg} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium truncate">{card.subtext}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                <TrendingUp className="w-3 h-3" />
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
