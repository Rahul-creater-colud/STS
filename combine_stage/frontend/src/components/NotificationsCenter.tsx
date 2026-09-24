import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Truck, 
  Cpu, 
  Check, 
  Volume2, 
  VolumeX,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationsCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setActiveScreen 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'matches' | 'deliveries' | 'urgent'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (activeCategory === 'matches') return n.type === 'match' || n.type === 'dispatch';
    if (activeCategory === 'deliveries') return n.type === 'pickup' || n.type === 'delivery';
    if (activeCategory === 'urgent') return n.type === 'urgent';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'match':
      case 'dispatch':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'pickup':
      case 'delivery':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleClickItem = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.type === 'match') setActiveScreen('smart-match');
    else if (notif.type === 'pickup' || notif.type === 'delivery') setActiveScreen('live-tracking');
    else if (notif.type === 'urgent') setActiveScreen('donations');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">
                Notification Center
              </h2>
              <p className="text-[11px] text-slate-500">
                Real-time dispatch alerts & telemetry updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              title={soundEnabled ? 'Mute alert chimes' : 'Enable alert chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter categories */}
        <div className="p-3 border-b border-slate-100 bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeCategory === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveCategory('matches')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeCategory === 'matches' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Matches
            </button>
            <button
              onClick={() => setActiveCategory('deliveries')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeCategory === 'deliveries' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Deliveries
            </button>
            <button
              onClick={() => setActiveCategory('urgent')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                activeCategory === 'urgent' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Urgent
            </button>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
          >
            Mark all read
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">All caught up!</p>
              <p className="text-[11px]">No pending notifications in this category.</p>
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClickItem(item)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                  !item.read ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
                    {item.message}
                  </p>
                </div>

                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-[11px] text-slate-500">
          Connected to Jaipur municipal real-time dispatch websocket.
        </div>

      </div>
    </div>
  );
};
