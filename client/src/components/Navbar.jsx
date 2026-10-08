import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  User, 
  Calendar, 
  BookOpen, 
  Server, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeTab, setActiveTab, onOpenAuthModal, selectedCity, setSelectedCity }) => {
  const { user, isAuthenticated, isPriest, logout, quickDevoteeLogin, quickPriestLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cities = ['All Cities', 'Delhi NCR', 'Varanasi', 'Mumbai', 'Bengaluru', 'Haridwar', 'Ayodhya', 'Pune', 'Jaipur'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-sm">
      {/* Top Auspicious Micro-Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white text-[11px] font-medium py-1 px-4 text-center tracking-wide flex items-center justify-between">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <span className="hidden sm:inline flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Vedic Sanskrit Chanting & Authentic Vidhi at Your Home / Temple
          </span>
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <span>✨ 100% Shastra-Verified Acharyas & Pandits</span>
            <span className="opacity-40">|</span>
            <span className="text-amber-200 font-semibold">Transparent Dakshana</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Flame className="w-7 h-7 animate-pulse text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl tracking-wide text-amber-950 group-hover:text-amber-700 transition-colors">
                Pandit Ji
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                At Your Doorstep
              </span>
            </div>
            <p className="text-xs text-amber-800/80 font-medium">
              Find. Book. Perform Your Rituals.
            </p>
          </div>
        </button>

        {/* City Filter Selector */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent border-none outline-none font-semibold cursor-pointer text-amber-950 pr-2"
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-700">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-amber-100 text-amber-950 font-semibold shadow-sm'
                : 'hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('rituals')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'rituals'
                ? 'bg-amber-100 text-amber-950 font-semibold shadow-sm'
                : 'hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            Puja Catalog
          </button>
          <button
            onClick={() => setActiveTab('priests')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'priests'
                ? 'bg-amber-100 text-amber-950 font-semibold shadow-sm'
                : 'hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            Find Pandit Ji
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab(isPriest ? 'priest_dashboard' : 'my_bookings')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'my_bookings' || activeTab === 'priest_dashboard'
                  ? 'bg-amber-100 text-amber-950 font-semibold shadow-sm'
                  : 'hover:bg-amber-50 hover:text-amber-900'
              }`}
            >
              {isPriest ? 'Priest Portal' : 'My Bookings'}
            </button>
          )}

          {/* Quick Book CTA */}
          <button
            onClick={() => setActiveTab('rituals')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Book a Puja
          </button>
        </nav>

        {/* User Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-amber-700 font-semibold capitalize mt-0.5">
                    {user.role === 'priest' ? 'Acharya Ji' : 'Devotee'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-amber-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    {user.gotra && (
                      <p className="text-[10px] text-amber-700 mt-0.5">Gotra: {user.gotra}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTab(isPriest ? 'priest_dashboard' : 'my_bookings')}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-amber-600" />
                    {isPriest ? 'Priest Schedule & Requests' : 'My Puja Bookings'}
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Quick Demo Pill buttons for instant testing */}
              <div className="hidden xl:flex items-center gap-1.5 text-xs bg-amber-50/80 p-1 rounded-xl border border-amber-200">
                <button
                  onClick={quickDevoteeLogin}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 font-semibold border border-amber-200 shadow-xs cursor-pointer text-[11px]"
                  title="Login as sample Devotee (Rahul Sharma)"
                >
                  ⚡ Demo Devotee
                </button>
                <button
                  onClick={quickPriestLogin}
                  className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-xs cursor-pointer text-[11px]"
                  title="Login as Acharya Pandit (Shastri Ji)"
                >
                  🪔 Demo Priest
                </button>
              </div>

              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-xs shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <User className="w-4 h-4" />
                Login / Register
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-amber-200 px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-50"
            >
              Explore Home
            </button>
            <button
              onClick={() => { setActiveTab('rituals'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-50"
            >
              Puja & Ritual Catalog
            </button>
            <button
              onClick={() => { setActiveTab('priests'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-50"
            >
              Find Verified Pandit Ji
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setActiveTab(isPriest ? 'priest_dashboard' : 'my_bookings');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-800 bg-amber-50"
              >
                {isPriest ? 'Priest Schedule & Requests' : 'My Puja Bookings'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
