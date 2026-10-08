import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  Award,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, defaultRole = 'devotee' }) => {
  const { login, register, quickDevoteeLogin, quickPriestLogin } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState(defaultRole); // 'devotee' | 'priest'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [gotra, setGotra] = useState('Kashyap');
  // Priest specific states
  const [title, setTitle] = useState('Acharya');
  const [experienceYears, setExperienceYears] = useState(10);
  const [vedicLineage, setVedicLineage] = useState('Shukla Yajurveda Tradition');
  const [baseDakshana, setBaseDakshana] = useState(2100);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        const payload = {
          name,
          email,
          password,
          phone,
          role,
          city,
          gotra,
          ...(role === 'priest' && {
            title,
            experienceYears: Number(experienceYears),
            vedicLineage,
            baseDakshana: Number(baseDakshana),
          }),
        };
        await register(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoDevotee = async () => {
    setLoading(true);
    setError(null);
    try {
      await quickDevoteeLogin();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPriest = async () => {
    setLoading(true);
    setError(null);
    try {
      await quickPriestLogin();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs mx-auto flex items-center justify-center mb-2 shadow-inner">
            <Flame className="w-7 h-7 text-amber-200 animate-pulse" />
          </div>
          <h3 className="font-heading font-bold text-2xl tracking-wide">
            {mode === 'login' ? 'Welcome to Pandit Ji' : 'Join Sacred Community'}
          </h3>
          <p className="text-amber-100 text-xs mt-1">
            {mode === 'login' 
              ? 'Access verified pujas, bookings, and priest schedule' 
              : 'Register as a Devotee or Verified Acharya Pandit'}
          </p>
        </div>

        {/* Quick 1-Click Demo Logins */}
        <div className="bg-amber-50/70 p-3 border-b border-amber-200 flex items-center justify-center gap-2">
          <span className="text-[11px] font-semibold text-amber-900">Instant Demo:</span>
          <button
            type="button"
            onClick={handleDemoDevotee}
            disabled={loading}
            className="px-2.5 py-1 text-xs rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-medium shadow-2xs cursor-pointer transition-all disabled:opacity-50"
          >
            👤 Devotee (Rahul)
          </button>
          <button
            type="button"
            onClick={handleDemoPriest}
            disabled={loading}
            className="px-2.5 py-1 text-xs rounded-lg bg-amber-600 text-white hover:bg-amber-700 font-medium shadow-2xs cursor-pointer transition-all disabled:opacity-50"
          >
            🪔 Pandit (Acharya)
          </button>
        </div>

        <div className="p-6">
          {/* Mode Switch Tabs (Login vs Register) */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white text-amber-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'register' 
                  ? 'bg-white text-amber-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role selector if registering */}
          {mode === 'register' && (
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setRole('devotee')}
                className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  role === 'devotee'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-amber-600" />
                Devotee (Yajman)
              </button>
              <button
                type="button"
                onClick={() => setRole('priest')}
                className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  role === 'priest'
                    ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-600" />
                Pandit Ji (Acharya)
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name {role === 'priest' && '(with Title)'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'priest' ? 'Acharya Ramanuj Shastri' : 'Rahul Sharma'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="devotee@panditji.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Delhi NCR"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {role === 'devotee' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gotra (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Kashyap, Bharadwaja, Vashishta"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Yrs)</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Base Dakshana (₹)</label>
                      <input
                        type="number"
                        min="500"
                        step="100"
                        value={baseDakshana}
                        onChange={(e) => setBaseDakshana(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading 
                ? 'Processing Sacred Auth...' 
                : mode === 'login' 
                  ? 'Sign In to Portal' 
                  : `Register as ${role === 'priest' ? 'Acharya Pandit' : 'Devotee'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
