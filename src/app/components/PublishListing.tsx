import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, Edit2, ArrowLeft, Info } from 'lucide-react';

export default function PublishListing() {
  const navigate = useNavigate();

  // Mock data for the listing preview
  const mockListing = {
    title: '50 Acre Prime Agricultural Land',
    description: 'This is a beautiful 50-acre parcel located in the heart of Texas. It features fertile soil, excellent drainage, and direct access to County Road 42. Perfect for immediate agricultural use, sustainable farming, or long-term investment. The property includes a functional well and is fully fenced.',
    sector: 'Agriculture',
    parcel: 'Parcel #98765-TX (Austin, TX)',
    price: '$500,000',
  };

  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePublish = () => {
    setStatus('Published');
    showNotification('Your listing is now live 🎉', 'success');
  };

  const handleSaveDraft = () => {
    setStatus('Draft');
    showNotification('Saved as draft', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[700px]">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review & Publish</h1>
            <p className="mt-2 text-gray-500">Make sure everything looks good before going live</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Listing
          </button>
        </div>

        {/* Notification Alert */}
        {notification && (
          <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 animate-[popIn_0.3s_ease-out] ${
            notification.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className={`text-sm font-medium ${notification.type === 'success' ? 'text-emerald-800' : 'text-blue-800'}`}>
                {notification.message}
              </h3>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Listing Preview Section */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{mockListing.title}</h2>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    status === 'Published' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {status}
                  </span>
                  
                  {/* Sector Badge */}
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {mockListing.sector}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm text-gray-500 mb-1">Asking Price</div>
                <div className="text-xl font-bold text-gray-900">{mockListing.price}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {mockListing.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Parcel Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-200 shrink-0">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{mockListing.parcel}</div>
                    <div className="text-xs text-gray-500">Verified Location</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration & Actions Section */}
          <div className="bg-gray-50 border-t border-gray-100 p-6 md:p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Listing Visibility
              </label>
              
              {/* Status Toggle Segmented Control */}
              <div className="flex bg-gray-200/50 p-1 rounded-lg w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => setStatus('Draft')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    status === 'Draft' 
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Keep as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Published')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    status === 'Published' 
                      ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Set as Published
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {status === 'Draft' 
                  ? 'Your listing will be saved but hidden from the public marketplace.' 
                  : 'Your listing will be instantly visible to all searchers.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveDraft}
                className="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 py-3 px-4 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-sm"
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