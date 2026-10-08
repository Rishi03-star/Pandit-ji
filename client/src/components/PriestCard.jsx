import React from 'react';
import { 
  Award, 
  Star, 
  MapPin, 
  CheckCircle2, 
  Languages, 
  BookOpen, 
  Calendar, 
  ArrowRight,
  Flame,
  ShieldCheck
} from 'lucide-react';

const PriestCard = ({ priest, onSelectPriest, onBookPriest }) => {
  const priestName = priest.user?.name || `${priest.title || 'Acharya'} Ji`;

  return (
    <div className="bg-white rounded-3xl border border-amber-200/80 hover:border-amber-400 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header with Avatar & Rating */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white flex items-center justify-center font-heading text-xl font-bold shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
              {priestName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  {priestName}
                </h3>
                {priest.isVerified && (
                  <span title="Vedic Shastra Verified Priest">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-800 font-semibold">
                {priest.title || 'Acharya'} • {priest.experienceYears}+ Years Experience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{priest.rating?.toFixed(1) || '4.9'}</span>
            <span className="text-[10px] text-slate-400 font-normal">({priest.reviewCount || 12})</span>
          </div>
        </div>

        {/* Vedic Lineage & City */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate font-medium">{priest.vedicLineage || 'Shukla Yajurveda Tradition'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{priest.city} (Servicing up to {priest.serviceRadiusKm || 25} km)</span>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {priest.bio}
        </p>

        {/* Specializations & Languages Tags */}
        <div className="space-y-2 mb-5">
          <div className="flex flex-wrap gap-1.5">
            {priest.specializations?.slice(0, 3).map((spec, idx) => (
              <span 
                key={idx} 
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700"
              >
                {spec}
              </span>
            ))}
            {priest.specializations?.length > 3 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">
                +{priest.specializations.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{priest.languages?.join(', ') || 'Hindi, Sanskrit'}</span>
          </div>
        </div>
      </div>

      {/* Footer / Dakshana & Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Base Dakshana</p>
          <p className="text-lg font-bold text-amber-950 font-heading">
            ₹{priest.baseDakshana?.toLocaleString('en-IN') || '2,100'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectPriest(priest)}
            className="px-3 py-2 text-xs rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 cursor-pointer transition-colors"
          >
            Profile & Reviews
          </button>
          <button
            onClick={() => onBookPriest(priest)}
            className="px-3.5 py-2 text-xs rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1 transition-all"
          >
            Book Pandit Ji <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriestCard;
