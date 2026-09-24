import React from 'react';
import { 
  UtensilsCrossed, 
  Truck, 
  Building2, 
  Bell, 
  Users, 
  Plus, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface EmptyStateProps {
  type: 'donations' | 'deliveries' | 'requests' | 'notifications' | 'volunteers';
  onAction?: () => void;
  customMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction, customMessage }) => {
  const configs = {
    donations: {
      icon: UtensilsCrossed,
      title: 'No Surplus Food Batches Logged',
      desc: 'All commercial surplus food has been successfully matched or delivered. Post a new surplus batch to begin routing.',
      cta: '+ Post Surplus Food',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    deliveries: {
      icon: Truck,
      title: 'No Active Deliveries on Route',
      desc: 'No volunteer vehicles are currently in transit. Check the Smart Match queue to dispatch pending matches.',
      cta: 'Open Smart Match',
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    requests: {
      icon: Building2,
      title: 'No Shelter Demands Registered',
      desc: 'All partner shelter nightly quotas are fully fulfilled. Create a new demand request if an influx of beneficiaries arrives.',
      cta: '+ Create Food Request',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    notifications: {
      icon: Bell,
      title: 'Notification Center Cleared',
      desc: 'You are completely caught up with all logistics alerts, dispatch verifications, and route updates.',
      cta: 'Refresh Stream',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    volunteers: {
      icon: Users,
      title: 'No Available Volunteers Nearby',
      desc: 'All volunteer drivers in this zone are currently on active rescue routes. System can broadcast dispatch to reserve fleet.',
      cta: 'Broadcast Driver Alert',
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
      <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${config.color}`}>
        <Icon className="w-7 h-7 stroke-[2]" />
      </div>

      <div>
        <h3 className="text-base font-extrabold text-slate-900">
          {config.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {customMessage || config.desc}
        </p>
      </div>

      {onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition hover:scale-105 cursor-pointer"
          >
            <span>{config.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
