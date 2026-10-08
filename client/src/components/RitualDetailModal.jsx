import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';

const RitualDetailModal = ({ ritual, isOpen, onClose, onBookNow }) => {
  const [activeTab, setActiveTab] = useState('samagri'); // 'samagri' | 'vidhi' | 'significance'

  if (!isOpen || !ritual) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-amber-400/30 text-amber-100 border border-amber-300/40">
              {ritual.category}
            </span>
            <span className="text-xs text-amber-200 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(ritual.approxDurationMinutes / 60)}h {ritual.approxDurationMinutes % 60 > 0 ? `${ritual.approxDurationMinutes % 60}m` : ''} duration
            </span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide">
            {ritual.name}
          </h2>
          <p className="text-amber-100 text-xs mt-1 leading-relaxed">
            {ritual.shortDescription}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('samagri')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'samagri'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-amber-600" />
            Samagri Checklist ({ritual.samagriList?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('vidhi')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'vidhi'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            Vedic Vidhi Steps
          </button>
          <button
            onClick={() => setActiveTab('significance')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'significance'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Significance & Benefits
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'samagri' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Pandit Ji can provide all holy samagri, or you may arrange items at home.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ritual.samagriList?.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${item.providedBy === 'pandit' ? 'text-amber-600' : 'text-emerald-600'}`} />
                      <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block font-medium">{item.quantity}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        item.providedBy === 'pandit' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.providedBy === 'pandit' ? 'By Pandit' : 'By Devotee'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vidhi' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Traditional step-by-step sequence performed according to Sanatana Vedic scripture:
              </p>
              <div className="space-y-2.5">
                {ritual.vidhiSteps?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{step}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Conducted with proper Vedic Sanskrit chanting, shankhanaad, and floral offerings.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'significance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="font-heading font-bold text-amber-950 text-sm mb-1">
                  Sacred Purpose & Lore
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {ritual.detailedSignificance}
                </p>
              </div>

              {ritual.benefits && (
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-sm mb-2">
                    Blessings & Astrological Merits
                  </h4>
                  <div className="space-y-2">
                    {ritual.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer / Booking Call to Action */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Suggested Dakshana</span>
            <span className="font-heading text-xl font-bold text-amber-950">
              ₹{ritual.suggestedDakshana?.toLocaleString('en-IN')}
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
                onBookNow(ritual);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-2 transition-all"
            >
              Proceed to Book <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RitualDetailModal;
