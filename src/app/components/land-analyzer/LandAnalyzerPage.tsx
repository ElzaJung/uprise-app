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

interface AnalysisResult {
  location: string;
  acres: number;
  zoning: string;
  sectors: Array<{
    id: string;
    name: string;
    score: string;
    icon: string;
    details: string;
  }>;
  landValue: number;
  considerations: string[];
  buildableArea: number;
}

export default function LandAnalyzerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
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
      console.log('Starting AI analysis...');

      // Call all three AI analyzers in parallel
      const reports = await aiAnalyzerAPI.analyzeAll(uploadedImage, location || undefined);

      console.log('AI analysis complete:', reports);

      // Transform AI reports into frontend format
      const solarReport = reports.solar as any;
      const agricultureReport = reports.agriculture as any;
      const buildingReport = reports.building as any;

      // Calculate estimated location from context or use provided location
      const estimatedLocation = location || 'Location not specified';

      // Calculate total acres (use largest reported area)
      const maxAreaSqMeters = Math.max(
        solarReport.suitableAreaSqMeters || 0,
        agricultureReport.cultivableAreaSqMeters || 0,
        buildingReport.developableAreaSqMeters || 0
      );
      const acres = maxAreaSqMeters / 4047; // Convert sqm to acres

      // Build sectors array from AI reports
      const sectors = [];

      // Solar sector
      if (solarReport) {
        sectors.push({
          id: 'energy',
          name: 'Solar Energy',
          score: solarReport.suitabilityLabel === 'excellent' ? 'Excellent' :
                 solarReport.suitabilityLabel === 'high' ? 'High' :
                 solarReport.suitabilityLabel === 'moderate' ? 'Moderate' :
                 solarReport.suitabilityLabel === 'low' ? 'Low' : 'Not Suitable',
          icon: '⚡',
          details: solarReport.opportunitySummary || 'Solar analysis completed'
        });
      }

      // Agriculture sector
      if (agricultureReport) {
        sectors.push({
          id: 'agriculture',
          name: 'Agriculture',
          score: `${agricultureReport.agricultureSuitabilityScore}/10`,
          icon: '🌱',
          details: agricultureReport.opportunitySummary || 'Agricultural analysis completed'
        });
      }

      // Building/Community sector
      if (buildingReport) {
        sectors.push({
          id: 'community',
          name: 'Building Development',
          score: buildingReport.suitabilityLabel === 'excellent' ? 'Excellent' :
                 buildingReport.suitabilityLabel === 'high' ? 'High' :
                 buildingReport.suitabilityLabel === 'moderate' ? 'Moderate' :
                 buildingReport.suitabilityLabel === 'low' ? 'Low' : 'Not Suitable',
          icon: '🏡',
          details: buildingReport.opportunitySummary || 'Building development analysis completed'
        });
      }

      // Calculate average land value from all reports
      const landValueEstimates = [
        buildingReport.estimatedLandValueUsd?.min || 0,
        buildingReport.estimatedLandValueUsd?.max || 0,
      ].filter(v => v > 0);

      const avgLandValue = landValueEstimates.length > 0
        ? landValueEstimates.reduce((a, b) => a + b, 0) / landValueEstimates.length
        : 0;

      // Combine all constraints/considerations
      const considerations = [
        ...(solarReport.visibleObstacles || []),
        ...(agricultureReport.visibleConstraints || []),
        ...(buildingReport.visibleConstraints || []),
        solarReport.confidenceNotes,
        agricultureReport.confidenceNotes,
        buildingReport.confidenceNotes,
      ].filter(Boolean);

      const result: AnalysisResult = {
        location: estimatedLocation,
        acres: parseFloat(acres.toFixed(2)),
        zoning: 'AI-Estimated',
        sectors,
        landValue: Math.round(avgLandValue),
        considerations: considerations.slice(0, 4), // Top 4 considerations
        buildableArea: buildingReport.estimatedBuildableFloorAreaSqMeters || 0
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

                  {!uploadedImage && (
                    <div className="mt-8">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">What We Analyze</h4>
                      <div className="space-y-3">
                        {[
                          { icon: Sun, label: 'Solar Potential', desc: 'Irradiance & shading analysis' },
                          { icon: Leaf, label: 'Agricultural Viability', desc: 'Soil & terrain suitability' },
                          { icon: Building, label: 'Development Options', desc: 'Zoning & buildable area' },
                          { icon: Globe, label: 'Tourism Potential', desc: 'Natural features & access' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <item.icon className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                              <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    Land Analysis Report
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {analysisResult.location}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4" /> {analysisResult.acres} Acres
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>{analysisResult.zoning}</span>
                  </div>
                </div>

                {/* Opportunity Sectors */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Opportunity Sectors</h3>
                  <div className="space-y-3">
                    {analysisResult.sectors.map((sector) => (
                      <div
                        key={sector.id}
                        className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="text-2xl">{sector.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-bold text-slate-900">{sector.name}</h4>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                sector.score.includes('Excellent') || sector.score.includes('Good')
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {sector.score}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{sector.details}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-700 mb-1">Estimated Value</p>
                    <p className="text-xl font-black text-emerald-900">
                      ${(analysisResult.landValue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-700 mb-1">Buildable Area</p>
                    <p className="text-xl font-black text-blue-900">
                      {(analysisResult.buildableArea / 43560).toFixed(1)} Ac
                    </p>
                  </div>
                </div>

                {/* Considerations */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#FFB600]" />
                    Development Considerations
                  </h4>
                  <ul className="space-y-2.5">
                    {analysisResult.considerations.map((consideration, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600 leading-snug">{consideration}</p>
                      </li>
                    ))}
                  </ul>
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
                      <span className="text-xs font-medium text-slate-600">Total Area</span>
                      <span className="text-xs font-bold text-slate-900">{analysisResult?.acres} acres</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Est. Value</span>
                      <span className="text-xs font-bold text-emerald-600">
                        ${((analysisResult?.landValue || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Top Sector</span>
                      <span className="text-xs font-bold text-amber-600">
                        {analysisResult?.sectors[0]?.name}
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
