import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  PackageCheck, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Share2
} from 'lucide-react';
import { createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  preSelectedRitual, 
  preSelectedPriest, 
  rituals = [], 
  priests = [],
  onBookingSuccess,
  onOpenAuth
}) => {
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedRitualId, setSelectedRitualId] = useState('');
  const [selectedPriestId, setSelectedPriestId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 12:00 PM (Shubh Abhijit)');
  const [samagriOption, setSamagriOption] = useState('by_pandit');
  
  // Devotee details
  const [devoteeName, setDevoteeName] = useState('');
  const [devoteePhone, setDevoteePhone] = useState('');
  const [gotra, setGotra] = useState('Kashyap');
  const [familyMembers, setFamilyMembers] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [landmark, setLandmark] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      if (preSelectedRitual) {
        setSelectedRitualId(preSelectedRitual._id || preSelectedRitual.id);
      } else if (rituals.length > 0 && !selectedRitualId) {
        setSelectedRitualId(rituals[0]._id);
      }

      if (preSelectedPriest) {
        setSelectedPriestId(preSelectedPriest._id || preSelectedPriest.id);
      } else if (priests.length > 0 && !selectedPriestId) {
        setSelectedPriestId(priests[0]._id);
      }

      if (user) {
        setDevoteeName(user.name || '');
        setDevoteePhone(user.phone || '');
        setGotra(user.gotra || 'Kashyap');
        setCity(user.address?.city || 'Delhi NCR');
        setFullAddress(user.address?.fullAddress || '');
      }

      if (!bookingDate) {
        setBookingDate(minDateString);
      }
    }
  }, [isOpen, preSelectedRitual, preSelectedPriest, rituals, priests, user]);

  if (!isOpen) return null;

  const currentRitual = rituals.find((r) => r._id === selectedRitualId) || preSelectedRitual || rituals[0];
  const currentPriest = priests.find((p) => p._id === selectedPriestId) || preSelectedPriest || priests[0];

  // Calculate Dakshana
  const customOffering = currentPriest?.ritualsOffered?.find(
    (r) => r.ritualName?.toLowerCase() === currentRitual?.name?.toLowerCase()
  );
  const baseDakshana = customOffering?.dakshana || currentRitual?.suggestedDakshana || currentPriest?.baseDakshana || 2100;
  const samagriCost = samagriOption === 'by_pandit' ? 1100 : 0;
  const totalAmount = baseDakshana + samagriCost;

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    if (!fullAddress.trim()) {
      setError('Please provide the full puja venue/home address.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        priestId: currentPriest._id,
        ritualId: currentRitual._id,
        bookingDate,
        timeSlot,
        devoteeName: devoteeName || user.name,
        devoteePhone: devoteePhone || user.phone,
        gotra,
        familyMembers,
        fullAddress,
        city: city || 'Delhi NCR',
        landmark,
        samagriOption,
        specialInstructions,
      };

      const res = await createBooking(payload);
      setConfirmedBooking(res.data);
      setStep(5); // Success step
      if (onBookingSuccess) onBookingSuccess(res.data);
    } catch (err) {
      setError(err.message || 'Failed to complete booking. Please try another slot.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 p-6 text-white relative shrink-0">
          <button 
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-xl tracking-wide">
                Auspicious Puja Booking Engine
              </h3>
              <p className="text-amber-100 text-xs">
                {step < 5 ? `Step ${step} of 4: Double-Booking Protected Vedic Reservation` : 'Sacred Booking Confirmed'}
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          {step < 5 && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20 text-xs">
              {['Ritual & Pandit', 'Muhurat & Time', 'Devotee Details', 'Dakshana Summary'].map((sName, i) => (
                <div key={i} className="flex-1 flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step === i + 1 
                      ? 'bg-white text-amber-900 shadow-sm' 
                      : step > i + 1 
                        ? 'bg-amber-400 text-amber-950' 
                        : 'bg-white/20 text-white'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </span>
                  <span className={`hidden sm:inline text-[11px] font-medium ${step === i + 1 ? 'text-white font-bold' : 'text-amber-200/70'}`}>
                    {sName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Booking Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* STEP 1: Select Ritual & Priest */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  1. Select Sacred Puja / Ritual
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {rituals.map((r) => (
                    <button
                      key={r._id}
                      type="button"
                      onClick={() => setSelectedRitualId(r._id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedRitualId === r._id
                          ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{r.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{r.shortDescription}</p>
                      </div>
                      <p className="text-xs font-bold text-amber-800 mt-2 font-heading">
                        Suggested: ₹{r.suggestedDakshana?.toLocaleString('en-IN')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  2. Choose Verified Acharya / Pandit Ji
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {priests.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => setSelectedPriestId(p._id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        selectedPriestId === p._id
                          ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/30'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                          {(p.user?.name || 'A').charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{p.user?.name || `${p.title} Ji`}</p>
                          <p className="text-[10px] text-amber-800 font-semibold">{p.title} • {p.city}</p>
                          <p className="text-[10px] text-slate-500">{p.experienceYears}+ Yrs Exp ★ {p.rating}</p>
                        </div>
                      </div>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${selectedPriestId === p._id ? 'text-orange-600' : 'text-transparent'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Muhurat, Date & Time Slots */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Double-Booking Lock actively verifies real-time slot availability for {currentPriest?.user?.name || 'Acharya Ji'}.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Select Auspicious Ritual Date
                </label>
                <input
                  type="date"
                  min={minDateString}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Choose Auspicious Time Slot (Shubh Muhurat)
                </label>
                <div className="space-y-2">
                  {[
                    '06:00 AM - 09:00 AM (Brahma Muhurta)',
                    '09:00 AM - 12:00 PM (Shubh Abhijit)',
                    '03:00 PM - 06:00 PM (Aparahna)',
                    '06:00 PM - 09:00 PM (Sandhya Vela)',
                  ].map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        timeSlot === slot
                          ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{slot}</span>
                      </div>
                      <CheckCircle2 className={`w-4 h-4 ${timeSlot === slot ? 'text-amber-600' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Devotee & Gotra Details */}
          {step === 3 && (
            <div className="space-y-3.5">
              {!isAuthenticated && (
                <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs text-orange-950">
                  <span>Please sign in or register to complete your reservation.</span>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-3 py-1 bg-orange-600 text-white font-bold rounded-lg cursor-pointer hover:bg-orange-700"
                  >
                    Login / Register
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Devotee Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={devoteePhone}
                    onChange={(e) => setDevoteePhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gotra (for Vedic Sankalpa)</label>
                  <input
                    type="text"
                    placeholder="e.g. Kashyap, Bharadwaja, Vashishta"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Family Members in Puja</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul, Priya, Ananya"
                    value={familyMembers}
                    onChange={(e) => setFamilyMembers(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Puja Venue Address</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Flat No, Building Name, Society, Street, Area..."
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    placeholder="Near Fortis Hospital, etc."
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Samagri Option & Transparent Dakshana Summary */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Holy Samagri Arrangement Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSamagriOption('by_pandit')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      samagriOption === 'by_pandit'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Pandit Ji Brings All Samagri</span>
                      <span className="text-xs font-bold text-amber-800">+₹1,100</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Acharya Ji brings pure cow ghee, copper havan kund, Janeu, Chandan, Supari, and sacred dravyas.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSamagriOption('by_devotee')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      samagriOption === 'by_devotee'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">I Will Arrange Samagri</span>
                      <span className="text-xs font-bold text-emerald-700">₹0 Extra</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      You will prepare items from our detailed checklist before Pandit Ji arrives.
                    </p>
                  </button>
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="font-heading font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  Reservation Breakdown
                </h4>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Ritual:</span>
                  <span className="font-bold text-slate-900">{currentRitual?.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Presiding Acharya:</span>
                  <span className="font-bold text-slate-900">{currentPriest?.user?.name || `${currentPriest?.title} Ji`}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Date & Slot:</span>
                  <span className="font-bold text-slate-900">{bookingDate} ({timeSlot.split(' ')[0]} {timeSlot.split(' ')[1]})</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Base Priest Dakshana:</span>
                  <span className="font-bold text-slate-900">₹{baseDakshana.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Samagri Package:</span>
                  <span className="font-bold text-slate-900">₹{samagriCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="font-heading font-bold text-sm text-amber-950">Total Dakshana:</span>
                  <span className="font-heading font-extrabold text-xl text-amber-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 italic text-right">
                  * Payable in cash/UPI directly upon ritual completion. No advance required.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Success & Confirmation */}
          {step === 5 && confirmedBooking && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Booking Reference: {confirmedBooking.bookingNumber}
                </span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-2">
                  Jai Shri Krishna! Ritual Confirmed
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {currentPriest?.user?.name || 'Acharya Ji'} has accepted your booking for <span className="font-bold text-slate-900">{confirmedBooking.ritualName}</span> on <span className="font-bold text-slate-900">{new Date(confirmedBooking.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>.
                </p>
              </div>

              {/* WhatsApp Notification Mockup Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-left text-xs max-w-md mx-auto space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant SMS & WhatsApp Notification Sent</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Devotee {confirmedBooking.devoteeName} ({confirmedBooking.gotra} Gotra), Pandit Ji will arrive 15 minutes prior to {confirmedBooking.timeSlot} at your venue.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          {step < 5 ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 3 && !fullAddress.trim()) {
                      setError('Please enter your full address before continuing.');
                      return;
                    }
                    setError(null);
                    setStep(step + 1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateBooking}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? 'Confirming with Acharya Ji...' : 'Confirm Puja Booking'}
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={resetAndClose}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              Done & View My Bookings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
