import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Flame, 
  Star, 
  Award, 
  RefreshCw, 
  User, 
  Phone, 
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { getPriestBookings, updateBookingStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PriestDashboard = () => {
  const { user, priestProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getPriestBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.warn('Error fetching priest bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setStatusUpdating(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      await fetchBookings();
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Priest Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 text-white shadow-xl shadow-amber-950/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center font-heading text-2xl font-bold shadow-inner">
            {(user?.name || 'A').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-100 border border-amber-300/40">
                Priest Management Portal (Acharya Ji)
              </span>
              <span className="text-xs bg-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-200 border border-emerald-300/30 font-semibold">
                ● Accepting Bookings
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide mt-1">
              Pranam, {user?.name || 'Acharya Ji'}
            </h2>
            <p className="text-amber-100 text-xs mt-0.5">
              {priestProfile?.vedicLineage || 'Shukla Yajurveda Tradition'} • {priestProfile?.city || user?.address?.city || 'Delhi NCR'}
            </p>
          </div>
        </div>

        <button
          onClick={fetchBookings}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Schedule
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Scheduled Pujas</p>
            <p className="text-2xl font-bold font-heading text-slate-900 mt-1">{bookings.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Upcoming Confirmed</p>
            <p className="text-2xl font-bold font-heading text-emerald-600 mt-1">
              {bookings.filter((b) => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Devotee Rating</p>
            <p className="text-2xl font-bold font-heading text-amber-900 mt-1 flex items-center gap-1">
              {priestProfile?.rating?.toFixed(1) || '4.9'} <Star className="w-4 h-4 fill-amber-500 text-amber-500 inline" />
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Base Dakshana</p>
            <p className="text-xl font-bold font-heading text-slate-900 mt-1">
              ₹{priestProfile?.baseDakshana?.toLocaleString('en-IN') || '2,100'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Bookings Queue */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600" />
          Devotee Puja Schedule & Requests
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
            <p>Loading your puja schedule...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-amber-300 space-y-2">
            <Flame className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-heading font-bold text-lg text-slate-900">No Pending Requests</h4>
            <p className="text-xs text-slate-500">Your schedule is open for upcoming auspicious dates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                      #{booking.bookingNumber}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      booking.status === 'confirmed' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-xl text-slate-900">
                      {booking.ritualName}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Devotee: <span className="font-bold text-slate-900">{booking.devoteeName}</span> (Gotra: <span className="font-bold text-amber-900">{booking.gotra}</span>) • Phone: <span className="font-mono text-slate-900">{booking.devoteePhone}</span>
                    </p>
                    {booking.familyMembers && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Family Members: {booking.familyMembers}
                      </p>
                    )}
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
                      <span>{booking.address?.fullAddress}, {booking.address?.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Samagri: {booking.samagriOption === 'by_pandit' ? 'Bring Complete Samagri Set' : 'Devotee Has Arranged'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Dakshana to Collect</span>
                    <span className="font-heading text-2xl font-bold text-amber-950">
                      ₹{booking.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Actions for Priest */}
                  <div className="flex items-center gap-2">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'completed')}
                        disabled={statusUpdating === booking._id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriestDashboard;
