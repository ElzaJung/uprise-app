import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Home, Search, Shield, ArrowLeft } from 'lucide-react';

export default function RoleSelect() {
  const navigate = useNavigate();
  const { user, loading, setUserRole } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'owner') {
        navigate('/dashboard/owner', { replace: true });
      } else if (user.role === 'searcher') {
        navigate('/dashboard/searcher', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleRoleSelect = async (role: 'owner' | 'searcher' | 'admin') => {
    try {
      await setUserRole(role);
      if (role === 'owner') {
        navigate('/onboarding/owner');
      } else if (role === 'searcher') {
        navigate('/onboarding/searcher');
      } else {
        navigate('/dashboard/admin');
      }
    } catch (error) {
      console.error('Error setting role:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Path</h1>
          <p className="text-xl text-gray-600">
            How would you like to use Uprise.ai?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Land Owner */}
          <button
            onClick={() => handleRoleSelect('owner')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
              <Home className="size-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Land Owner</h2>
            <p className="text-gray-600 mb-4">
              Analyze your land, discover opportunities, and create listings to attract collaborators.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                AI-powered land analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Create public listings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                Manage collaboration requests
              </li>
            </ul>
          </button>

          {/* Land Searcher */}
          <button
            onClick={() => handleRoleSelect('searcher')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
              <Search className="size-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Land Searcher</h2>
            <p className="text-gray-600 mb-4">
              Browse available land, filter by opportunity type, and connect with land owners.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                Browse analyzed parcels
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                Filter by use case
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                Contact land owners
              </li>
            </ul>
          </button>

          {/* Admin */}
          <button
            onClick={() => handleRoleSelect('admin')}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-left group relative"
          >
            <div className="absolute top-4 right-4 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              Invite Only
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
              <Shield className="size-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Admin</h2>
            <p className="text-gray-600 mb-4">
              Review analysis requests, manage users, and moderate the platform.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                Review AI analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                User management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                Platform moderation
              </li>
            </ul>
          </button>
        </div>
      </div>
    </div>
  );
}