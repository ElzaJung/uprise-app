import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Search, BarChart3, LineChart, Layers, ShieldCheck, Zap, BrainCircuit, Network, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAnalyzeLand = () => {
    navigate('/land_analyzer');
  };

  const handleBrowseListings = () => {
    navigate('/browse');
  };

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-16 lg:pt-32 lg:pb-24 border-b border-gray-100 bg-[#f8faf9]">
        {/* Subtle Map/Grid Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1718498576333-a331226b33a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3BvZ3JhcGhpY2FsJTIwbWFwJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0NjMwMDA0fDA&ixlib=rb-4.1.0&q=80&w=1080")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
            
            {/* Left Content (Text & CTAs) */}
            <div className="w-full lg:w-[55%] flex flex-col text-center lg:text-left items-center lg:items-start pt-6">
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                Unlock the Hidden Value of <span className="text-emerald-700">Every Acre</span>
              </h1>
              
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
                Uprise.ai analyzes land for energy, agriculture, and community potential. Discover new opportunities, activate underutilized parcels, and connect with developers—all on one intelligent platform.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={handleAnalyzeLand}
                  className="px-8 py-4 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-[0.98]"
                >
                  <MapPin className="w-5 h-5" />
                  Analyze My Land
                </button>
                <button
                  onClick={handleBrowseListings}
                  className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl hover:border-emerald-600 hover:text-emerald-700 transition-all font-semibold text-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Search className="w-5 h-5" />
                  Browse Listings
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-gray-200 w-full">
                <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Trusted by landowners & developers for</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-gray-600">Solar Yields</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-gray-600">Risk Mitigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-gray-600">Zoning Data</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Element (Desktop Only) */}
            <div className="hidden lg:block w-full lg:w-[45%] relative">
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-100 rounded-full blur-[100px] opacity-60 z-0 pointer-events-none"></div>
              
              {/* Mock Dashboard Card */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-emerald-900/10 border border-gray-100 overflow-hidden transform transition-transform hover:-translate-y-1 duration-500">
                
                {/* Dashboard Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Parcel Analysis</span>
                </div>
                
                {/* Dashboard Body */}
                <div className="p-6">
                  {/* Map Graphic Area */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 bg-gray-100 border border-gray-200">
                    <img 
                      src="https://images.unsplash.com/photo-1701390544948-f88cadb4aa73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3BvZ3JhcGhpY2FsJTIwbWFwfGVufDF8fHx8MTc3NDYyOTk5Nnww&ixlib=rb-4.1.0&q=80&w=1080" 
                      alt="Satellite Map" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    {/* Overlay elements */}
                    <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay"></div>
                    <div className="absolute top-[20%] left-[25%] w-1/2 h-1/2 border-[3px] border-emerald-400 bg-emerald-400/20 rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.5)] flex items-center justify-center">
                       <MapPin className="text-emerald-500 w-8 h-8 drop-shadow-md animate-bounce" />
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-emerald-800 font-semibold uppercase">Solar Suitability</span>
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-2xl font-bold text-emerald-900">94%</span>
                      <p className="text-xs text-emerald-700 mt-1">Tier 1 Potential</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-blue-800 font-semibold uppercase">Est. Value</span>
                        <LineChart className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-blue-900">$1.2M</span>
                      <p className="text-xs text-blue-700 mt-1">+14% YoY</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>Analysis Confidence</span>
                      <span className="text-emerald-600">High</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full w-[85%] relative">
                         <div className="absolute inset-0 bg-white/20 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From land to opportunity in three simple steps.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Visual Connectors (Desktop Only) */}
            <div className="hidden md:block absolute top-[3rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 group relative bg-white/80 backdrop-blur-sm">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm ring-4 ring-white relative z-10">
                  <MapPin className="w-8 h-8" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-800 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">1</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Select Your Land</h3>
                <p className="text-gray-600 leading-relaxed">
                  Search or pinpoint your land using an interactive map.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 group relative bg-white/80 backdrop-blur-sm">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm ring-4 ring-white relative z-10">
                  <BrainCircuit className="w-8 h-8" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-800 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">2</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get AI Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI evaluates zoning, environment, and market potential.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 group relative bg-white/80 backdrop-blur-sm">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm ring-4 ring-white relative z-10">
                  <Network className="w-8 h-8" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-800 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">3</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Publish & Connect</h3>
                <p className="text-gray-600 leading-relaxed">
                  List your land and connect with developers, investors, and collaborators.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="bg-white py-24 border-t border-gray-100 overflow-hidden relative">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Left Side Content */}
            <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                See Your Land in a <span className="text-emerald-700">New Way</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
                Visualize analysis, track opportunities, and manage your land from one powerful dashboard.
              </p>
              
              <ul className="space-y-5 mb-10 w-full max-w-md text-left">
                {[
                  "View AI-generated insights and land scores",
                  "Track analysis status in real time",
                  "Manage listings and collaboration requests"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span className="text-gray-700 font-medium leading-tight">{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleAnalyzeLand}
                className="px-8 py-4 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all font-semibold text-lg flex items-center justify-center shadow-lg shadow-emerald-700/20 active:scale-[0.98] w-full sm:w-auto"
              >
                Analyze My Land
              </button>
            </div>

            {/* Right Side - Dashboard Preview */}
            <div className="w-full lg:w-[55%] relative lg:-mr-6 mt-10 lg:mt-0">
              {/* Background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-50 rounded-full blur-[80px] opacity-70 z-0 pointer-events-none"></div>
              
              <div className="relative z-10 bg-white rounded-xl md:rounded-2xl shadow-[0_20px_50px_-12px_rgba(16,185,129,0.15)] border border-gray-100 overflow-hidden group">
                
                {/* Mock UI Header */}
                <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-24 h-2 bg-gray-100 rounded-full"></div>
                    <div className="w-8 h-2 bg-gray-100 rounded-full"></div>
                  </div>
                </div>

                {/* Dashboard Body */}
                <div className="p-4 md:p-6 grid grid-cols-12 gap-4 md:gap-6 bg-[#f8faf9]">
                  {/* Map/Main View */}
                  <div className="col-span-12 md:col-span-8 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-48 md:h-64 relative group-hover:shadow-md transition-shadow">
                    <img 
                      src="https://images.unsplash.com/photo-1719254271334-435e156418da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMHZpZXclMjBmYXJtbGFuZCUyMGdyZWVufGVufDF8fHx8MTc3NDYzMTY0OXww&ixlib=rb-4.1.0&q=80&w=1080" 
                      alt="Land Map UI" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-emerald-900/10"></div>
                    
                    {/* Map UI Overlays */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                       <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-gray-800 shadow-sm">Parcel #8492</div>
                       <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm"><Layers className="w-4 h-4 text-emerald-700"/></div>
                    </div>
                    
                    {/* Pulsing Dot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_0_4px_rgba(16,185,129,0.2)] animate-pulse"></div>
                    </div>
                  </div>

                  {/* Sidebar stats */}
                  <div className="col-span-12 md:col-span-4 flex flex-row md:flex-col gap-4">
                    <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-center group-hover:shadow-md transition-shadow">
                      <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 md:mb-2 tracking-wider">Suitability</span>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl md:text-4xl font-extrabold text-emerald-700 leading-none">92</span>
                        <span className="text-xs text-gray-400 mb-0.5 md:mb-1">/100</span>
                      </div>
                      <div className="mt-2 md:mt-4 w-full bg-gray-50 rounded-full h-1.5 md:h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[92%] relative">
                           <div className="absolute inset-0 bg-white/20 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 shadow-sm group-hover:shadow-md transition-shadow">
                       <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-2 md:mb-4 block tracking-wider">Metrics</span>
                       <div className="space-y-3 md:space-y-4">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-50 rounded-lg text-amber-600 flex items-center justify-center shrink-0"><span className="text-[10px] md:text-xs">🌾</span></div>
                           <div className="w-full">
                             <div className="flex justify-between mb-1">
                               <span className="text-[10px] font-semibold text-gray-600">Agri Yield</span>
                               <span className="text-[10px] font-bold text-gray-900">84%</span>
                             </div>
                             <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                               <div className="h-full bg-amber-400 rounded-full w-[84%]"></div>
                             </div>
                           </div>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-50 rounded-lg text-blue-600 flex items-center justify-center shrink-0"><Zap className="w-3 h-3 md:w-4 md:h-4"/></div>
                           <div className="w-full">
                             <div className="flex justify-between mb-1">
                               <span className="text-[10px] font-semibold text-gray-600">Solar Gen</span>
                               <span className="text-[10px] font-bold text-gray-900">96%</span>
                             </div>
                             <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-400 rounded-full w-[96%]"></div>
                             </div>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Bottom list */}
                  <div className="col-span-12 bg-white rounded-xl border border-gray-100 shadow-sm p-4 group-hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-gray-800">Recent Listings</span>
                      <span className="text-xs text-emerald-600 font-bold cursor-pointer hover:text-emerald-800 transition-colors">View All</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0">
                              <img src={`https://images.unsplash.com/photo-${i === 1 ? '1536430291604-5e07b05f0592' : '1710209327618-ac03d2d6c34a'}?w=100&h=100&fit=crop`} className="w-full h-full object-cover opacity-90" alt="Listing thumbnail" />
                            </div>
                            <div>
                              <div className="h-3 w-20 md:w-24 bg-gray-800 rounded-sm mb-1.5"></div>
                              <div className="h-2 w-14 md:w-16 bg-gray-400 rounded-sm"></div>
                            </div>
                          </div>
                          <div className="h-6 w-16 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-emerald-700">Active</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#f8faf9] py-24 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Powerful Tools to Unlock Your Land
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to analyze, develop, and connect around land opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 relative overflow-hidden flex flex-col items-start hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">AI-Powered Analysis</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Evaluate zoning, environment, and market potential instantly with our advanced machine learning models.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 relative overflow-hidden flex flex-col items-start hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Sector Insights</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Discover actionable opportunities across energy, agriculture, tourism, and community development.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 relative overflow-hidden flex flex-col items-start hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Land Marketplace</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                List, explore, and filter premium land opportunities in our interactive, high-fidelity marketplace.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 relative overflow-hidden flex flex-col items-start hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Network className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">Collaboration Tools</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Connect and communicate securely with developers, investors, and strategic partners.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
