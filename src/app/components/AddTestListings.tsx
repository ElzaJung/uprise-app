import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { listingsAPI } from '../utils/api';

const TEST_LISTINGS = [
  {
    title: 'Prime Solar Development Land',
    address: '123 Main St, Austin, TX',
    developable_area_acres: 50,
    buildable_floor_area_sqft: 2178000,
    land_value: 500000,
    terms: 'Cash only, 30-day close preferred',
    status: 'published',
    sectors: ['energy', 'agriculture'],
    description: 'Excellent opportunity for solar farm development. South-facing land with minimal shading, optimal for large-scale solar installation.'
  },
  {
    title: 'Scenic Tourism Property',
    address: '789 Pine Rd, Denver, CO',
    developable_area_acres: 100,
    buildable_floor_area_sqft: 4356000,
    land_value: 1200000,
    terms: 'Owner financing available',
    status: 'published',
    sectors: ['tourism', 'community'],
    description: 'Stunning mountain views with access to hiking trails. Perfect for eco-tourism resort or outdoor recreation facility.'
  },
  {
    title: 'Agricultural Excellence',
    address: '456 Farm Lane, Fresno, CA',
    developable_area_acres: 75,
    buildable_floor_area_sqft: 3267000,
    land_value: 850000,
    terms: 'Flexible terms, seller motivated',
    status: 'published',
    sectors: ['agriculture'],
    description: 'Rich soil, established irrigation system. Ideal for organic farming or specialized crops.'
  },
  {
    title: 'Community Wind Farm',
    address: '321 Gusty Blvd, Chicago, IL',
    developable_area_acres: 200,
    buildable_floor_area_sqft: 8712000,
    land_value: 2500000,
    terms: 'Negotiable, open to partnerships',
    status: 'published',
    sectors: ['energy', 'community'],
    description: 'Consistent wind patterns year-round. Zoning approved for wind turbine installation.'
  },
  {
    title: 'Urban Mixed-Use Development Site',
    address: '555 Downtown Ave, Seattle, WA',
    developable_area_acres: 5,
    buildable_floor_area_sqft: 217800,
    land_value: 3200000,
    terms: 'Cash or conventional financing',
    status: 'published',
    sectors: ['community'],
    description: 'Prime downtown location. Perfect for mixed-use residential and commercial development.'
  },
];

export default function AddTestListings() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<{ success: boolean; title: string; error?: string }[]>([]);

  const handleCreateListings = async () => {
    setIsCreating(true);
    setResults([]);

    const newResults: { success: boolean; title: string; error?: string }[] = [];

    for (const listing of TEST_LISTINGS) {
      try {
        await listingsAPI.create(listing);
        newResults.push({ success: true, title: listing.title });
      } catch (error: any) {
        newResults.push({
          success: false,
          title: listing.title,
          error: error.message
        });
      }
    }

    setResults(newResults);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[800px]">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add Test Listings</h1>
          <p className="mt-2 text-gray-500">
            This utility creates sample listings in the database for testing purposes.
          </p>
        </div>

        {/* Create Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <button
            onClick={handleCreateListings}
            disabled={isCreating}
            className="w-full px-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-5 h-5" />
            {isCreating ? 'Creating Listings...' : `Create ${TEST_LISTINGS.length} Test Listings`}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Results</h2>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${result.success
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                    }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${result.success ? 'text-emerald-900' : 'text-red-900'}`}>
                      {result.title}
                    </p>
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {results.every(r => r.success) && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate('/browse')}
                  className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  View Listings →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Listing Preview */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Listings to Create</h2>
          <div className="space-y-4">
            {TEST_LISTINGS.map((listing, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{listing.title}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div><span className="font-semibold">Address:</span> {listing.address}</div>
                  <div><span className="font-semibold">Acres:</span> {listing.developable_area_acres}</div>
                  <div><span className="font-semibold">Value:</span> ${listing.land_value.toLocaleString()}</div>
                  <div><span className="font-semibold">Status:</span> {listing.status}</div>
                  <div className="col-span-2">
                    <span className="font-semibold">Sectors:</span> {listing.sectors.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
