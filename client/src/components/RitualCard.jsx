import React from 'react';
import { 
  Sparkles, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  Home, 
  Shield, 
  Sun, 
  Heart 
} from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Flame: Flame,
  Home: Home,
  Shield: Shield,
  Sun: Sun,
  Heart: Heart,
  BookOpen: BookOpen,
};

const RitualCard = ({ ritual, onSelectRitual, onBookRitual }) => {
  const IconComponent = iconMap[ritual.iconName] || Flame;

  return (
    <div className="bg-white rounded-3xl border border-amber-200/80 hover:border-amber-400 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
            <IconComponent className="w-3.5 h-3.5 text-amber-600" />
            {ritual.category}
          </span>
          {ritual.isPopular && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              🔥 Most Booked
            </span>
          )}
        </div>

        {/* Title & Short Description */}
        <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors mb-2">
          {ritual.name}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {ritual.shortDescription}
        </p>

        {/* Duration & Samagri Preview */}
        <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {Math.floor(ritual.approxDurationMinutes / 60)}h {ritual.approxDurationMinutes % 60 > 0 ? `${ritual.approxDurationMinutes % 60}m` : ''}
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {ritual.samagriList?.length || 8} Items Samagri
          </div>
        </div>

        {/* Benefits list preview */}
        {ritual.benefits && ritual.benefits.length > 0 && (
          <div className="space-y-1.5 mb-5">
            {ritual.benefits.slice(0, 2).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="text-amber-500 font-bold">•</span>
                <span className="line-clamp-1">{benefit}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Dakshana & Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Suggested Dakshana</p>
          <p className="text-lg font-bold text-amber-950 font-heading">
            ₹{ritual.suggestedDakshana?.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectRitual(ritual)}
            className="px-3 py-2 text-xs rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 cursor-pointer transition-colors"
          >
            Vidhi & Samagri
          </button>
          <button
            onClick={() => onBookRitual(ritual)}
            className="px-3.5 py-2 text-xs rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1 transition-all"
          >
            Book <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RitualCard;
