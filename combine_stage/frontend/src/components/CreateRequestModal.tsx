import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Users, 
  Utensils 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DietaryType, UrgencyLevel } from '../types';

const toDateTimeInput = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose }) => {
  const { addRequest } = useApp();

  const [shelterName, setShelterName] = useState('Rain Basera Night Shelter #12');
  const [shelterCode, setShelterCode] = useState('SH-JAIPUR-030');
  const [contactPerson, setContactPerson] = useState('Govind Ram Meena');
  const [phone, setPhone] = useState('+91 94145 99201');
  const [area, setArea] = useState('Sindhi Camp / Railway Station');
  const [address, setAddress] = useState('Opposite Central Bus Station, Platform 3');
  const [requiredMeals, setRequiredMeals] = useState<number>(75);
  const [beneficiaryCount, setBeneficiaryCount] = useState<number>(85);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryType>('Vegetarian');
  const [urgency, setUrgency] = useState<UrgencyLevel>('High');
  const [deadlineTime, setDeadlineTime] = useState(() => toDateTimeInput(new Date(Date.now() + 90 * 60_000)));
  const [notes, setNotes] = useState('Dinner requirement for destitute seniors and travelers.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      shelterName,
      shelterCode,
      contactPerson,
      phone,
      location: {
        lat: 26.9230 + (Math.random() - 0.5) * 0.03,
        lng: 75.7970 + (Math.random() - 0.5) * 0.03,
        address,
        area
      },
      requiredMeals: Number(requiredMeals),
      dietaryPreference,
      urgency,
      deadlineTime: new Date(deadlineTime).toISOString(),
      notes,
      beneficiaryCount: Number(beneficiaryCount)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Create Food Demand Request</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Broadcast tonight's meal requirement to matching food surplus donors.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Shelter / Organization Name *
            </label>
            <input
              type="text"
              required
              value={shelterName}
              onChange={(e) => setShelterName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Required Meals *
              </label>
              <input
                type="number"
                required
                min={5}
                value={requiredMeals}
                onChange={(e) => setRequiredMeals(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Beneficiaries Count
              </label>
              <input
                type="number"
                value={beneficiaryCount}
                onChange={(e) => setBeneficiaryCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Food Urgency *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Critical">🚨 Critical (&lt; 1 hour)</option>
                <option value="High">⚠️ High Urgency</option>
                <option value="Medium">Medium Standard</option>
                <option value="Low">Low / Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Required by Deadline *
              </label>
              <input
                type="datetime-local"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                placeholder="e.g. 9:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Jaipur Logistics Area *
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Sindhi Camp / Railway Station">Sindhi Camp / Railway Station</option>
              <option value="Pink City / Sanganer Gate">Pink City / Sanganer Gate</option>
              <option value="Malviya Nagar">Malviya Nagar</option>
              <option value="C-Scheme">C-Scheme</option>
              <option value="Raja Park">Raja Park</option>
              <option value="Mansarovar">Mansarovar</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              Create Food Request
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
