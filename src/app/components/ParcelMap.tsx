import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, MapPin, Info } from 'lucide-react';

export default function ParcelMap() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [selectedParcel, setSelectedParcel] = useState<any>(null);

  const handleSearch = () => {
    // Mock parcel selection
    setSelectedParcel({
      id: 'PCL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      address: address || '123 Example Road, County, State',
      acres: 45.5,
      lat: 34.0522,
      lng: -118.2437,
    });
  };

  const handleAnalyze = () => {
    if (selectedParcel) {
      navigate(`/analysis/new?parcelId=${selectedParcel.id}`);
    }
  };

  return (
    <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Parcel</h1>
          <p className="text-gray-600">Search for an address or select a parcel on the map</p>
        </div>

        <div className="flex-1 flex">
          {/* Map Area */}
          <div className="flex-1 relative bg-gray-100">
            {/* Search Bar */}
            <div className="absolute top-6 left-6 right-6 z-10">
              <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Enter parcel address..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    <Search className="size-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Mock Map */}
            <div className="w-full h-full bg-gradient-to-br from-green-100 via-emerald-50 to-blue-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="size-12 text-emerald-600" />
                </div>
                <p className="text-gray-600 font-medium">Interactive map view</p>
                <p className="text-sm text-gray-500 mt-1">Click or search to select a parcel</p>
              </div>

              {/* Mock parcel overlay */}
              {selectedParcel && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-emerald-600 border-dashed rounded-lg bg-emerald-600/10" />
                </div>
              )}
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-2 space-y-2">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded text-gray-700 font-bold">
                +
              </button>
              <div className="border-t border-gray-200" />
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded text-gray-700 font-bold">
                −
              </button>
            </div>
          </div>

          {/* Sidebar Panel */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Parcel Information</h2>
              <p className="text-sm text-gray-600">Review details before requesting analysis</p>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {selectedParcel ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Parcel ID</label>
                    <p className="text-gray-900 font-mono">{selectedParcel.id}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
                    <p className="text-gray-900">{selectedParcel.address}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Size</label>
                    <p className="text-gray-900">{selectedParcel.acres} acres</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Coordinates</label>
                    <p className="text-gray-600 text-sm font-mono">
                      {selectedParcel.lat}, {selectedParcel.lng}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">What's Next?</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Request an AI-powered analysis to discover your parcel's potential across energy, 
                          agriculture, community, and tourism sectors.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    Request Analysis
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="size-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No parcel selected</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Search for an address or click on the map to select a parcel
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
