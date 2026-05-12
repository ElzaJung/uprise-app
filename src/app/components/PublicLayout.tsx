import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Footer } from './Footer';
import { useAuth } from '../contexts/AuthContext';

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Browse Land', path: '/browse' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">

      {/* Fixed Header Wrapper */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-gray-50/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'
        }`}>
        <div className={`mx-auto max-w-7xl transition-all duration-300 w-full ${isScrolled ? 'px-4 py-2 sm:py-3' : 'px-4 sm:px-6 lg:px-8 py-4 sm:py-6'
          }`}>
          <header className={`w-full rounded-2xl transition-all duration-500 border-x relative overflow-hidden ${isScrolled
              ? 'bg-white/95 border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-5 py-3'
              : 'bg-white/70 backdrop-blur-lg border-white/60 shadow-sm px-5 sm:px-8 py-4'
            }`}>
            {/* Subtle Mountain Silhouette Top Edge */}
            <div className="absolute top-0 left-0 right-0 h-[10px] sm:h-[14px] pointer-events-none z-0">
              <svg
                preserveAspectRatio="none"
                viewBox="0 0 1200 24"
                className="w-full h-full rotate-180 opacity-80"
              >
                {/* Soft gradient fill under the line */}
                <path
                  d="M0,24 L0,18 C150,18 200,8 300,14 C400,20 450,22 550,12 C650,2 700,16 800,20 C900,24 950,8 1050,12 C1150,16 1180,20 1200,18 L1200,24 Z"
                  fill="url(#nav-mountain-fill-top)"
                />
                {/* 1.5px Mountain Silhouette Line */}
                <path
                  d="M0,18 C150,18 200,8 300,14 C400,20 450,22 550,12 C650,2 700,16 800,20 C900,24 950,8 1050,12 C1150,16 1180,20 1200,18"
                  fill="none"
                  stroke="url(#nav-mountain-stroke-top)"
                  strokeWidth="1.5"
                />
                <defs>
                  <linearGradient id="nav-mountain-fill-top" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.03" />
                    <stop offset="50%" stopColor="#059669" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
                  </linearGradient>
                  <linearGradient id="nav-mountain-stroke-top" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#059669" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Subtle Mountain Silhouette Bottom Edge */}
            <div className="absolute bottom-0 left-0 right-0 h-[10px] sm:h-[14px] pointer-events-none z-0">
              <svg
                preserveAspectRatio="none"
                viewBox="0 0 1200 24"
                className="w-full h-full"
              >
                {/* Soft gradient fill under the line */}
                <path
                  d="M0,24 L0,18 C150,18 200,8 300,14 C400,20 450,22 550,12 C650,2 700,16 800,20 C900,24 950,8 1050,12 C1150,16 1180,20 1200,18 L1200,24 Z"
                  fill="url(#nav-mountain-fill)"
                />
                {/* 1.5px Mountain Silhouette Line */}
                <path
                  d="M0,18 C150,18 200,8 300,14 C400,20 450,22 550,12 C650,2 700,16 800,20 C900,24 950,8 1050,12 C1150,16 1180,20 1200,18"
                  fill="none"
                  stroke="url(#nav-mountain-stroke)"
                  strokeWidth="1.5"
                />
                <defs>
                  <linearGradient id="nav-mountain-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.03" />
                    <stop offset="50%" stopColor="#059669" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
                  </linearGradient>
                  <linearGradient id="nav-mountain-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#059669" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex items-center justify-between relative z-10">

              {/* Left: Logo */}
              <div
                className="flex items-center gap-2.5 cursor-pointer z-50 group"
                onClick={() => navigate('/')}
              >

                <span className="text-xl font-bold text-gray-900 tracking-tight">Uprise.ai</span>
              </div>

              {/* Center: Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`relative group text-sm font-semibold transition-colors py-2 ${isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {link.name}
                      <span className={`absolute left-0 bottom-0 h-[2px] bg-emerald-600 transition-all duration-300 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}></span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right: Actions */}
              <div className="hidden md:flex items-center gap-6">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate('/saved-analyses')}
                      className="flex items-center gap-2 group"
                    >
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="size-9 rounded-full border-2 border-gray-200 group-hover:border-emerald-500 transition-all duration-300 object-cover ring-2 ring-transparent group-hover:ring-emerald-100"
                        />
                      ) : (
                        <div className="size-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold border-2 border-gray-200 group-hover:border-emerald-500 transition-all duration-300 ring-2 ring-transparent group-hover:ring-emerald-100">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-gray-600 group-hover:text-emerald-700 transition-colors">
                        {user.name ? user.name.split(' ')[0] : 'Profile'}
                      </span>
                    </button>
                    <button
                      onClick={async () => {
                        await logout();
                        navigate('/');
                      }}
                      className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/auth')}
                      className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/land_analyzer')}
                      className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                    >
                      Analyze My Land
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors z-50 relative"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </header>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white/95 backdrop-blur-2xl z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden flex flex-col ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-32">
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-3xl font-bold transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-900 hover:text-emerald-600'
                  }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="w-16 h-[2px] bg-gray-200 rounded-full my-4"></div>

          {user ? (
            <>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/saved-analyses'); }}
                className="w-full max-w-[280px] bg-emerald-600 text-white px-6 py-4 rounded-2xl text-lg font-bold hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-600/25 mt-4 flex items-center justify-center gap-3"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="size-8 rounded-full border-2 border-white/30 object-cover"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-white text-base font-bold border-2 border-white/30">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                {user.name ? user.name.split(' ')[0] : 'Profile'}
              </button>
              <button
                onClick={async () => {
                  setIsMobileMenuOpen(false);
                  await logout();
                  navigate('/');
                }}
                className="text-xl font-semibold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 mt-4"
              >
                <LogOut className="size-5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/auth'); }}
                className="text-xl font-semibold text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/land_analyzer'); }}
                className="w-full max-w-[280px] bg-emerald-600 text-white px-6 py-4 rounded-2xl text-lg font-bold hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-600/25 mt-4"
              >
                Analyze My Land
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-0 mt-[100px] sm:mt-[116px]">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}
