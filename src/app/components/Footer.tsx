import { Link } from 'react-router';
import { TrendingUp, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 py-16 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6 lg:pr-8">
            <Link to="/" className="flex items-center gap-2.5 text-white group w-max">
              <div className="bg-emerald-600 p-1.5 rounded-lg group-hover:bg-emerald-500 transition-colors shadow-sm">
                <TrendingUp className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Uprise.ai</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Unlocking land potential through AI-powered analysis and collaboration.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                <Linkedin className="size-4" fill="currentColor" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                <Twitter className="size-4" fill="currentColor" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide">Platform</h3>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li>
                <Link to="/auth" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Analyze Land
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link to="/land_analyzer" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide">Company</h3>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide">Legal</h3>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800/60 flex flex-col md:flex-row items-center justify-center">
          <p className="text-sm text-gray-500 font-medium">
            &copy; 2026 Uprise.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
