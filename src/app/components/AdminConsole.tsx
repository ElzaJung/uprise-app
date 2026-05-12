import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, MapPin, ClipboardList, TrendingUp, ArrowLeft } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'searcher', status: 'active' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'owner', status: 'pending' },
];

const MOCK_PARCELS = [
  { id: '1', address: '123 Main St, City, State', owner: 'John Doe', status: 'analyzed' },
  { id: '2', address: '456 Oak Ave, City, State', owner: 'Bob Wilson', status: 'pending' },
];

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<'users' | 'parcels' | 'queue'>('queue');
  const navigate = useNavigate();

  return (
    <div className="w-full h-full max-w-6xl mx-auto bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 rounded-3xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-sm sm:text-base font-medium text-gray-600">Total Users</span>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="size-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{MOCK_USERS.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-sm sm:text-base font-medium text-gray-600">Total Parcels</span>
            <div className="p-2 bg-purple-50 rounded-lg">
              <MapPin className="size-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{MOCK_PARCELS.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-sm sm:text-base font-medium text-gray-600">Analysis Queue</span>
            <div className="p-2 bg-purple-50 rounded-lg">
              <ClipboardList className="size-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">1</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="border-b border-gray-100 overflow-x-auto no-scrollbar">
          <div className="flex w-max min-w-full">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-6 py-4 text-sm sm:text-base font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'queue'
                  ? 'border-purple-600 text-purple-700 bg-purple-50/30'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              Analysis Queue
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 text-sm sm:text-base font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-700 bg-purple-50/30'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('parcels')}
              className={`px-6 py-4 text-sm sm:text-base font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'parcels'
                  ? 'border-purple-600 text-purple-700 bg-purple-50/30'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              Parcels
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {activeTab === 'queue' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Pending Analysis Requests</h2>
                <button
                  onClick={() => navigate('/analysis-queue')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold shadow-sm hover:shadow-purple-600/20"
                >
                  Review Queue
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 sm:p-5 bg-purple-50/50 border border-purple-100 rounded-xl hover:border-purple-200 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">456 Oak Ave, City, State</p>
                      <p className="text-sm text-gray-600 mt-1">Owner: <span className="font-medium text-gray-900">Bob Wilson</span></p>
                    </div>
                    <span className="w-fit px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full tracking-wide uppercase">
                      Pending Review
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 pt-3 border-t border-purple-100/50 mt-3">Requested: 2 hours ago</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">User Management</h2>
              <div className="space-y-3">
                {MOCK_USERS.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 sm:p-5 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full capitalize">
                          {user.role}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'parcels' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">All Parcels</h2>
              <div className="space-y-3">
                {MOCK_PARCELS.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="p-4 sm:p-5 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{parcel.address}</p>
                        <p className="text-sm text-gray-500 mt-1">Owner: <span className="font-medium text-gray-900">{parcel.owner}</span></p>
                      </div>
                      <span
                        className={`w-fit px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${
                          parcel.status === 'analyzed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {parcel.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}