import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, Upload } from 'lucide-react';

const SECTORS = [
  { id: 'energy', name: 'Energy', icon: '⚡' },
  { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
  { id: 'community', name: 'Community', icon: '🏘️' },
  { id: 'tourism', name: 'Tourism', icon: '🏞️' },
];

export default function ListingDraft() {
  const { parcelId } = useParams();
  const navigate = useNavigate();
  const [listingData, setListingData] = useState({
    title: '',
    description: '',
    size: '',
    price: '',
    selectedSectors: [] as string[],
  });

  const toggleSector = (sectorId: string) => {
    setListingData((prev) => ({
      ...prev,
      selectedSectors: prev.selectedSectors.includes(sectorId)
        ? prev.selectedSectors.filter((id) => id !== sectorId)
        : [...prev.selectedSectors, sectorId],
    }));
  };

  const handlePublish = () => {
    navigate(`/listing/${parcelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/land_analyzer')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="size-5" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Listing</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="size-4" />
              <span>123 Main St, City, State</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Title
              </label>
              <input
                type="text"
                value={listingData.title}
                onChange={(e) => setListingData({ ...listingData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="e.g., Prime Solar Development Land"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={listingData.description}
                onChange={(e) => setListingData({ ...listingData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                rows={6}
                placeholder="Describe your land, its potential uses, and what you're looking for in a collaborator..."
              />
            </div>

            {/* Size & Price */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Land Size (acres)
                </label>
                <input
                  type="text"
                  value={listingData.size}
                  onChange={(e) => setListingData({ ...listingData, size: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price / Terms (Optional)
                </label>
                <input
                  type="text"
                  value={listingData.price}
                  onChange={(e) => setListingData({ ...listingData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="e.g., Lease or partnership"
                />
              </div>
            </div>

            {/* Use Case Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Case Tags
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SECTORS.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => toggleSector(sector.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      listingData.selectedSectors.includes(sector.id)
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mr-2">{sector.icon}</span>
                    <span className="font-medium text-gray-900">{sector.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload className="size-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Click to upload photos</p>
                <p className="text-sm text-gray-500">or drag and drop</p>
              </div>
            </div>

            {/* Analysis Preview (if analyzed) */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">AI Analysis Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">⚡ Energy</p>
                  <p className="text-sm text-gray-600">High solar potential - 500kW capacity</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">🌾 Agriculture</p>
                  <p className="text-sm text-gray-600">Good soil for row crops</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/land_analyzer')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Publish Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}