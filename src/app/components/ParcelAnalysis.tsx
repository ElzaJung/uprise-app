import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  MapPin, 
  Share2, 
  Download, 
  MessageSquare, 
  Heart,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';
import { ScoreCard, ConfidenceMeter } from './ui/score-card';
import { SectorBadge, type SectorType } from './ui/sector-badge';

// Mock data
const parcelData = {
  id: 'PCL-ABC123',
  address: '1234 Mountain View Road, Green County, CA 95000',
  acres: 45.5,
  owner: 'John Smith',
  bestUse: 'energy' as SectorType,
  viabilityScore: 85,
  confidence: 92,
};

const sectorAnalyses = [
  {
    sector: 'energy' as SectorType,
    score: 85,
    confidence: 92,
    reasons: [
      'Excellent solar exposure (6.5 peak sun hours/day)',
      'Proximity to high-voltage transmission lines (0.3 miles)',
      'Favorable zoning for utility-scale solar',
      'Minimal shading from topography',
    ],
    constraints: [
      'Seasonal wildlife migration corridor requires mitigation',
    ],
    timeToFeasibility: '6-12 months',
  },
  {
    sector: 'agriculture' as SectorType,
    score: 72,
    confidence: 88,
    reasons: [
      'Good soil quality (Class II agricultural land)',
      'Access to water rights',
      'Moderate climate suitable for various crops',
    ],
    constraints: [
      'Slope on eastern portion limits cultivation area',
      'Distance to markets (45 miles)',
    ],
    timeToFeasibility: '3-6 months',
  },
  {
    sector: 'community' as SectorType,
    score: 58,
    confidence: 75,
    reasons: [
      'Located in growing population area',
      'Road access available',
    ],
    constraints: [
      'Current zoning requires variance for residential',
      'Limited utility infrastructure',
      'Environmental impact study required',
    ],
    timeToFeasibility: '18-24 months',
  },
  {
    sector: 'tourism' as SectorType,
    score: 65,
    confidence: 80,
    reasons: [
      'Scenic mountain views',
      'Proximity to national park (12 miles)',
      'Growing tourism market in region',
    ],
    constraints: [
      'Seasonal accessibility concerns',
      'Infrastructure development needed',
    ],
    timeToFeasibility: '12-18 months',
  },
];

export default function ParcelAnalysis() {
  const { parcelId } = useParams();
  const navigate = useNavigate();
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set(['energy']));
  const [activeMapLayer, setActiveMapLayer] = useState<string>('satellite');

  const toggleSector = (sector: string) => {
    const newExpanded = new Set(expandedSectors);
    if (newExpanded.has(sector)) {
      newExpanded.delete(sector);
    } else {
      newExpanded.add(sector);
    }
    setExpandedSectors(newExpanded);
  };

  const mapLayers = ['satellite', 'zoning', 'flood-risk', 'slope', 'roads'];

  return (
      <div className="h-full overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{parcelData.id}</h1>
                  <SectorBadge sector={parcelData.bestUse} withIcon />
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="size-4" />
                  <p>{parcelData.address}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{parcelData.acres} acres</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Heart className="size-4" />
                  Save
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Share2 className="size-4" />
                  Share
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download className="size-4" />
                  Export PDF
                </button>
                <button 
                  onClick={() => navigate(`/listing/draft/${parcelId}`)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="size-4" />
                  Contact Owner
                </button>
              </div>
            </div>

            {/* Viability Score */}
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Viability Score</p>
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-bold text-emerald-600">{parcelData.viabilityScore}</div>
                  <div className="text-sm text-gray-500">/ 100</div>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <ConfidenceMeter confidence={parcelData.confidence} size="lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="size-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Key Strengths</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Excellent solar exposure</li>
                    <li>• Near transmission lines</li>
                    <li>• Good soil quality</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="size-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Key Constraints</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Wildlife migration corridor</li>
                    <li>• Zoning variance needed</li>
                    <li>• Infrastructure development</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Best Path Forward</h3>
                  <p className="text-sm text-gray-600 mb-1">Energy Development (Solar)</p>
                  <p className="text-sm text-gray-500">Est. Timeline: 6-12 months</p>
                </div>
              </div>
            </div>
          </div>

          {/* Use-Case Analysis */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sector Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {sectorAnalyses.map((analysis) => (
                <ScoreCard
                  key={analysis.sector}
                  title={analysis.sector.charAt(0).toUpperCase() + analysis.sector.slice(1)}
                  score={analysis.score}
                  confidence={analysis.confidence}
                  variant={
                    analysis.score >= 80 ? 'success' :
                    analysis.score >= 60 ? 'default' :
                    analysis.score >= 40 ? 'warning' : 'danger'
                  }
                />
              ))}
            </div>

            {/* Detailed Breakdowns */}
            <div className="space-y-4">
              {sectorAnalyses.map((analysis) => {
                const isExpanded = expandedSectors.has(analysis.sector);
                return (
                  <div key={analysis.sector} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleSector(analysis.sector)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <SectorBadge sector={analysis.sector} withIcon />
                        <span className="font-semibold text-gray-900">
                          Why this score? ({analysis.score}/100)
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="size-5 text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <CheckCircle className="size-5 text-emerald-600" />
                              Advantages
                            </h4>
                            <ul className="space-y-2">
                              {analysis.reasons.map((reason, index) => (
                                <li key={index} className="text-sm text-gray-600 flex gap-2">
                                  <span className="text-emerald-600 mt-0.5">✓</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <AlertTriangle className="size-5 text-amber-600" />
                              Constraints
                            </h4>
                            <ul className="space-y-2">
                              {analysis.constraints.map((constraint, index) => (
                                <li key={index} className="text-sm text-gray-600 flex gap-2">
                                  <span className="text-amber-600 mt-0.5">!</span>
                                  <span>{constraint}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-900">Time to Feasibility:</span>{' '}
                            {analysis.timeToFeasibility}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map View */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location & Layers</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Layer Controls */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <Layers className="size-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 mr-4">Map Layers:</span>
                  <div className="flex flex-wrap gap-2">
                    {mapLayers.map((layer) => (
                      <button
                        key={layer}
                        onClick={() => setActiveMapLayer(layer)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          activeMapLayer === layer
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {layer.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mock Map */}
              <div className="h-96 bg-gradient-to-br from-green-100 via-emerald-50 to-blue-100 flex items-center justify-center relative">
                <div className="text-center">
                  <p className="text-gray-600 font-medium">Satellite View</p>
                  <p className="text-sm text-gray-500 mt-1">Layer: {activeMapLayer}</p>
                </div>
                {/* Mock parcel boundary */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-4 border-emerald-600 rounded-lg bg-emerald-600/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Regulatory & Compliance</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Current Zoning</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Classification</p>
                      <p className="font-medium text-gray-900">Agricultural/Rural Residential (AR-5)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Permitted Uses</p>
                      <ul className="text-sm text-gray-900 space-y-1 mt-1">
                        <li>• Agriculture</li>
                        <li>• Single-family residential</li>
                        <li>• Utility-scale renewable energy (conditional)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Required Steps</h3>
                  <div className="space-y-3">
                    {[
                      { step: 'Conditional Use Permit', status: 'Required' },
                      { step: 'Environmental Impact Report', status: 'Recommended' },
                      { step: 'Wildlife Mitigation Plan', status: 'Required' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.step}</p>
                          <p className="text-xs text-gray-600">{item.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
