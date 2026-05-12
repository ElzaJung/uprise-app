import { ReactNode } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  TrendingUp,
  LayoutDashboard,
  Map,
  ListFilter,
  MessageSquare,
  FlaskConical,
  Heart,
  Settings,
  LogOut,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarLayoutProps {
  children?: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Analyze Land', path: '/land_analyzer' },
    { icon: FileText, label: 'My Analyses', path: '/saved-analyses' },
    { icon: ListFilter, label: 'Browse Listings', path: '/browse' },
    { icon: Map, label: 'My Parcels', path: '/parcels' },
    { icon: Heart, label: 'Saved', path: '/saved' },
    { icon: FlaskConical, label: 'Analysis Queue', path: '/analysis' },
    { icon: MessageSquare, label: 'Requests', path: '/requests' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full bg-gray-50">
      
      {/* Mobile Horizontal Sub-Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-20 w-full overflow-x-auto shadow-sm">
        <nav className="flex items-center gap-2 p-3 min-w-max px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors whitespace-nowrap text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-gray-200 flex-col min-h-[calc(100vh-116px)] sticky top-[116px]">
        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`size-5 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
              <span className="text-sm font-bold text-emerald-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-emerald-600 font-medium">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col min-w-0">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}
