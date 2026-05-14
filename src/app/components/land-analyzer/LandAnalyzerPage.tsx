import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Upload,
  MapPin,
  Zap,
  Leaf,
  Wind,
  Droplets,
  ArrowRight,
  Loader2,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Building,
  Compass,
  Layers,
  ExternalLink,
  Sun,
  Image as ImageIcon,
  X,
  Home,
  Globe,
  Save
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { landAnalysisAPI, aiAnalyzerAPI } from '../../utils/api';

type AnalysisState = 'idle' | 'analyzing' | 'complete';
type AnalyzerType = 'solar' | 'agriculture' | 'building';

interface AnalysisResult {
  type: AnalyzerType;
  location: string;
  report: any;
}

export default function LandAnalyzerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [selectedAnalyzer, setSelectedAnalyzer] = useState<AnalyzerType>('solar');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;

    setAnalysisState('analyzing');
    setProgress(0);
    setSaveError(null);
    setAnalysisError(null);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.floor(Math.random() * 8) + 3, 95));
    }, 500);

    try {
      console.log('Starting AI analysis for:', selectedAnalyzer);

      const report = await aiAnalyzerAPI.analyze(uploadedImage, selectedAnalyzer, location || undefined);

      console.log('AI analysis complete:', report);

      const estimatedLocation = location || 'Location not specified';

      const result: AnalysisResult = {
        type: selectedAnalyzer,
        location: estimatedLocation,
        report
      };

      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      setAnalysisState('complete');

      // Automatically save to database
      saveAnalysisToDatabase(result);

    } catch (error: any) {
      console.error('AI Analysis error:', error);
      clearInterval(progressInterval);
      setProgress(0);
      setAnalysisError(error.message || 'AI analysis failed. Please try again.');
      setAnalysisState('idle');
    }
  };

  const saveAnalysisToDatabase = async (result: AnalysisResult) => {
    if (!uploadedImage) return;

    try {
      setIsSaving(true);
      console.log('Saving analysis to database...');

      const response = await landAnalysisAPI.create(uploadedImage, result);

      console.log('Analysis saved successfully:', response);
      setSavedAnalysisId(response.analysisId);
      setSaveError(null);
    } catch (error: any) {
      console.error('Error saving analysis:', error);
      setSaveError(error.message || 'Failed to save analysis');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setUploadedImage(null);
    setLocation('');
    setProgress(0);
    setAnalysisResult(null);
    setSavedAnalysisId(null);
    setSaveError(null);
    setAnalysisError(null);
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const createListing = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/listing/create');
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] md:flex-row bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden font-sans relative">

      {/* Left Panel - Input & Results */}
      <div className="w-full md:w-[420px] lg:w-[480px] bg-white shadow-[8px_0_30px_rgba(0,0,0,0.03)] z-20 flex flex-col relative">
        <div className="p-6 md:p-8 border-b border-gray-100 flex-shrink-0 bg-white z-10">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Land Analyzer</h1>
          <p className="text-sm text-slate-500 font-medium">Upload an image of your land and get instant AI-powered analysis.</p>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            {/* IDLE STATE */}
            {analysisState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 md:p-8"
              >
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Upload Land Image</label>

                    {!uploadedImage ? (
                      <label className="w-full h-64 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">Click to upload</p>
                        <p className="text-xs text-slate-500">Aerial view, satellite image, or photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative">
                        <img
                          src={uploadedImage}
                          alt="Uploaded land"
                          className="w-full h-64 object-cover rounded-xl border-2 border-slate-200"
                        />
                        <button
                          onClick={handleReset}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {uploadedImage && (
                    <>
                      {/* Location Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Location (Optional)</label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Austin, TX or Ontario, Canada"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          Providing a location helps the AI generate more accurate regional estimates
                        </p>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-4">
                        <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Compass className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-emerald-800 mb-1">AI-Powered Analysis</h4>
                          <p className="text-xs text-emerald-600/80 leading-relaxed">
                            Our AI analyzes terrain, vegetation, water features, and surrounding infrastructure to determine optimal use cases.
                          </p>
                        </div>
                      </div>

                      {analysisError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-bold text-red-800 mb-1">Analysis Error</h4>
                              <p className="text-xs text-red-600 leading-relaxed">
                                {analysisError}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleAnalyze}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                      >
                        Analyze This Land with AI
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="mt-8">
                    <label className="text-sm font-bold text-slate-700 mb-3 block">Select Analysis Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'solar', label: 'Solar', icon: Sun },
                        { id: 'agriculture', label: 'Agriculture', icon: Leaf },
                        { id: 'building', label: 'Building', icon: Building }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedAnalyzer(t.id as AnalyzerType)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                            selectedAnalyzer === t.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-emerald-200 bg-white'
                          }`}
                        >
                          <t.icon className={`w-6 h-6 mb-2 ${selectedAnalyzer === t.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className={`text-xs font-bold ${selectedAnalyzer === t.id ? 'text-emerald-700' : 'text-slate-600'}`}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANALYZING STATE */}
            {analysisState === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 border border-slate-100">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  AI Analyzing Your Land...
                </h3>
                <p className="text-sm text-slate-500 mb-8 max-w-[280px]">
                  Identifying terrain features, vegetation patterns, water sources, and optimal development zones.
                </p>

                <div className="w-full max-w-[240px]">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Processing image</span>
                    <span>{Math.min(progress, 100)}%</span>
                  </div>
                </div>

                {uploadedImage && (
                  <div className="mt-8">
                    <img
                      src={uploadedImage}
                      alt="Analyzing"
                      className="w-48 h-32 object-cover rounded-lg border-2 border-emerald-200 opacity-50"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* COMPLETE STATE */}
            {analysisState === 'complete' && analysisResult && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 md:p-8 space-y-6"
              >
                {/* Result Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" /> Analysis Complete
                    </div>
                    {isSaving && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                      </div>
                    )}
                    {savedAnalysisId && !isSaving && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        <Save className="w-3 h-3" /> Saved
                      </div>
                    )}
                    {saveError && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Save failed
                      </div>
                    )}
                  </div>

                  {uploadedImage && (
                    <img
                      src={uploadedImage}
                      alt="Analyzed land"
                      className="w-full h-40 object-cover rounded-xl border-2 border-slate-200 mb-4"
                    />
                  )}

                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                    {analysisResult.type === 'solar' ? 'Solar Energy Report' : 
                     analysisResult.type === 'agriculture' ? 'Agricultural Report' : 
                     'Building Development Report'}
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold mb-2">
                    Score: {analysisResult.report.solarSuitabilityScore || analysisResult.report.agriculturalSuitabilityScore || analysisResult.report.buildingSuitabilityScore}/10
                    <span className="mx-2 opacity-50">|</span>
                    <span className="uppercase tracking-wider text-xs">{(analysisResult.report.suitabilityLabel || '').replace(/_/g, ' ')}</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {analysisResult.type === 'solar' && (
                    <>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Suitable Area</div>
                        <div className="text-xl font-black text-slate-900">{(analysisResult.report.suitableAreaSqMeters || 0).toLocaleString()} m²</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Solar Panels</div>
                        <div className="text-xl font-black text-slate-900">{(analysisResult.report.estimatedPanelCount || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">Estimated count</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Annual Energy</div>
                        <div className="text-xl font-black text-slate-900">{(Math.round(analysisResult.report.estimatedAnnualEnergyKwh || 0)).toLocaleString()} kWh</div>
                        <div className="text-[10px] text-slate-400">Per year</div>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <div className="text-xs font-bold text-emerald-700 mb-1">Annual Income</div>
                        <div className="text-xl font-black text-emerald-900">${(analysisResult.report.estimatedAnnualLeaseIncomeUsd?.min || 0).toLocaleString()}–${(analysisResult.report.estimatedAnnualLeaseIncomeUsd?.max || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-600">USD per year</div>
                      </div>
                    </>
                  )}
                  {analysisResult.type === 'building' && (
                    <>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Developable Area</div>
                        <div className="text-xl font-black text-slate-900">{(analysisResult.report.developableAreaSqMeters || 0).toLocaleString()} m²</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Buildable Floor Area</div>
                        <div className="text-xl font-black text-slate-900">{(Math.round(analysisResult.report.estimatedBuildableFloorAreaSqMeters || 0)).toLocaleString()} m²</div>
                        <div className="text-[10px] text-slate-400">Estimated GFA</div>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <div className="text-xs font-bold text-emerald-700 mb-1">Land Value</div>
                        <div className="text-xl font-black text-emerald-900">${(analysisResult.report.estimatedLandValueUsd?.min || 0).toLocaleString()}–${(analysisResult.report.estimatedLandValueUsd?.max || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-600">USD estimated</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Suggested Use</div>
                        <div className="text-sm font-bold text-slate-900 capitalize leading-tight">
                          {(analysisResult.report.suggestedLandUse || []).map((u: string) => u.replace(/_/g,' ')).join(', ') || 'N/A'}
                        </div>
                      </div>
                    </>
                  )}
                  {analysisResult.type === 'agriculture' && (
                    <>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Cultivable Area</div>
                        <div className="text-xl font-black text-slate-900">{(analysisResult.report.cultivableAreaSqMeters || 0).toLocaleString()} m²</div>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <div className="text-xs font-bold text-emerald-700 mb-1">Annual Lease</div>
                        <div className="text-xl font-black text-emerald-900">${(analysisResult.report.estimatedAnnualLeaseIncomeUsd?.min || 0).toLocaleString()}–${(analysisResult.report.estimatedAnnualLeaseIncomeUsd?.max || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-600">USD/yr</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Land Cover</div>
                        <div className="text-sm font-bold text-slate-900 capitalize inline-block px-2 py-1 bg-white border border-slate-200 rounded">
                          {(analysisResult.report.landCoverType || '').replace(/_/g,' ')}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 mb-1">Top Crops</div>
                        <div className="text-sm font-bold text-slate-900 capitalize leading-tight">
                          {(analysisResult.report.recommendedCropTypes || []).slice(0,3).join(', ')}{(analysisResult.report.recommendedCropTypes?.length > 3 ? '…' : '')}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Extracted Sections based on type */}
                <div className="space-y-6">
                  {analysisResult.type === 'building' && (
                    <>
                      {/* Optional sections for Building */}
                      {analysisResult.report.topographyObservations && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-2">Topography</h3>
                          <p className="text-sm text-slate-600">{analysisResult.report.topographyObservations}</p>
                        </div>
                      )}
                      {analysisResult.report.accessAndInfrastructure && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-2">Access & Infrastructure</h3>
                          <p className="text-sm text-slate-600">{analysisResult.report.accessAndInfrastructure}</p>
                        </div>
                      )}
                    </>
                  )}
                  {analysisResult.type === 'agriculture' && (
                    <>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Recommended Crops</h3>
                        <div className="flex flex-wrap gap-2">
                          {(analysisResult.report.recommendedCropTypes || []).map((crop: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-bold">{crop}</span>
                          ))}
                        </div>
                      </div>
                      {analysisResult.report.irrigationAndWaterObservations && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-2">Irrigation & Water</h3>
                          <p className="text-sm text-slate-600">{analysisResult.report.irrigationAndWaterObservations}</p>
                        </div>
                      )}
                      {analysisResult.report.soilAndTerrainObservations && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-2">Soil & Terrain</h3>
                          <p className="text-sm text-slate-600">{analysisResult.report.soilAndTerrainObservations}</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Common Sections */}
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <h3 className="text-sm font-bold text-blue-900 mb-2">Opportunity Summary</h3>
                    <p className="text-sm text-blue-800 leading-relaxed">{analysisResult.report.opportunitySummary}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      {analysisResult.type === 'solar' ? 'Visible Obstacles' : 'Visible Constraints'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(analysisResult.report.visibleObstacles || analysisResult.report.visibleConstraints || []).length > 0 ? (
                        (analysisResult.report.visibleObstacles || analysisResult.report.visibleConstraints).map((obs: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">{obs}</span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500 italic">None detected</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Technical Notes</h3>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs">
                      {analysisResult.report.technicalNotes}
                    </p>
                  </div>

                  {analysisResult.report.confidenceScore != null && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-emerald-800">Analysis Confidence</span>
                        <span className="text-lg font-black text-emerald-600">
                          {Math.round(analysisResult.report.confidenceScore * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${Math.round(analysisResult.report.confidenceScore * 100)}%` }}
                        />
                      </div>
                      {analysisResult.report.confidenceNotes && (
                        <p className="text-xs text-emerald-700 leading-relaxed italic">
                          "{analysisResult.report.confidenceNotes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                  {!user && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
                      <p className="text-sm text-blue-800 font-medium mb-3">
                        Sign in to save this analysis and create a listing for your property.
                      </p>
                      <button
                        onClick={handleSignIn}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                      >
                        Sign In to Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={createListing}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    {user ? 'Create Listing for This Land' : 'Create Listing (Sign In Required)'}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold transition-all"
                  >
                    Analyze Another Image
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Image Preview or Map Visualization */}
      <div className="hidden md:block flex-1 relative bg-slate-100 overflow-hidden">
        <AnimatePresence mode="wait">
          {uploadedImage && analysisState !== 'idle' ? (
            <motion.div
              key="image-preview"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0"
            >
              <img
                src={uploadedImage}
                alt="Land analysis"
                className="w-full h-full object-cover"
              />
              {analysisState === 'analyzing' && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                      <span className="text-lg font-bold text-slate-900">AI Processing...</span>
                    </div>
                  </div>
                </div>
              )}
              {analysisState === 'complete' && (
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur shadow-2xl rounded-xl p-4 border border-white/20 w-64">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    Quick Stats
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Analysis Type</span>
                      <span className="text-xs font-bold text-slate-900 capitalize">{analysisResult?.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Score</span>
                      <span className="text-xs font-bold text-emerald-600">
                        {analysisResult?.report?.solarSuitabilityScore || analysisResult?.report?.agriculturalSuitabilityScore || analysisResult?.report?.buildingSuitabilityScore || 0}/10
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Confidence</span>
                      <span className="text-xs font-bold text-amber-600">
                        {Math.round((analysisResult?.report?.confidenceScore || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-lg font-bold text-slate-400">Upload an image to begin</p>
                <p className="text-sm text-slate-400 mt-2">AI will analyze your land instantly</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
