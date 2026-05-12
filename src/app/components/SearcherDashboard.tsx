import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Heart, Send, Search } from 'lucide-react';
import SidebarLayout from './ui/sidebar-layout';

const SAVED_PARCELS = [
  {
    id: '1',
    address: '123 Main St, City, State',
    sectors: ['energy', 'agriculture'],
    savedDate: '3 days ago',
  },
  {
    id: '2',
    address: '789 Pine Rd, City, State',
    sectors: ['tourism', 'community'],
    savedDate: '1 week ago',
  },
];

const SENT_REQUESTS = [
  {
    id: '1',
    parcelId: '1',
    parcelAddress: '123 Main St, City, State',
    sentDate: '2 days ago',
    status: 'pending',
  },
];

export default function SearcherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="w-full h-full max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <button
          onClick={() => navigate('/browse')}
          className="p-5 sm:p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left group border-2 border-dashed border-emerald-300"
        >
          <Search className="size-6 sm:size-8 text-emerald-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Browse Listings</h3>
          <p className="text-xs sm:text-sm text-gray-600">Discover new land opportunities</p>
        </button>

        <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Heart className="size-6 sm:size-8 text-emerald-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Saved Parcels</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{SAVED_PARCELS.length}</p>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Send className="size-6 sm:size-8 text-emerald-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Sent Requests</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{SENT_REQUESTS.length}</p>
        </div>
      </div>

      {/* Saved Parcels */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Saved Parcels</h2>
        <div className="space-y-4">
          {SAVED_PARCELS.map((parcel) => (
            <div
              key={parcel.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all bg-gray-50/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{parcel.address}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {parcel.sectors.map((sector) => (
                      <span
                        key={sector}
                        className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full capitalize"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/listing/${parcel.id}`)}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold shadow-sm"
                >
                  View Details
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">Saved {parcel.savedDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sent Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Sent Requests</h2>
        <div className="space-y-4">
          {SENT_REQUESTS.map((request) => (
            <div
              key={request.id}
              className="p-4 border border-gray-200 rounded-xl bg-gray-50/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{request.parcelAddress}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Sent {request.sentDate}</p>
                </div>
                <span className="w-fit px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}