import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  Flame, 
  RefreshCw, 
  User, 
  Phone,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { getMyBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewModal from './ReviewModal';

const DevoteeDashboard = ({ onOpenBooking, onExplorePujas }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.warn('Error fetching bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Sparkles className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Devotee Greeting Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 text-white shadow-xl shadow-amber-950/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center font-heading text-2xl font-bold shadow-inner">
            {user?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-100 border border-amber-300/40">
              Devotee Sanctuary (Yajman Portal)
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide mt-1">
              Namaste, {user?.name || 'Devotee'}
            </h2>
            <p className="text-amber-100 text-xs mt-0.5">
              Gotra: <span className="font-bold text-white">{user?.gotra || 'Kashyap'}</span> • Location: {user?.address?.city || 'Delhi NCR'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Refresh Bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onExplorePujas}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-lg shadow-amber-500/30 cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Book New Ritual
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Bookings</p>
            <p className="text-2xl font-bold font-heading text-slate-900 mt-1">{bookings.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Upcoming Auspicious Rituals</p>
            <p className="text-2xl font-bold font-heading text-emerald-600 mt-1">
              {bookings.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Vedic Sankalpa Gotra</p>
            <p className="text-xl font-bold font-heading text-amber-900 mt-1">{user?.gotra || 'Kashyap'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Your Scheduled Pujas & Rituals
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
            <p>Loading your sacred bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-amber-300 space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Flame className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-lg text-slate-900">No Pujas Scheduled Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Connect with verified Acharyas for Griha Pravesh, Satyanarayan Katha, or Rudrabhishek at your doorstep.
            </p>
            <button
              onClick={onExplorePujas}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer inline-flex items-center gap-1.5"
            >
              Explore Ritual Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                      #{booking.bookingNumber}
                    </span>
                    {getStatusBadge(booking.status)}
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-amber-900">
                      Gotra: {booking.gotra}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-xl text-slate-900">
                      {booking.ritualName}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Presiding Priest: <span className="font-bold text-slate-900">{booking.priest?.user?.name || 'Acharya Ji'}</span> ({booking.priest?.city || 'Delhi NCR'})
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{new Date(booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{booking.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{booking.address?.fullAddress}, {booking.address?.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PackageCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{booking.samagriOption === 'by_pandit' ? 'Samagri Included by Pandit Ji' : 'Devotee Prepares Samagri'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Dakshana</span>
                    <span className="font-heading text-2xl font-bold text-amber-950">
                      ₹{booking.totalAmount?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      Pay on Ritual Completion
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {booking.status === 'completed' && (
                      <button
                        onClick={() => setSelectedBookingForReview(booking)}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-600" /> Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onReviewSubmitted={() => {
            fetchBookings();
            setSelectedBookingForReview(null);
          }}
        />
      )}
    </div>
  );
};

export default DevoteeDashboard;
