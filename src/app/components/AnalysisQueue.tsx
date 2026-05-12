import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function AnalysisQueue() {
  const [reviewStep, setReviewStep] = useState<'review' | 'editing' | 'approved'>('review');
  const [aiOutput, setAiOutput] = useState({
    energy: 'High solar potential due to southern exposure and minimal tree coverage. Estimated capacity: 500kW.',
    agriculture: 'Soil quality: Good for row crops. pH 6.5, well-drained loamy soil.',
    community: 'Zoning allows for residential development. Infrastructure nearby.',
    tourism: 'Scenic views, access to hiking trails. Eco-tourism potential.',
  });
  const navigate = useNavigate();

  const handleApprove = () => {
    setReviewStep('approved');
    setTimeout(() => {
      navigate('/land_analyzer');
    }, 2000);
  };

  const handleEdit = () => {
    setReviewStep('editing');
  };

  const handleSaveEdits = () => {
    setReviewStep('review');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/land_analyzer')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="size-5" />
            Back to Admin Console
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {reviewStep === 'approved' ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Approved!</h2>
            <p className="text-gray-600">
              The analysis is now available to the land owner and will be included in their listing.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="size-6 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Review AI Analysis</h1>
                  <p className="text-gray-600">456 Oak Ave, City, State</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  Pending Review
                </span>
                <span className="text-sm text-gray-500">Requested 2 hours ago by Bob Wilson</span>
              </div>
            </div>

            {/* AI Output */}
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>⚡</span> Energy Potential
                </h3>
                {reviewStep === 'editing' ? (
                  <textarea
                    value={aiOutput.energy}
                    onChange={(e) => setAiOutput({ ...aiOutput, energy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{aiOutput.energy}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>🌾</span> Agriculture Potential
                </h3>
                {reviewStep === 'editing' ? (
                  <textarea
                    value={aiOutput.agriculture}
                    onChange={(e) => setAiOutput({ ...aiOutput, agriculture: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{aiOutput.agriculture}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>🏘️</span> Community Development
                </h3>
                {reviewStep === 'editing' ? (
                  <textarea
                    value={aiOutput.community}
                    onChange={(e) => setAiOutput({ ...aiOutput, community: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{aiOutput.community}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>🏞️</span> Tourism Potential
                </h3>
                {reviewStep === 'editing' ? (
                  <textarea
                    value={aiOutput.tourism}
                    onChange={(e) => setAiOutput({ ...aiOutput, tourism: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{aiOutput.tourism}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {reviewStep === 'editing' ? (
                <>
                  <button
                    onClick={() => setReviewStep('review')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdits}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Edit Analysis
                  </button>
                  <button
                    className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center gap-2"
                  >
                    <XCircle className="size-5" />
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="size-5" />
                    Approve & Publish
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}