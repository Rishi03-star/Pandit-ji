import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  MapPin, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Users, 
  Heart,
  HelpCircle,
  Award,
  RefreshCw
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getRituals, getPriests, getFeaturedPriests } from './services/api';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import RitualCard from './components/RitualCard';
import RitualDetailModal from './components/RitualDetailModal';
import PriestCard from './components/PriestCard';
import PriestDetailModal from './components/PriestDetailModal';
import BookingModal from './components/BookingModal';
import DevoteeDashboard from './components/DevoteeDashboard';
import PriestDashboard from './components/PriestDashboard';
import DiagnosticsHub from './components/DiagnosticsHub';

function AppContent() {
  const { user, isAuthenticated, isPriest } = useAuth();

  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'rituals' | 'priests' | 'my_bookings' | 'priest_dashboard' | 'diagnostics'
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priestSort, setPriestSort] = useState('rating');

  // Data state
  const [rituals, setRituals] = useState([]);
  const [priests, setPriests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState('devotee');
  const [selectedRitualForModal, setSelectedRitualForModal] = useState(null);
  const [selectedPriestForModal, setSelectedPriestForModal] = useState(null);
  
  // Booking state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPreselectedRitual, setBookingPreselectedRitual] = useState(null);
  const [bookingPreselectedPriest, setBookingPreselectedPriest] = useState(null);

  // Load rituals and priests from backend API
  const loadData = async () => {
    setLoadingData(true);
    try {
      const [ritualsRes, priestsRes] = await Promise.all([
        getRituals({ category: selectedCategory !== 'All' ? selectedCategory : undefined, search: searchQuery || undefined }),
        getPriests({ city: selectedCity !== 'All Cities' ? selectedCity : undefined, sort: priestSort, search: searchQuery || undefined }),
      ]);
      setRituals(ritualsRes.data || []);
      setPriests(priestsRes.data || []);
    } catch (err) {
      console.warn('Error loading rituals/priests:', err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedCity, priestSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Handlers for booking triggers
  const handleOpenBookingWithRitual = (ritual) => {
    setBookingPreselectedRitual(ritual);
    setBookingPreselectedPriest(null);
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithPriest = (priest, specificRitual = null) => {
    setBookingPreselectedPriest(priest);
    if (specificRitual) {
      const matchingRitual = rituals.find(r => r.name?.toLowerCase() === specificRitual.ritualName?.toLowerCase());
      setBookingPreselectedRitual(matchingRitual || null);
    } else {
      setBookingPreselectedRitual(null);
    }
    setBookingModalOpen(true);
  };

  const categories = [
    'All',
    'Pujas & Katha',
    'Havans & Yagya',
    'Sanskars & Vivah',
    'Shanti & Astrological',
  ];

  return (
    <div className="min-h-screen bg-spiritual-pattern flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-white">
      {/* Sacred Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => {
          setAuthDefaultRole('devotee');
          setAuthModalOpen(true);
        }}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* Main Body Router */}
      <main className="flex-1 w-full">
        {/* VIEW 1: Devotee Dashboard */}
        {activeTab === 'my_bookings' && (
          <DevoteeDashboard
            onOpenBooking={() => setBookingModalOpen(true)}
            onExplorePujas={() => setActiveTab('rituals')}
          />
        )}

        {/* VIEW 2: Priest Dashboard */}
        {activeTab === 'priest_dashboard' && (
          <PriestDashboard />
        )}

        {/* VIEW 3: System Diagnostics & 11-Phase Roadmap */}
        {activeTab === 'diagnostics' && (
          <DiagnosticsHub />
        )}

        {/* VIEW 4: Puja & Ritual Catalog */}
        {activeTab === 'rituals' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                🪔 Vedic Shastra Catalog
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                Pujas, Havans & Traditional Sanskars
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Every ritual includes transparent dakshana, complete samagri options, and recitation of authentic Vedic mantras by qualified Acharyas.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Rituals Grid */}
            {loadingData ? (
              <div className="p-16 text-center text-xs text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-2" />
                <p>Loading Vedic rituals...</p>
              </div>
            ) : rituals.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-amber-300">
                <p className="text-xs text-slate-500">No rituals found matching your selection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rituals.map((ritual) => (
                  <RitualCard
                    key={ritual._id}
                    ritual={ritual}
                    onSelectRitual={(r) => setSelectedRitualForModal(r)}
                    onBookRitual={handleOpenBookingWithRitual}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: Find Verified Pandits */}
        {activeTab === 'priests' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                ✨ 100% Shastra Verified
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                Find Qualified Acharyas & Pandits
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Browse senior Vedic scholars from Varanasi, Haridwar, Delhi NCR, and across India with verified lineage and credentials.
              </p>
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-700">
                Showing {priests.length} Verified Acharyas in {selectedCity}
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  value={priestSort}
                  onChange={(e) => setPriestSort(e.target.value)}
                  className="bg-amber-50 font-bold text-amber-950 px-3 py-1.5 rounded-xl border border-amber-200 outline-none cursor-pointer"
                >
                  <option value="rating">Highest Rated ★</option>
                  <option value="experience">Years of Experience</option>
                  <option value="dakshana_asc">Dakshana: Low to High</option>
                  <option value="dakshana_desc">Dakshana: High to Low</option>
                </select>
              </div>
            </div>

            {/* Priests Grid */}
            {loadingData ? (
              <div className="p-16 text-center text-xs text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-2" />
                <p>Loading verified Acharyas...</p>
              </div>
            ) : priests.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-amber-300">
                <p className="text-xs text-slate-500">No pandits found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {priests.map((priest) => (
                  <PriestCard
                    key={priest._id}
                    priest={priest}
                    onSelectPriest={(p) => setSelectedPriestForModal(p)}
                    onBookPriest={handleOpenBookingWithPriest}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: Sacred Home Page */}
        {activeTab === 'home' && (
          <div className="space-y-16 py-8">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Sanatana Vedic Tradition • Double-Booking Protected Platform
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
                Sacred Rituals, <span className="text-saffron-gradient">Verified Priests</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Connect directly with qualified Vedic Acharyas for Griha Pravesh, Satyanarayan Katha, Rudrabhishek, Havans, and Vivah Sanskar with complete samagri and transparent dakshana.
              </p>

              {/* Sacred Search & Filter Engine Bar */}
              <div className="max-w-3xl mx-auto bg-white p-3 rounded-3xl shadow-xl shadow-amber-950/5 border border-amber-200">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 w-full">
                    <Search className="w-4 h-4 text-amber-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search Puja (e.g. Griha Pravesh, Havan, Katha)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs font-medium outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

                  <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-auto">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
                    >
                      {['All Cities', 'Delhi NCR', 'Varanasi', 'Mumbai', 'Bengaluru', 'Haridwar'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2 transition-all shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" /> Find & Book
                  </button>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 text-left">
                <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/60 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">100% Shastra Verified</h5>
                    <p className="text-[10px] text-slate-500">Certified Acharyas</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/60 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Pure Samagri Set</h5>
                    <p className="text-[10px] text-slate-500">Provided by Pandit Ji</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/60 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Fixed Dakshana</h5>
                    <p className="text-[10px] text-slate-500">Pay after ritual</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/60 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">4.9★ Average Rating</h5>
                    <p className="text-[10px] text-slate-500">Blessed Devotees</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Popular Pujas Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Auspicious Ceremonies</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                    Most Booked Vedic Pujas & Katha
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('rituals')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  View All {rituals.length} Pujas <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rituals.slice(0, 3).map((ritual) => (
                  <RitualCard
                    key={ritual._id}
                    ritual={ritual}
                    onSelectRitual={(r) => setSelectedRitualForModal(r)}
                    onBookRitual={handleOpenBookingWithRitual}
                  />
                ))}
              </div>
            </section>

            {/* Featured Acharyas Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Sanatana Acharyas</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                    Top-Rated Verified Pandits
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('priests')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  Browse All Acharyas <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {priests.slice(0, 3).map((priest) => (
                  <PriestCard
                    key={priest._id}
                    priest={priest}
                    onSelectPriest={(p) => setSelectedPriestForModal(p)}
                    onBookPriest={handleOpenBookingWithPriest}
                  />
                ))}
              </div>
            </section>

            {/* How It Works Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="bg-gradient-to-br from-amber-900 via-orange-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    Simple & Sacred Flow
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold">
                    How to Book Pandit Ji in 4 Simple Steps
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                    <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h4 className="font-heading font-bold text-base">Select Your Puja</h4>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                      Choose from Griha Pravesh, Satyanarayan Katha, Rudrabhishek, Vivah, or Havans.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                    <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h4 className="font-heading font-bold text-base">Choose Verified Pandit</h4>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                      Select qualified Acharyas based on language, Vedic lineage, and devotee reviews.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                    <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h4 className="font-heading font-bold text-base">Pick Shubh Muhurat</h4>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                      Select date, time slot, and samagri preferences with Double-Booking slot protection.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
                    <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <h4 className="font-heading font-bold text-base">Perform Blessed Puja</h4>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                      Pandit Ji arrives with full preparation. Offer transparent dakshana after ritual completion.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authDefaultRole}
      />

      <RitualDetailModal
        ritual={selectedRitualForModal}
        isOpen={!!selectedRitualForModal}
        onClose={() => setSelectedRitualForModal(null)}
        onBookNow={handleOpenBookingWithRitual}
      />

      <PriestDetailModal
        priest={selectedPriestForModal}
        isOpen={!!selectedPriestForModal}
        onClose={() => setSelectedPriestForModal(null)}
        onBookNow={handleOpenBookingWithPriest}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preSelectedRitual={bookingPreselectedRitual}
        preSelectedPriest={bookingPreselectedPriest}
        rituals={rituals}
        priests={priests}
        onBookingSuccess={() => {
          if (isAuthenticated) {
            setActiveTab('my_bookings');
          }
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-amber-200/80 bg-white/90 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl text-amber-950">
                  Pandit Ji at Your Doorstep
                </span>
                <p className="text-xs text-slate-500">Find. Book. Perform Your Rituals.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <button onClick={() => setActiveTab('home')} className="hover:text-amber-800 cursor-pointer">Explore</button>
              <button onClick={() => setActiveTab('rituals')} className="hover:text-amber-800 cursor-pointer">Puja Catalog</button>
              <button onClick={() => setActiveTab('priests')} className="hover:text-amber-800 cursor-pointer">Verified Pandits</button>
              <button onClick={() => { setBookingModalOpen(true); }} className="hover:text-amber-800 cursor-pointer text-amber-700">Book Pandit Ji</button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 space-y-1">
            <p className="font-medium text-amber-950">
              ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥
            </p>
            <p>
              Pandit Ji at Your Doorstep © 2026 — Production Full-Stack MERN Priest Booking Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
