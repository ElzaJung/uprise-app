import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Save, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ListingData {
  title: string;
  description: string;
  location: string;
  sector: string;
  size: string;
  status: 'Draft' | 'Published';
}

export default function EditListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Initialize with some default or fetched data
  const [formData, setFormData] = useState<ListingData>({
    title: 'Sunny Valley Plot',
    description: 'A beautiful piece of land perfect for agricultural or renewable energy projects. Features great sun exposure and easy road access.',
    location: 'Austin, TX',
    sector: 'agriculture',
    size: '150 Acres',
    status: 'Draft',
  });

  // Mock fetching data based on listingId
  useEffect(() => {
    // In a real app, you would fetch the listing data from your backend/KV store here
    // using the listingId
    if (listingId) {
      // Simulate API call
      // setTimeout(() => {
      //   setFormData(fetchedData);
      // }, 500);
    }
  }, [listingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset success message when user starts typing again
    if (success) setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call to save data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save listing', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the previous page, typically dashboard or listings
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 animate-[popIn_0.3s_ease-out]">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-emerald-800">Changes saved successfully</h3>
              <p className="text-sm text-emerald-600 mt-1">Your listing has been updated with the latest information.</p>
            </div>
            <button 
              onClick={() => setSuccess(false)}
              className="ml-auto text-emerald-500 hover:text-emerald-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Listing Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="e.g. 50 Acre Prime Agricultural Land"
              />
            </div>

            {/* Two Column Row: Location & Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="City, State"
                />
              </div>
              
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="e.g. 150 Acres"
                />
              </div>
            </div>

            {/* Two Column Row: Sector & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Sector
                </label>
                <div className="relative">
                  <select
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 appearance-none"
                  >
                    <option value="" disabled>Select a sector</option>
                    <option value="agriculture">Agriculture & Farming</option>
                    <option value="renewable">Renewable Energy</option>
                    <option value="commercial">Commercial Development</option>
                    <option value="residential">Residential Development</option>
                    <option value="conservation">Conservation</option>
                    <option value="industrial">Industrial</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 appearance-none"
                  >
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Published">Published (Public)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-y min-h-[120px]"
                placeholder="Describe the property, its features, topography, and potential uses..."
              />
              <p className="mt-2 text-sm text-gray-500">
                A detailed description helps potential buyers understand the full value of your land.
              </p>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}