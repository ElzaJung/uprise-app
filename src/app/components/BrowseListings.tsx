import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Search, Filter, ArrowLeft, Zap, Leaf, Compass, X, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { listingsAPI } from '../utils/api';

const SECTORS = [
  { id: 'energy', name: 'Energy', icon: '⚡' },
  { id: 'agriculture', name: 'Agriculture', icon: '🌱' },
  { id: 'community', name: 'Community', icon: '🏡' },
  { id: 'tourism', name: 'Tourism', icon: '🌍' },
];

interface Request {
  id: string;
  listingId: string;
  message: string;
  senderName: string;
  date: string;
  status: 'new';
}

interface Listing {
  id: string;
  title: string;
  address: string;
  developable_area_acres?: number;
  buildable_floor_area_sqft?: number;
  land_value?: number;
  terms?: string;
  status: string;
  sectors?: Array<string | { id: string; name: string }>;
  description?: {
    typography?: string;
    access_infrastructure?: string;
    opportunity_summary?: string;
    visible_constraints?: string;
    confidence_score?: number;
    confidence_explanation?: string;
  } | string | null;
  owner_id?: string;
  owner_email?: string;
  created_at?: string;
  updated_at?: string;
}

export default function BrowseListings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Listings State
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  // Request & Modal States
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [requestForm, setRequestForm] = useState({ name: '', message: '' });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, [selectedSectors]); // Re-fetch when sectors change

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔍 [BrowseListings] Attempting to fetch listings from Supabase...');
      console.log('🔍 [BrowseListings] Selected sectors:', selectedSectors);

      // Pass selected sectors to API if any are selected
      const sectorsToQuery = selectedSectors.length > 0 ? selectedSectors : undefined;
      const data = await listingsAPI.getAll(sectorsToQuery);

      console.log('✅ [BrowseListings] Successfully fetched listings from Supabase:', data);
      console.log('✅ [BrowseListings] Number of listings:', data.length);
      setListings(data);
    } catch (err: any) {
      console.error('❌ [BrowseListings] Failed to fetch from Supabase:', err);
      console.error('❌ [BrowseListings] Error message:', err.message);
      console.error('❌ [BrowseListings] Full error:', err);

    } finally {
      setIsLoading(false);
    }
  };

  const toggleSector = (sectorId: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorId)
        ? prev.filter((id) => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSectors([]);
    setStatusFilter('all');
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredListings = listings.filter((listing) => {
    // Search Logic (title or address)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!listing.title.toLowerCase().includes(q) && !listing.address.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Sector Logic
    if (selectedSectors.length > 0) {
      if (!listing.sectors?.some((sector) => {
        const id = typeof sector === 'object' ? sector.id : sector;
        return selectedSectors.includes(id);
      })) {
        return false;
      }
    }

    // Status Logic
    if (statusFilter !== 'all') {
      if (listing.status !== statusFilter) {
        return false;
      }
    }

    // Price Logic
    if (minPrice && listing.land_value && listing.land_value < Number(minPrice)) return false;
    if (maxPrice && listing.land_value && listing.land_value > Number(maxPrice)) return false;

    return true;
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    const newRequest: Request = {
      id: Math.random().toString(36).substr(2, 9),
      listingId: selectedListing.id,
      message: requestForm.message,
      senderName: requestForm.name || 'Anonymous',
      date: new Date().toISOString(),
      status: 'new'
    };

    setRequests(prev => [...prev, newRequest]);
    setSelectedListing(null);
    setShowSuccessToast(true);

    // Auto-hide toast
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] overflow-hidden font-sans text-slate-900">
      {/* Soft Ambient Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-emerald-50/60 via-white to-transparent pointer-events-none z-0" />
      <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center mb-12 md:mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start max-w-2xl mx-auto lg:mx-0"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Unlock Your Land's <br className="hidden sm:block" />True <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Potential</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
              Discover opportunities across energy, agriculture, and development — and connect with the right partners to bring your land to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
              <button
                onClick={() => navigate('/land_analyzer')}
                className="px-8 py-3.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/20 hover:scale-[1.02]"
              >
                Analyze My Land
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('search-container');
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3.5 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:scale-[1.02]"
              >
                Browse Listings
              </button>
            </div>
          </motion.div>

          {/* Right Visual UI Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-lg mx-auto lg:max-w-none hidden md:block"
          >
            {/* Main Map UI Box */}
            <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] bg-white/40 backdrop-blur-3xl rounded-3xl border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden ring-1 ring-slate-900/5">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                <path d="M-20 80 Q 150 150, 420 50" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M-20 180 Q 200 250, 420 150" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M-20 280 Q 100 200, 420 250" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                <motion.path
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, fillOpacity: 0.15 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  d="M 120 140 L 180 80 L 290 110 L 260 210 L 140 230 Z"
                  fill="#10b981"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <circle cx="180" cy="80" r="4" fill="#059669" className="animate-pulse" />
                <circle cx="290" cy="110" r="4" fill="#059669" className="animate-pulse" />
                <circle cx="260" cy="210" r="4" fill="#059669" className="animate-pulse" />
                <circle cx="140" cy="230" r="4" fill="#059669" className="animate-pulse" />
                <path d="M 180 80 L 290 110" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                <path d="M 140 230 L 260 210" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              </svg>
              <div className="absolute top-4 left-4 lg:top-6 lg:left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-700">Parcel 849-2A</span>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-2 md:-right-8 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100/80 flex items-center gap-3 sm:gap-4 z-10 w-[200px] sm:w-[220px]"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Zap className="size-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wide mb-0.5">Solar Potential</p>
                <p className="text-sm sm:text-base text-slate-900 font-extrabold">High</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -left-2 md:-left-12 -translate-y-1/2 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100/80 flex items-center gap-3 sm:gap-4 z-10 w-[200px] sm:w-[240px]"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <Leaf className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Agriculture Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[82%]" />
                  </div>
                  <p className="text-sm text-slate-900 font-extrabold">82%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Search & Filters Container */}
        <motion.div
          id="search-container"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 p-6 sm:p-8 mb-16 scroll-mt-24 ring-1 ring-slate-900/5"
        >
          {/* Top Row: Search and View Toggles */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm text-slate-900 placeholder-slate-400 font-medium text-lg"
                placeholder="Search by location or title..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50 self-start md:self-stretch">
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${viewMode === 'list'
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${viewMode === 'map'
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                Map
              </button>
            </div>
          </div>

          {/* Bottom Row: Additional Filters */}
          <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between border-t border-slate-100 pt-6">

            {/* Sectors */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="size-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sector</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {SECTORS.map((sector) => {
                  const isActive = selectedSectors.includes(sector.id);
                  return (
                    <button
                      key={sector.id}
                      onClick={() => toggleSector(sector.id)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 font-medium flex items-center gap-2 ${isActive
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                      <span>{sector.icon}</span>
                      {sector.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status & Price & Reset */}
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-end sm:items-center">

              {/* Status Dropdown */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-40 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-700 shadow-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full sm:w-28 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-700 shadow-sm placeholder:text-slate-400"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full sm:w-28 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-700 shadow-sm placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              {(searchQuery || selectedSectors.length > 0 || statusFilter !== 'all' || minPrice || maxPrice) && (
                <div className="w-full sm:w-auto pt-6 sm:pt-0">
                  <button
                    onClick={resetFilters}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors border border-slate-200/50 whitespace-nowrap"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </motion.div>

        {/* Section Divider & Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Properties</h2>
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-sm font-semibold text-emerald-700 shadow-sm">
                {filteredListings.length} results
              </span>
            </div>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />
        </motion.div>

        {/* View Layouts */}
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gray-50 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="size-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Interactive Map View</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Showing {filteredListings.length} listings
                  </p>
                </div>
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-56 bg-slate-100 animate-pulse" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-slate-100 rounded w-20 animate-pulse" />
                      <div className="h-8 bg-slate-100 rounded w-20 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-red-200 p-16 text-center mt-8"
            >
              <div className="w-16 h-16 bg-red-100 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Failed to load listings</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">{error}</p>
              <button
                onClick={fetchListings}
                className="px-6 py-2.5 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="list-view"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {filteredListings.map((listing) => (
                <motion.div
                  variants={itemVariants}
                  key={listing.id}
                  onClick={() => navigate(`/listing/${listing.id}`)}
                  className="group bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
                  whileHover={{ y: -4 }}
                >
                  {/* Image Placeholder */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                    <MapPin className="size-10 text-slate-300 z-0 opacity-50 group-hover:scale-110 transition-transform duration-500 ease-out" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${listing.status === 'published'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                        }`}>
                        {listing.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="text-xl font-bold text-white shadow-sm">
                        {listing.land_value ? `$${listing.land_value.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {listing.title}
                    </h3>

                    <div className="flex items-start gap-2 text-slate-500 mb-6">
                      <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">{listing.address}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {listing.sectors?.map((sectorItem) => {
                        const sectorId = typeof sectorItem === 'object' ? sectorItem.id : sectorItem;
                        const sector = SECTORS.find((s) => s.id === sectorId);
                        return (
                          <span
                            key={sectorId}
                            className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-md border border-slate-200 flex items-center gap-1.5"
                          >
                            <span>{sector?.icon || '📍'}</span>
                            {sector?.name || (typeof sectorItem === 'object' ? sectorItem.name : sectorItem)}
                          </span>
                        );
                      })}
                      <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                        {listing.developable_area_acres ? `${listing.developable_area_acres} acres` : 'N/A'}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedListing(listing);
                          setRequestForm({ name: user?.email || '', message: '' });
                        }}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm border border-emerald-100/50"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Contact Owner
                      </button>
                      <div className="flex items-center gap-1 group/btn">
                        <span className="text-slate-500 font-semibold text-sm group-hover/btn:text-slate-700 transition-colors hidden sm:block">
                          View
                        </span>
                        <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180 group-hover/btn:translate-x-1 group-hover/btn:text-slate-600 transition-all" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center mt-8"
          >
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No listings match your filters</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Try adjusting your search terms, changing the sector, or broadening your price range.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Send Request
                </h3>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendRequest} className="p-6">
                <div className="mb-6 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Inquiring about</p>
                  <p className="font-bold text-slate-900">{selectedListing.title}</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={4}
                      value={requestForm.message}
                      onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                      placeholder="I am interested in this property..."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 resize-y shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedListing(null)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200 outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 outline-none"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xl ring-1 ring-emerald-900/5"
          >
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-800">Request sent successfully!</span>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-4 p-1 rounded-full text-emerald-600 hover:bg-emerald-100/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}