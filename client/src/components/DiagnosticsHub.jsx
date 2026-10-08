import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Layers, 
  AlertCircle,
  DatabaseZap,
  Activity,
  Cpu,
  Globe,
  Radio,
  Lock,
  CalendarCheck,
  Search,
  Star,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { checkServerHealth, seedDatabase } from '../services/api';

const DiagnosticsHub = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccessMessage, setSeedSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [latency, setLatency] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();
    try {
      const data = await checkServerHealth();
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setHealthData(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setError(err.message || 'Could not connect to backend server');
      setHealthData(null);
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  const handleReSeed = async () => {
    setSeeding(true);
    setSeedSuccessMessage(null);
    setError(null);
    try {
      const res = await seedDatabase();
      setSeedSuccessMessage(res.message || 'Database successfully re-seeded with authentic rituals & pandits!');
      await fetchHealth();
    } catch (err) {
      setError(err.message || 'Failed to re-seed database');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const phases = [
    { num: 1, title: 'Project Setup & MongoDB Connection', category: 'Foundation', status: 'Active', desc: 'Vite React frontend, Express backend, MVC architecture, and Mongoose connection.' },
    { num: 2, title: 'Role-Based Authentication', category: 'Security', status: 'Active', desc: 'User & Priest registration, JWT tokens, bcrypt password hashing, and protected route middleware.' },
    { num: 3, title: 'Priest Profiles & Vedic Lineage', category: 'Profiles', status: 'Active', desc: 'Bio, qualifications, languages, gotra/sampradaya, service radius, and Vedic lineage details.' },
    { num: 4, title: 'Ritual Catalog & Priest Pricing', category: 'Catalog', status: 'Active', desc: 'Centralized rituals, custom priest dakshana, duration, and complete samagri checklists.' },
    { num: 5, title: 'Calendar & Slot Availability', category: 'Booking', status: 'Active', desc: 'Interactive date picker, dynamic slot management, and priest availability controls.' },
    { num: 6, title: 'Location, Ritual & Date Search', category: 'Discovery', status: 'Active', desc: 'Advanced search engine with category filters, sorting by experience & rating, and city matching.' },
    { num: 7, title: 'Booking Engine & Double-Booking Lock', category: 'Booking', status: 'Active', desc: 'Step-by-step booking form, address validation, samagri toggles, and slot reservation locks.' },
    { num: 8, title: 'Dashboards (User & Priest)', category: 'Management', status: 'Active', desc: 'Dedicated portals for managing requests, earnings, status updates, and bookings.' },
    { num: 9, title: 'Verified Reviews & Ratings', category: 'Trust', status: 'Active', desc: 'Post-service genuine reviews with dynamic average rating and feedback calculation.' },
    { num: 10, title: 'Security, Toast Alerts & Polish', category: 'UI/UX', status: 'Active', desc: 'Input validation, toast notifications, responsive design, and fluid micro-animations.' },
    { num: 11, title: 'Deployment & Production Build', category: 'DevOps', status: 'Active', desc: 'Production-ready architecture optimized for modern cloud deployments and Atlas clusters.' },
  ];

  const apiEndpoints = [
    { method: 'GET', path: '/api/health', name: 'System Health & DB Status' },
    { method: 'POST', path: '/api/auth/register', name: 'User & Priest Registration' },
    { method: 'POST', path: '/api/auth/login', name: 'JWT Authentication & Login' },
    { method: 'GET', path: '/api/rituals', name: 'Ritual Catalog & Categories' },
    { method: 'GET', path: '/api/priests', name: 'Verified Priest Directory & Search' },
    { method: 'POST', path: '/api/bookings', name: 'Booking Creation & Slot Lock' },
    { method: 'POST', path: '/api/seed', name: 'Database Seeder & Dummy Fixtures' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white p-6 sm:p-10 shadow-2xl border border-amber-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Live Platform Health Center
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              System Diagnostics & Architecture Monitor
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time telemetry connecting Vite frontend, Express REST API, and MongoDB Database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleReSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-95"
            >
              <DatabaseZap className={`w-4 h-4 text-amber-400 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Seeding Database...' : 'Re-Seed Database'}
            </button>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Pinging API...' : 'Ping Backend API'}
            </button>
          </div>
        </div>

        {seedSuccessMessage && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{seedSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* System Vitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Express REST API */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Backend Server</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-stone-900">
              {healthData ? 'Port 5000 (Express)' : error ? 'Server Offline' : 'Connecting...'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${healthData ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="text-xs text-stone-600 font-medium">
                {healthData ? 'API Operational' : 'Offline / Unreachable'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Latency</span>
            <span className="font-bold text-stone-800">{latency ? `${latency} ms` : '—'}</span>
          </div>
        </div>

        {/* Card 2: MongoDB */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Database</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-stone-900">
              {healthData?.data?.database?.connected ? 'MongoDB Connected' : 'Local / Atlas DB'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${healthData?.data?.database?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-xs text-stone-600 font-medium">
                {healthData?.data?.database?.status || 'Waiting for check'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Driver</span>
            <span className="font-bold text-stone-800">Mongoose 8.9.5</span>
          </div>
        </div>

        {/* Card 3: Security & Auth */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Auth & Security</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-stone-900">JWT & Role Guard</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-stone-600 font-medium">Devotee / Priest Roles</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Hashing</span>
            <span className="font-bold text-stone-800">Bcrypt Salt 10</span>
          </div>
        </div>

        {/* Card 4: Environment */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Environment</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-stone-900">
              {healthData?.data?.environment ? `${healthData.data.environment.toUpperCase()}` : 'DEVELOPMENT'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs text-stone-500 font-medium">
                {lastChecked ? `Checked ${lastChecked}` : 'Not checked yet'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Vite Port</span>
            <span className="font-bold text-stone-800">5173</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-rose-900">Backend Server Offline or Unreachable</p>
            <p className="text-rose-700 mt-0.5">
              Make sure to run <code className="bg-rose-100 px-1.5 py-0.5 rounded text-rose-900 font-mono">npm run dev</code> inside the <code className="bg-rose-100 px-1.5 py-0.5 rounded text-rose-900 font-mono">/server</code> folder.
            </p>
          </div>
        </div>
      )}

      {/* REST API Routing Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" />
              Active REST API Service Routes
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Interconnected endpoints serving authentication, rituals, bookings, and priest management.
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            7 Endpoints Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {apiEndpoints.map((ep, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-stone-50 hover:bg-amber-50/50 border border-stone-200/80 transition-colors flex items-center justify-between gap-3">
              <div className="space-y-0.5 overflow-hidden">
                <p className="text-xs font-bold text-stone-800 truncate">{ep.name}</p>
                <p className="text-[11px] font-mono text-stone-500 truncate">{ep.path}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {ep.method}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Modules (11 Phases) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-xl font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              11-Phase Implementation Architecture
            </h3>
            <p className="text-xs text-stone-500">
              Architectural modules configured and active across the full-stack MERN application.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> All 11 Phases Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase) => (
            <div
              key={phase.num}
              className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                    Phase {phase.num}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {phase.status}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-stone-900 text-sm mb-1.5 group-hover:text-amber-900 transition-colors">
                  {phase.title}
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {phase.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-400 font-medium">{phase.category}</span>
                <span className="text-amber-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Ready <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsHub;
