import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, Heart, Send, Loader } from 'lucide-react';
import { listingsAPI } from '../utils/api';

interface ListingData {
  id: string;
  title: string;
  address: string;
  developable_area_acres?: number;
  buildable_floor_area_sqft?: number;
  land_value?: number;
  terms?: string;
  categories?: string[];
  contacts?: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
  }>;
  description?: {
    typography?: string;
    access_infrastructure?: string;
    opportunity_summary?: string;
    visible_constraints?: string;
    confidence_score?: number;
    confidence_explanation?: string;
  } | null;
}

export default function PublicListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactType, setContactType] = useState<'anonymous' | 'identified'>('identified');
  const [isSaved, setIsSaved] = useState(false);
  
  const [listing, setListing] = useState<ListingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const fetchListing = async () => {
    if (!listingId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await listingsAPI.getById(listingId);
      setListing(data);
    } catch (err: any) {
      console.error('Failed to fetch listing:', err);
      setError(err.message || 'Failed to load listing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = () => {
    // Mock sending request
    alert('Request sent to land owner!');
    setShowContactForm(false);
    setContactMessage('');
    navigate('/requests');
  };

  const handleSave = () => {
    setIsSaved(true);
    navigate('/saved');
  };

  const handleRunAnalysis = () => {
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/browse')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="size-5" />
              Back to Listings
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`size-5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-16 text-center">
              <Loader className="size-12 text-emerald-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading listing...</p>
            </div>
          ) : error || !listing ? (
            <div className="bg-white rounded-xl shadow-lg p-16 text-center">
              <p className="text-red-600 mb-4">{error || 'Listing not found'}</p>
              <button
                onClick={() => navigate('/browse')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Back to Browse
              </button>
            </div>
          ) : (
            <>
              {/* Main Content */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                {/* Map View */}
                <div className="bg-gray-100 h-96 flex items-center justify-center border-b border-gray-200">
                  <div className="text-center">
                    <MapPin className="size-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Interactive Map View</p>
                    <p className="text-sm text-gray-500">{listing.address}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {listing.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="size-4" />
                      <span>{listing.address}</span>
                    </div>
                    {listing.categories && listing.categories.length > 0 && (
                      <div className="flex items-center gap-3">
                        {listing.categories.map((category, index) => (
                          <span 
                            key={index}
                            className="px-4 py-2 bg-emerald-100 text-emerald-800 font-medium rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Developable Area</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {listing.developable_area_acres ? `${listing.developable_area_acres} acres` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Buildable Floor Area</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {listing.buildable_floor_area_sqft ? `${listing.buildable_floor_area_sqft.toLocaleString()} sq ft` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Land Value</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {listing.land_value ? `$${listing.land_value.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Terms</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {listing.terms || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {listing.description?.typography && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Typography</h2>
                      <p className="text-gray-700 leading-relaxed">
                        {listing.description.typography}
                      </p>
                    </div>
                  )}

                  {listing.description?.access_infrastructure && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Access & Infrastructure</h2>
                      <p className="text-gray-700 leading-relaxed">
                        {listing.description.access_infrastructure}
                      </p>
                    </div>
                  )}

                  {listing.description?.opportunity_summary && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">Opportunity Summary</h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {listing.description.opportunity_summary}
                      </p>
                    </div>
                  )}

                  {listing.description?.visible_constraints && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Visible Constraints</h2>
                      <p className="text-gray-700 leading-relaxed">
                        {listing.description.visible_constraints}
                      </p>
                    </div>
                  )}

                  {listing.description?.confidence_score != null && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Analysis Confidence</h2>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-3xl font-bold text-emerald-600">
                              {Math.round(listing.description.confidence_score * 100)}%
                            </p>
                            <p className="text-xs text-gray-500">Confidence Score</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                          className="bg-emerald-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.round(listing.description.confidence_score * 100)}%` }}
                        ></div>
                      </div>
                      {listing.description.confidence_explanation && (
                        <p className="text-gray-700 leading-relaxed">
                          {listing.description.confidence_explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {listing.contacts && listing.contacts.length > 0 && (
                    <div className="mb-8 pb-8 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                      {listing.contacts.map((contact) => (
                        <div key={contact.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                          <p className="font-semibold text-gray-900">{contact.name}</p>
                          {contact.email && <p className="text-gray-600 text-sm">{contact.email}</p>}
                          {contact.phone && <p className="text-gray-600 text-sm">{contact.phone}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    {!showContactForm && (
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="w-full px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <Send className="size-5" />
                        Contact Land Owner
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Collaboration Request</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Contact Preference
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setContactType('identified')}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          contactType === 'identified'
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900 mb-1">Share My Info</p>
                        <p className="text-sm text-gray-600">Owner can see your name and contact info</p>
                      </button>
                      <button
                        onClick={() => setContactType('anonymous')}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          contactType === 'anonymous'
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900 mb-1">Anonymous</p>
                        <p className="text-sm text-gray-600">Communicate through the platform</p>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      rows={6}
                      placeholder="Introduce yourself and explain what you're interested in..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendRequest}
                      className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Send className="size-5" />
                      Send Request
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}