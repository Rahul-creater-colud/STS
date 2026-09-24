import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage, setToastMessage } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isWarning = toastMessage.type === 'warning';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
        isSuccess
          ? 'bg-slate-900/95 text-white border-emerald-500/40'
          : isWarning
          ? 'bg-slate-900/95 text-white border-amber-500/40'
          : 'bg-slate-900/95 text-white border-blue-500/40'
      }`}>
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isWarning ? (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          ) : (
            <Info className="w-5 h-5 text-blue-400" />
          )}
        </div>

        <div className="flex-1 text-xs">
          <h4 className="font-extrabold text-sm">{toastMessage.title}</h4>
          <p className="text-slate-300 mt-0.5 leading-snug">{toastMessage.desc}</p>
        </div>

        <button
          onClick={() => setToastMessage(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
