import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Calendar, 
  Languages, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Clock
} from 'lucide-react';
import { getPriestReviews } from '../services/api';

const PriestDetailModal = ({ priest, isOpen, onClose, onBookNow }) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rituals' | 'reviews'

  const priestName = priest?.user?.name || `${priest?.title || 'Acharya'} Ji`;

  useEffect(() => {
    if (isOpen && priest?._id) {
      const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
          const res = await getPriestReviews(priest._id);
          setReviews(res.data || []);
        } catch (err) {
          console.warn('Error fetching reviews:', err.message);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [isOpen, priest]);

  if (!isOpen || !priest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center font-heading text-2xl font-bold shadow-inner shrink-0">
              {priestName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-2xl font-bold tracking-wide">
                  {priestName}
                </h2>
                {priest.isVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-300/30 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Shastra Verified
                  </span>
                )}
              </div>
              <p className="text-amber-100 text-xs mt-0.5">
                {priest.title || 'Acharya'} • {priest.experienceYears}+ Years Experience • {priest.city}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg text-white font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {priest.rating?.toFixed(1) || '4.9'} ({priest.reviewCount || 12} Devotee Reviews)
                </span>
                <span className="text-amber-200">
                  Base Dakshana: ₹{priest.baseDakshana?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            Lineage & Credentials
          </button>
          <button
            onClick={() => setActiveTab('rituals')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'rituals'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-600" />
            Rituals & Pricing ({priest.ritualsOffered?.length || priest.specializations?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            Devotee Reviews ({reviews.length || priest.reviewCount || 0})
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="font-heading font-bold text-amber-950 text-sm mb-1">
                  About Acharya Ji
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {priest.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    Vedic Tradition & Lineage
                  </div>
                  <p className="text-xs text-slate-600">{priest.vedicLineage}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Award className="w-4 h-4 text-amber-600" />
                    Vedic Education
                  </div>
                  <p className="text-xs text-slate-600">{priest.education || 'Acharya in Sanskrit Karmakanda'}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Languages className="w-4 h-4 text-amber-600" />
                    Languages for Shloka Explanation
                  </div>
                  <p className="text-xs text-slate-600">{priest.languages?.join(', ')}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    Location & Service Radius
                  </div>
                  <p className="text-xs text-slate-600">{priest.city} (within {priest.serviceRadiusKm || 25} km)</p>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-slate-900 text-sm mb-2">
                  Auspicious Daily Slots
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {priest.availableSlots?.map((slot, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rituals' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Transparent Dakshana and duration for rituals offered by Acharya Ji:
              </p>
              <div className="space-y-2.5">
                {(priest.ritualsOffered && priest.ritualsOffered.length > 0 
                  ? priest.ritualsOffered 
                  : priest.specializations?.map(s => ({ ritualName: s, dakshana: priest.baseDakshana, durationMinutes: 120 }))
                )?.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-colors"
                  >
                    <div>
                      <h5 className="font-heading font-bold text-slate-900 text-sm">{item.ritualName}</h5>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Approx {Math.floor((item.durationMinutes || 120) / 60)}h {(item.durationMinutes || 120) % 60 > 0 ? `${(item.durationMinutes || 120) % 60}m` : ''} • Pure Samagri Included
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-heading font-bold text-base text-amber-950 block">
                        ₹{(item.dakshana || priest.baseDakshana)?.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onBookNow(priest, item);
                        }}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                      >
                        Book this ritual
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {loadingReviews ? (
                <p className="text-xs text-slate-500 py-6 text-center">Loading verified devotee reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <Star className="w-8 h-8 text-amber-400 mx-auto mb-2 stroke-1" />
                  <p className="font-medium">Recent reviews are being synced from completed rituals.</p>
                </div>
              ) : (
                reviews.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.devoteeName}</span>
                        {rev.isVerified && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            Verified Devotee
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-amber-800 font-semibold">{rev.ritualName}</p>
                    <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Starting Dakshana</span>
            <span className="font-heading text-xl font-bold text-amber-950">
              ₹{priest.baseDakshana?.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(priest);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-2 transition-all"
            >
              Book Acharya Ji <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriestDetailModal;
