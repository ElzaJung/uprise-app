import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, X } from 'lucide-react';

interface ListingFormData {
  title: string;
  description: string;
  sector: string;
  status: 'Draft' | 'Published';
  parcel: string;
  price: string;
}

export default function CreateListing() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    sector: '',
    status: 'Draft',
    parcel: '',
    price: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation: Title and Description are required
  const isFormValid = formData.title.trim() !== '' && formData.description.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (showSuccess) setShowSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    
    // Log data to console as requested
    console.log('Listing Form Data Submitted:', formData);

    // Simulate save
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[600px]">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Listing</h1>
          <p className="mt-2 text-gray-500">Describe your land opportunity</p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 animate-[popIn_0.3s_ease-out]">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-emerald-800">Listing saved successfully</h3>
              <p className="text-sm text-emerald-600 mt-1">Your listing data has been saved.</p>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="ml-auto text-emerald-500 hover:text-emerald-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. 50 Acre Prime Agricultural Land"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Detailed description of the opportunity..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-y"
              />
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Sector */}
              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                  Sector
                </label>
                <div className="relative">
                  <select
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 appearance-none"
                  >
                    <option value="" disabled>Select sector</option>
                    <option value="Energy">Energy</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Community">Community</option>
                    <option value="Tourism">Tourism</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 appearance-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Parcel */}
              <div>
                <label htmlFor="parcel" className="block text-sm font-medium text-gray-700 mb-2">
                  Parcel
                </label>
                <input
                  type="text"
                  id="parcel"
                  name="parcel"
                  value={formData.parcel}
                  onChange={handleChange}
                  placeholder="e.g. Parcel ID or Name"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Price / Budget */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price or Budget (Optional)
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. $500,000"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm"
              >
                {isSubmitting ? 'Saving...' : 'Save Listing'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}