import React, { useState } from 'react';
import { X, Star, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createReview } from '../services/api';

const ReviewModal = ({ booking, isOpen, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a short review or blessing for Pandit Ji.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createReview({
        priestId: booking.priest?._id || booking.priest,
        bookingId: booking._id,
        ritualName: booking.ritualName,
        rating,
        comment,
      });

      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <Sparkles className="w-8 h-8 text-amber-200 mx-auto mb-1 animate-pulse" />
          <h3 className="font-heading font-bold text-xl">Rate Your Sacred Ritual</h3>
          <p className="text-amber-100 text-xs mt-0.5">{booking.ritualName}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-center space-y-1">
            <label className="block text-xs font-bold text-slate-700">Blessings & Experience Rating</label>
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-800">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Divine & Soulful Experience' : `${rating} out of 5 Stars`}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Devotee Feedback & Words of Gratitude
            </label>
            <textarea
              rows="3"
              required
              placeholder="e.g. Acharya Ji conducted the puja with immense patience, pure Sanskrit chanting, and made the whole family feel blessed."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Submitting Review...' : 'Submit Blessed Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
