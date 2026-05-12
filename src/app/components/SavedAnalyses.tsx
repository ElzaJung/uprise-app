import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, Image as ImageIcon, Trash2, Calendar, MapPin } from 'lucide-react';
import { landAnalysisAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Analysis {
  id: string;
  imageUrl: string;
  analysis: {
    location: string;
    acres: number;
    zoning: string;
    sectors: any[];
    landValue: number;
  };
  createdAt: string;
}

export default function SavedAnalyses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    } else {
      navigate('/auth');
    }
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      setIsLoading(true);
      const data = await landAnalysisAPI.getUserAnalyses();
      setAnalyses(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching analyses:', err);
      setError(err.message || 'Failed to load analyses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;

    try {
      await landAnalysisAPI.delete(id);
      setAnalyses(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      alert('Failed to delete analysis: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-slate-600 font-medium">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/land_analyzer')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="size-5" />
            Back to Analyzer
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Saved Analyses</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all your land analysis reports
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-600 mb-6">
              Upload a land image to get started with AI-powered analysis
            </p>
            <button
              onClick={() => navigate('/land_analyzer')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors"
            >
              Analyze Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {analysis.imageUrl ? (
                    <img
                      src={analysis.imageUrl}
                      alt="Land"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                        {analysis.analysis.location}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{analysis.analysis.acres} acres</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Top Sector */}
                  {analysis.analysis.sectors && analysis.analysis.sectors[0] && (
                    <div className="mb-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{analysis.analysis.sectors[0].icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-emerald-800">
                            Top Opportunity
                          </p>
                          <p className="text-sm font-bold text-emerald-900">
                            {analysis.analysis.sectors[0].name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value</span>
                      <span className="font-bold text-gray-900">
                        ${(analysis.analysis.landValue / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zoning</span>
                      <span className="font-medium text-gray-900">
                        {analysis.analysis.zoning}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 pt-2 border-t border-gray-100">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
