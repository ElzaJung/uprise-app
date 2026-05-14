const fs = require('fs');

let content = fs.readFileSync('src/app/components/land-analyzer/LandAnalyzerPage.tsx', 'utf8');

// Replace 1: Types
content = content.replace(
`type AnalysisState = 'idle' | 'analyzing' | 'complete';

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
}`,
`type AnalysisState = 'idle' | 'analyzing' | 'complete';
type AnalyzerType = 'solar' | 'agriculture' | 'building';

interface AnalysisResult {
  type: AnalyzerType;
  location: string;
  report: any;
}`);

// Replace 2: state definition
content = content.replace(
`  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');`,
`  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [selectedAnalyzer, setSelectedAnalyzer] = useState<AnalyzerType>('solar');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');`);

// Replace 3: handleAnalyze
const handleAnalyzeTarget = `  const handleAnalyze = async () => {
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
          score: \`\${agricultureReport.agricultureSuitabilityScore}/10\`,
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
      setAnalysisState('complete');`;

const handleAnalyzeReplace = `  const handleAnalyze = async () => {
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
      setAnalysisState('complete');`;
content = content.replace(handleAnalyzeTarget, handleAnalyzeReplace);

// Replace 4: Idle state
const idleTarget = `                  {!uploadedImage && (
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
                  )}`;
const idleReplace = `                  <div className="mt-8">
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
                          className={\`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all \${
                            selectedAnalyzer === t.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-emerald-200 bg-white'
                          }\`}
                        >
                          <t.icon className={\`w-6 h-6 mb-2 \${selectedAnalyzer === t.id ? 'text-emerald-600' : 'text-slate-400'}\`} />
                          <span className={\`text-xs font-bold \${selectedAnalyzer === t.id ? 'text-emerald-700' : 'text-slate-600'}\`}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>`;
content = content.replace(idleTarget, idleReplace);

// Replace 5: Complete state
const completeTarget = `                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">
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
                              <span className={\`text-xs font-bold px-2 py-1 rounded-full \${sector.score.includes('Excellent') || sector.score.includes('Good')
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                                }\`}>
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
                      \${(analysisResult.landValue / 1000).toFixed(0)}K
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
                </div>`;
const completeReplace = `                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">
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
                        <div className="text-xl font-black text-emerald-900">\${(analysisResult.report.estimatedAnnualLeaseIncomeUsd?.min || 0).toLocaleString()}–\${(analysisResult.report.estimatedAnnualLeaseIncomeUsd?.max || 0).toLocaleString()}</div>
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
                        <div className="text-xl font-black text-emerald-900">\${(analysisResult.report.estimatedLandValueUsd?.min || 0).toLocaleString()}–\${(analysisResult.report.estimatedLandValueUsd?.max || 0).toLocaleString()}</div>
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
                        <div className="text-xl font-black text-emerald-900">\${(analysisResult.report.estimatedAnnualLeaseIncomeUsd?.min || 0).toLocaleString()}–\${(analysisResult.report.estimatedAnnualLeaseIncomeUsd?.max || 0).toLocaleString()}</div>
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
                          style={{ width: \`\${Math.round(analysisResult.report.confidenceScore * 100)}%\` }}
                        />
                      </div>
                      {analysisResult.report.confidenceNotes && (
                        <p className="text-xs text-emerald-700 leading-relaxed italic">
                          "{analysisResult.report.confidenceNotes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>`;
content = content.replace(completeTarget, completeReplace);

// Replace 6: Right panel Quick Stats
const quickStatsTarget = `                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Total Area</span>
                      <span className="text-xs font-bold text-slate-900">{analysisResult?.acres} acres</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Est. Value</span>
                      <span className="text-xs font-bold text-emerald-600">
                        \${((analysisResult?.landValue || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Top Sector</span>
                      <span className="text-xs font-bold text-amber-600">
                        {analysisResult?.sectors[0]?.name}
                      </span>
                    </div>
                  </div>`;
const quickStatsReplace = `                  <div className="space-y-2">
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
                  </div>`;
content = content.replace(quickStatsTarget, quickStatsReplace);

fs.writeFileSync('src/app/components/land-analyzer/LandAnalyzerPage.tsx', content);
