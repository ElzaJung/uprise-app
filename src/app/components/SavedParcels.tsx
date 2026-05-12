import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, MapPin, Trash2, Eye } from 'lucide-react';
import { SectorBadge, type SectorType } from './ui/sector-badge';

const savedParcels = [
  {
    id: 'PCL-ABC123',
    address: '1234 Mountain View Road, Green County, CA',
    acres: 45.5,
    viabilityScore: 85,
    bestUse: 'energy' as SectorType,
    savedDate: '2024-03-15',
    notes: 'Excellent solar potential',
  },
  {
    id: 'PCL-DEF456',
    address: '567 Valley Creek Lane, Blue County, OR',
    acres: 120.3,
    viabilityScore: 72,
    bestUse: 'agriculture' as SectorType,
    savedDate: '2024-03-12',
    notes: 'Good for organic farming',
  },
  {
    id: 'PCL-GHI789',
    address: '890 Coastal Highway, Pacific County, WA',
    acres: 28.7,
    viabilityScore: 68,
    bestUse: 'tourism' as SectorType,
    savedDate: '2024-03-10',
    notes: 'Ocean views, recreation potential',
  },
];

export default function SavedParcels() {
  const navigate = useNavigate();
  const [parcels, setParcels] = useState(savedParcels);

  const handleRemove = (parcelId: string) => {
    setParcels(parcels.filter(p => p.id !== parcelId));
  };

  return (
      <div className="h-full overflow-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Parcels</h1>
            <p className="text-gray-600">Your shortlist of interesting land opportunities</p>
          </div>

          {parcels.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="size-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved parcels yet</h2>
              <p className="text-gray-600 mb-6">
                Browse listings and save parcels you're interested in
              </p>
              <button
                onClick={() => navigate('/browse')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Browse Listings
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-mono text-gray-600 mb-1">{parcel.id}</p>
                        <div className="flex items-center gap-2 text-gray-900 mb-2">
                          <MapPin className="size-4 flex-shrink-0" />
                          <p className="text-sm">{parcel.address}</p>
                        </div>
                        <p className="text-sm text-gray-600">{parcel.acres} acres</p>
                      </div>
                      <button
                        onClick={() => handleRemove(parcel.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                        title="Remove from saved"
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </button>
                    </div>
                    <SectorBadge sector={parcel.bestUse} withIcon />
                  </div>

                  {/* Score */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Viability Score</span>
                      <span className="text-2xl font-bold text-emerald-600">{parcel.viabilityScore}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${parcel.viabilityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  {parcel.notes && (
                    <div className="px-6 py-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 italic">"{parcel.notes}"</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="p-6 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Saved {new Date(parcel.savedDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => navigate(`/parcel/${parcel.id}`)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      <Eye className="size-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
