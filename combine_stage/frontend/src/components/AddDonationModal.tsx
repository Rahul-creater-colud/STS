import React, { useState } from 'react';
import { 
  X, 
  Utensils, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Building,
  Phone,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodCategory, DietaryType } from '../types';

const toDateTimeInput = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

interface AddDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDonationModal: React.FC<AddDonationModalProps> = ({ isOpen, onClose }) => {
  const { addDonation, setActiveScreen } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form state
  const [foodName, setFoodName] = useState('Fresh Rice, Dal Makhani & Mixed Veg');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [dietary, setDietary] = useState<DietaryType>('Vegetarian');
  const [quantityMeals, setQuantityMeals] = useState<number>(85);
  const [weightKg, setWeightKg] = useState<number>(38);
  const [storageTemp, setStorageTemp] = useState<'Hot (>60°C)' | 'Room Temp (20-25°C)' | 'Chilled (<5°C)'>('Hot (>60°C)');
  const [packaging, setPackaging] = useState('Sealed stainless containers & thermo-bins');

  // Step 2: Availability
  const [preparedTime, setPreparedTime] = useState(() => toDateTimeInput(new Date(Date.now() - 15 * 60_000)));
  const [pickupWindowStart, setPickupWindowStart] = useState(() => toDateTimeInput(new Date()));
  const [pickupDeadline, setPickupDeadline] = useState(() => toDateTimeInput(new Date(Date.now() + 3 * 60 * 60_000)));
  const [notes, setNotes] = useState('Fresh banquet surplus. Kept in thermal warming tray.');

  // Step 3: Location
  const [donorName, setDonorName] = useState('Hotel Clarks Amer');
  const [donorType, setDonorType] = useState<'Hotel' | 'Restaurant' | 'Hostel' | 'Event Banquet' | 'Corporate Cafeteria'>('Hotel');
  const [address, setAddress] = useState('JLN Marg, Near Jawahar Circle');
  const [area, setArea] = useState('C-Scheme / Malviya Nagar Corridor');
  const [landmark, setLandmark] = useState('Service Gate #2, Banquet Kitchen');
  const [contactPerson, setContactPerson] = useState('Vikram Saini (Head Chef)');
  const [phone, setPhone] = useState('+91 98290 44510');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDonation({
      donorName,
      donorType,
      donorContact: phone,
      foodName,
      category,
      dietary,
      quantityMeals: Number(quantityMeals),
      weightKg: Number(weightKg),
      preparedTime: new Date(preparedTime).toISOString(),
      pickupWindowStart: new Date(pickupWindowStart).toISOString(),
      pickupDeadline: new Date(pickupDeadline).toISOString(),
      location: {
        lat: 26.8580 + (Math.random() - 0.5) * 0.04,
        lng: 75.8050 + (Math.random() - 0.5) * 0.04,
        address,
        area,
        landmark
      },
      packaging,
      storageTemp,
      notes
    });

    onClose();
    setActiveScreen('donations');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Post Surplus Food Batch</span>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Step {step} of 4
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect edible surplus food directly with nearby shelters before expiration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4 pb-2 bg-white">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-emerald-700 font-bold' : ''}>1. Food Details</span>
            <span className={step >= 2 ? 'text-emerald-700 font-bold' : ''}>2. Availability</span>
            <span className={step >= 3 ? 'text-emerald-700 font-bold' : ''}>3. Location</span>
            <span className={step >= 4 ? 'text-emerald-700 font-bold' : ''}>4. Review</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* STEP 1: Food Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Food Item / Description *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Vegetable Biryani, Paneer Butter Masala, Roti"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Food Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Cooked Meals">Cooked Meals (Warm / Ready to Eat)</option>
                    <option value="Bakery & Bread">Bakery & Bread</option>
                    <option value="Fresh Produce">Fresh Fruits & Vegetables</option>
                    <option value="Packaged & Dry">Packaged & Dry Groceries</option>
                    <option value="Dairy & Beverages">Dairy & Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dietary Classification *
                  </label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value as DietaryType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Vegetarian">Pure Vegetarian (100% Veg)</option>
                    <option value="Jain">Jain (No Root Veg / Onion / Garlic)</option>
                    <option value="Vegan">Vegan (100% Plant Based)</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Meal Portions *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={10}
                      max={1000}
                      value={quantityMeals}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setQuantityMeals(val);
                        setWeightKg(Math.round(val * 0.45));
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      meals
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Approx Weight (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Storage & Holding Temperature *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hot (>60°C)', 'Room Temp (20-25°C)', 'Chilled (<5°C)'] as const).map((temp) => (
                    <button
                      type="button"
                      key={temp}
                      onClick={() => setStorageTemp(temp)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                        storageTemp === temp
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Availability */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="font-bold">Critical Time Window:</strong>
                  <p className="mt-0.5 text-amber-800">
                    Cooked surplus food must be distributed within 3 hours of preparation to maintain safe microbiological standards.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Prepared Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={preparedTime}
                    onChange={(e) => setPreparedTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pickup Start *
                  </label>
                  <input
                    type="datetime-local"
                    value={pickupWindowStart}
                    onChange={(e) => setPickupWindowStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pickup Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    value={pickupDeadline}
                    onChange={(e) => setPickupDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Packaging Type & Transport Requirements
                </label>
                <input
                  type="text"
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                  placeholder="e.g. Foil containers in insulated boxes"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Special Notes for Volunteer
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any access gate details, dock number, or food handling advice..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Donor Organization Name *
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Organization Type *
                  </label>
                  <select
                    value={donorType}
                    onChange={(e) => setDonorType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Hotel">Hotel & Resort</option>
                    <option value="Restaurant">Restaurant & Cafe</option>
                    <option value="Event Banquet">Event / Marriage Banquet</option>
                    <option value="Hostel">University / College Hostel Mess</option>
                    <option value="Corporate Cafeteria">Corporate Cafeteria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jaipur Logistics Zone *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="C-Scheme">C-Scheme / Central Jaipur</option>
                  <option value="Malviya Nagar">Malviya Nagar (WTP Corridor)</option>
                  <option value="Tonk Road">Tonk Road / JLN Marg</option>
                  <option value="Raja Park">Raja Park / Tilak Nagar</option>
                  <option value="Vaishali Nagar">Vaishali Nagar / Sirsi Rd</option>
                  <option value="Mansarovar">Mansarovar / New Sanganer Rd</option>
                  <option value="Pink City">Pink City (Walled City / Sanganer Gate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Street Address & Landmark *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, building name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Smart Matching Ready</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Our routing engine has already detected <strong>3 shelters</strong> within 4.5 km of {area} ready to accept this donation immediately.
                </p>
              </div>

              {/* Donation Summary Card */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{foodName}</h4>
                    <p className="text-slate-500 font-medium">{donorName} ({donorType})</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                    {quantityMeals} Meals
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-600">
                  <div><strong>Category:</strong> {category}</div>
                  <div><strong>Dietary:</strong> {dietary}</div>
                  <div><strong>Storage:</strong> {storageTemp}</div>
                  <div><strong>Approx Weight:</strong> {weightKg} kg</div>
                  <div><strong>Pickup Starts:</strong> {pickupWindowStart}</div>
                  <div className="text-rose-600 font-bold"><strong>Deadline:</strong> {pickupDeadline}</div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <div><strong>Pickup Location:</strong> {address}, {area}</div>
                  <div><strong>Contact:</strong> {contactPerson} ({phone})</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>By posting, you certify this surplus food has been prepared hygienically in accordance with FSSAI regulations.</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/30 transition-transform hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Post Food Donation</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
