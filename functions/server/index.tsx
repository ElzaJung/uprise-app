import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";
import Anthropic from "npm:@anthropic-ai/sdk@0.32.0";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-bf94089b/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Signup endpoint (server-side to avoid email rate limits)
app.post("/make-server-bf94089b/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error: any) {
    console.error('Unexpected signup error:', error);
    return c.json({ error: error.message || 'Signup failed' }, 500);
  }
});

// Create storage bucket for land images (idempotent)
async function ensureStorageBucket() {
  const bucketName = 'make-bf94089b-land-images';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });

    if (error) {
      console.error('Error creating storage bucket:', error);
    } else {
      console.log('Storage bucket created successfully:', bucketName);
    }
  }
}

// Initialize storage on server start
ensureStorageBucket();

// Initialize sample listings data
async function initializeSampleListings() {
  try {
    const existingListings = await kv.get('all_listings');

    // Only initialize if no listings exist
    if (!existingListings || existingListings.length === 0) {
      console.log('Initializing sample listings...');

      const sampleListings = [
        {
          id: 'sample-1',
          owner_id: 'system',
          owner_email: 'demo@uprise.ai',
          title: 'Prime Solar Development Land',
          address: '123 Main St, Austin, TX',
          developable_area_acres: 50,
          buildable_floor_area_sqft: 2178000,
          land_value: 500000,
          terms: 'Cash only, 30-day close preferred',
          description: 'Excellent opportunity for solar farm development.',
          sectors: ['energy', 'agriculture'],
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'sample-2',
          owner_id: 'system',
          owner_email: 'demo@uprise.ai',
          title: 'Scenic Tourism Property',
          address: '789 Pine Rd, Denver, CO',
          developable_area_acres: 100,
          buildable_floor_area_sqft: 4356000,
          land_value: 1200000,
          terms: 'Owner financing available',
          description: 'Stunning mountain views with access to hiking trails.',
          sectors: ['tourism', 'community'],
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'sample-3',
          owner_id: 'system',
          owner_email: 'demo@uprise.ai',
          title: 'Agricultural Excellence',
          address: '456 Farm Lane, Fresno, CA',
          developable_area_acres: 75,
          buildable_floor_area_sqft: 3267000,
          land_value: 850000,
          terms: 'Flexible terms, seller motivated',
          description: 'Rich soil, established irrigation system.',
          sectors: ['agriculture'],
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const listingIds = [];
      for (const listing of sampleListings) {
        await kv.set(`listing:${listing.id}`, listing);
        listingIds.push(listing.id);
      }

      await kv.set('all_listings', listingIds);
      console.log('Sample listings initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing sample listings:', error);
  }
}

// Initialize sample listings
initializeSampleListings();

// AI Analyzer Helper Functions
const AI_PROVIDER = Deno.env.get('AI_PROVIDER') || 'anthropic';
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';

// Initialize Anthropic client
let anthropicClient: Anthropic | null = null;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

if (ANTHROPIC_API_KEY) {
  anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
}

function parseImageUrl(imageUrl: string): { type: string; url?: string; media_type?: string; data?: string } {
  if (!imageUrl.startsWith('data:')) {
    return { type: 'url', url: imageUrl };
  }
  const [header, data] = imageUrl.split(',');
  const mediaType = header.replace('data:', '').replace(';base64', '');
  return { type: 'base64', media_type: mediaType, data };
}

async function analyzeWithAI(
  imageUrl: string,
  systemPrompt: string,
  userText: string,
  toolName: string,
  schema: any
): Promise<any> {
  if (!anthropicClient) {
    throw new Error('Anthropic API key not configured');
  }

  const imageSource = parseImageUrl(imageUrl);

  const result = await anthropicClient.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    tools: [
      {
        name: toolName,
        description: 'Return the structured analysis result',
        input_schema: schema,
      },
    ],
    tool_choice: { type: 'tool', name: toolName },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: imageSource as any },
          { type: 'text', text: userText },
        ],
      },
    ],
  });

  const toolUse = result.content.find((b: any) => b.type === 'tool_use');
  if (!toolUse) {
    throw new Error('AI returned no tool use block');
  }

  return toolUse.input;
}

// Solar Analyzer
const SOLAR_SYSTEM_PROMPT = `You are a solar energy assessment expert working for Uprise Impact, a clean energy land advisory firm.

Your task is to analyze satellite or aerial imagery of land parcels and rooftops to estimate solar energy potential.

Use the following industry-standard assumptions unless the location context provides more specific data:
- Panel specification: 145W per panel, approximately 1.7 square meters per panel
- Solar irradiance default: Ontario/Canada average of ~1,300 kWh/kWp/year
- Performance ratio: 0.80 (standard for modern inverter systems)
- Ground-mount lease rates: $3,000–$6,000 USD per kWp per year
- Rooftop energy value: $0.05–$0.08 USD per kWh
- CAD/USD exchange rate: approximately 1.36 CAD per USD

Suitability scoring guidance:
- not_suitable (score 1–2): blocked by significant obstacles, north-facing, heavily shaded, or water body
- low (score 3–4): partial shading, poor orientation, complex roof geometry, or significant obstacles
- moderate (score 5–6): some shading or sub-optimal orientation but viable installation possible
- high (score 7–8): mostly clear, good orientation, minor obstacles only
- excellent (score 9–10): clear unobstructed surface, optimal south-facing orientation, flat or low-pitch roof

The opportunitySummary must be written in plain English for a landowner — focus on income potential, ease of setup, and what this could mean for their property value. Avoid technical jargon.

The technicalNotes field is for a solar developer or installer — include panel layout considerations, inverter sizing notes, shading analysis, and any site preparation requirements you can infer.

Provide honest, conservative estimates. If image resolution or quality limits your confidence, reflect that accurately in confidenceScore (0.0–1.0) and confidenceNotes.`;

const SOLAR_SCHEMA = {
  type: 'object',
  properties: {
    analyzerType: { type: 'string', enum: ['solar'] },
    suitableAreaSqMeters: { type: 'number' },
    solarSuitabilityScore: { type: 'integer', minimum: 1, maximum: 10 },
    suitabilityLabel: { type: 'string', enum: ['not_suitable', 'low', 'moderate', 'high', 'excellent'] },
    estimatedPanelCount: { type: 'integer' },
    estimatedAnnualEnergyKwh: { type: 'number' },
    estimatedAnnualLeaseIncomeUsd: {
      type: 'object',
      properties: { min: { type: 'number' }, max: { type: 'number' } },
      required: ['min', 'max'],
    },
    estimatedAnnualLeaseIncomeCad: {
      type: 'object',
      properties: { min: { type: 'number' }, max: { type: 'number' } },
      required: ['min', 'max'],
    },
    visibleObstacles: { type: 'array', items: { type: 'string' } },
    opportunitySummary: { type: 'string' },
    technicalNotes: { type: 'string' },
    confidenceScore: { type: 'number', minimum: 0, maximum: 1 },
    confidenceNotes: { type: 'string' },
  },
  required: [
    'analyzerType', 'suitableAreaSqMeters', 'solarSuitabilityScore', 'suitabilityLabel',
    'estimatedPanelCount', 'estimatedAnnualEnergyKwh', 'estimatedAnnualLeaseIncomeUsd',
    'estimatedAnnualLeaseIncomeCad', 'visibleObstacles', 'opportunitySummary',
    'technicalNotes', 'confidenceScore', 'confidenceNotes',
  ],
};

// Agriculture Analyzer
const AGRICULTURE_SYSTEM_PROMPT = `You are an agricultural land assessment expert working for Uprise Impact, a land advisory firm in Ontario, Canada.

Your task is to analyze satellite or aerial imagery of land parcels to estimate their suitability for farming, the types of crops that could realistically be grown, and the farmland cash rental income potential.

Use the following assumptions unless the location context provides more specific data:
- Farmland cash rent rates in Ontario: $150–$350 CAD/acre/year
    Class 1–2 prime (flat, dark soil, good drainage): $280–$350 CAD/acre/year
    Class 3–4 moderate quality: $180–$280 CAD/acre/year
    Marginal land / pasture: $150–$180 CAD/acre/year
- CAD/USD exchange rate: approximately 1.36 CAD per USD
- Ontario growing season: approximately May–October
- 1 acre = 4,047 m²

Suitability scoring guidance:
- not_suitable (score 1–2): dense forest, water body, wetland, urban/developed land, steep slope >15%
- low (score 3–4): heavily forested requiring major clearing, slope 8–15%, predominantly rock outcrops, significant drainage problems
- moderate (score 5–6): partially cleared, mixed vegetation, slope 3–8%, drainage improvements likely needed
- high (score 7–8): mostly cleared, flat to gently rolling (<3% slope), signs of past or current cultivation, good drainage
- excellent (score 9–10): active cropland or recently fallowed flat field, dark fertile-looking soil, no significant obstacles, good drainage

For recommendedCropTypes, consider Ontario's growing season and visible terrain. Typical Ontario crops include: corn, soybeans, winter wheat, spring wheat, barley, oats, hay, alfalfa, mixed grains, market vegetables, strawberries, apples, pears, peaches, pumpkins, sunflowers, canola.

The opportunitySummary must be written in plain English for a landowner — describe farming potential, approximate annual lease income, and whether improvements could increase income.

The technicalNotes field is for an agricultural consultant — include observations on soil quality indicators, drainage, slope, field obstacles, and recommendations.

Provide honest, conservative estimates.`;

const AGRICULTURE_SCHEMA = {
  type: 'object',
  properties: {
    analyzerType: { type: 'string', enum: ['agriculture'] },
    cultivableAreaSqMeters: { type: 'number' },
    agriculturalSuitabilityScore: { type: 'integer', minimum: 1, maximum: 10 },
    suitabilityLabel: { type: 'string', enum: ['not_suitable', 'low', 'moderate', 'high', 'excellent'] },
    landCoverType: { type: 'string', enum: ['bare_soil', 'grassland', 'active_cropland', 'forested', 'mixed', 'unknown'] },
    recommendedCropTypes: { type: 'array', items: { type: 'string' } },
    estimatedAnnualLeaseIncomeUsd: {
      type: 'object',
      properties: { min: { type: 'number' }, max: { type: 'number' } },
      required: ['min', 'max'],
    },
    estimatedAnnualLeaseIncomeCad: {
      type: 'object',
      properties: { min: { type: 'number' }, max: { type: 'number' } },
      required: ['min', 'max'],
    },
    opportunitySummary: { type: 'string' },
    technicalNotes: { type: 'string' },
    confidenceScore: { type: 'number', minimum: 0, maximum: 1 },
    confidenceNotes: { type: 'string' },
  },
  required: [
    'analyzerType', 'cultivableAreaSqMeters', 'agriculturalSuitabilityScore',
    'suitabilityLabel', 'landCoverType', 'recommendedCropTypes',
    'estimatedAnnualLeaseIncomeUsd', 'estimatedAnnualLeaseIncomeCad',
    'opportunitySummary', 'technicalNotes', 'confidenceScore', 'confidenceNotes',
  ],
};

// Building Analyzer
const BUILDING_SYSTEM_PROMPT = `You are a land development assessment expert working for Uprise Impact, a land advisory firm in Ontario, Canada.

Your task is to analyze satellite or aerial imagery of land parcels to estimate their potential for building development — residential, commercial, industrial, or mixed-use.

Use the following assumptions unless the location context provides more specific data:
- Floor-area ratio (FAR) reference points: 0.5 for low-density residential, 2.0 for mixed-use/commercial
- Serviced land pricing in Southern Ontario:
    Residential: $500,000–$2,000,000 USD per acre
    Commercial/mixed-use: $750,000–$3,000,000 USD per acre
- CAD/USD exchange rate: approximately 1.36 CAD per USD
- Standard Ontario setbacks: 6m front, 1.2m side, 7.5m rear
- 1 acre = 4,047 m²

Suitability scoring guidance:
- not_suitable (score 1–2): water body, designated wetland, steep slope >20%, no road access, or fully built out
- low (score 3–4): significant constraints — slope 10–20%, partial wetland, no visible servicing
- moderate (score 5–6): some constraints (slope 5–10%, limited road access) but development is feasible
- high (score 7–8): mostly flat (<5% slope), road access visible, cleared or lightly treed
- excellent (score 9–10): flat, cleared, road-adjacent, no visible environmental constraints

For suggestedLandUse, only include types that are plausibly suitable: residential, commercial, mixed_use, industrial, recreational, institutional.

The opportunitySummary must be written in plain English for a landowner — describe what kind of development could be built, rough land value range, and next steps.

The technicalNotes field is for a developer or planner — include slope/grading observations, servicing assumptions, setback implications, FAR rationale.

Provide honest, conservative estimates.`;

const BUILDING_SCHEMA = {
  type: 'object',
  properties: {
    analyzerType: { type: 'string', enum: ['building'] },
    developableAreaSqMeters: { type: 'number' },
    buildingSuitabilityScore: { type: 'integer', minimum: 1, maximum: 10 },
    suitabilityLabel: { type: 'string', enum: ['not_suitable', 'low', 'moderate', 'high', 'excellent'] },
    suggestedLandUse: { type: 'array', items: { type: 'string', enum: ['residential', 'commercial', 'mixed_use', 'industrial', 'recreational', 'institutional'] } },
    estimatedBuildableFloorAreaSqMeters: { type: 'number' },
    estimatedLandValueUsd: {
      type: 'object',
      properties: { min: { type: 'number' }, max: { type: 'number' } },
      required: ['min', 'max'],
    },
    estimatedLandValueCad: {
      type: 'object',
      properties: { min: { type: 'number' }, max: { type: 'number' } },
      required: ['min', 'max'],
    },
    opportunitySummary: { type: 'string' },
    technicalNotes: { type: 'string' },
    confidenceScore: { type: 'number', minimum: 0, maximum: 1 },
    confidenceNotes: { type: 'string' },
  },
  required: [
    'analyzerType', 'developableAreaSqMeters', 'buildingSuitabilityScore',
    'suitabilityLabel', 'suggestedLandUse', 'estimatedBuildableFloorAreaSqMeters',
    'estimatedLandValueUsd', 'estimatedLandValueCad', 'opportunitySummary',
    'technicalNotes', 'confidenceScore', 'confidenceNotes',
  ],
};

// AI Analyzer Endpoints

// Health check for AI analyzer
app.get("/make-server-bf94089b/ai/health", (c) => {
  const hasApiKey = !!ANTHROPIC_API_KEY;
  return c.json({
    status: hasApiKey ? 'ok' : 'no_api_key',
    provider: AI_PROVIDER,
    available: hasApiKey,
  });
});

// List available analyzers
app.get("/make-server-bf94089b/ai/analyzers", (c) => {
  return c.json({
    analyzers: ['solar', 'agriculture', 'building'],
  });
});

// Analyze with specific analyzer
app.post("/make-server-bf94089b/ai/analyze", async (c) => {
  try {
    const { imageUrl, analyzer, context } = await c.req.json();

    if (!imageUrl) {
      return c.json({ error: 'imageUrl is required' }, 400);
    }

    if (!analyzer || !['solar', 'agriculture', 'building'].includes(analyzer)) {
      return c.json({ error: 'analyzer must be one of: solar, agriculture, building' }, 400);
    }

    if (!ANTHROPIC_API_KEY) {
      return c.json({ error: 'AI analyzer not configured - ANTHROPIC_API_KEY missing' }, 503);
    }

    const location = context?.location || 'Not specified — use Ontario, Canada defaults';
    const userText = `Location context: ${location}\n\nPlease analyze this image and return a complete ${analyzer} assessment.`;

    let report;

    if (analyzer === 'solar') {
      report = await analyzeWithAI(imageUrl, SOLAR_SYSTEM_PROMPT, userText, 'solar_report', SOLAR_SCHEMA);
    } else if (analyzer === 'agriculture') {
      report = await analyzeWithAI(imageUrl, AGRICULTURE_SYSTEM_PROMPT, userText, 'agriculture_report', AGRICULTURE_SCHEMA);
    } else if (analyzer === 'building') {
      report = await analyzeWithAI(imageUrl, BUILDING_SYSTEM_PROMPT, userText, 'building_report', BUILDING_SCHEMA);
    }

    return c.json({ report });
  } catch (error: any) {
    console.error('Error in AI analysis:', error);
    return c.json({ error: error.message || 'AI analysis failed' }, 500);
  }
});

// Upload land image and save analysis
app.post("/make-server-bf94089b/api/land-analysis", async (c) => {
  try {
    const body = await c.req.json();
    const { imageData, analysis, userId } = body;

    if (!imageData || !analysis) {
      return c.json({ error: 'Image data and analysis are required' }, 400);
    }

    // Generate unique ID for this analysis
    const analysisId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Upload image to Supabase Storage
    let imageUrl = null;
    if (imageData.startsWith('data:image')) {
      // Extract base64 data
      const base64Data = imageData.split(',')[1];
      const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Determine file extension from data URL
      const mimeType = imageData.split(';')[0].split(':')[1];
      const extension = mimeType.split('/')[1];
      const fileName = `${analysisId}.${extension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('make-bf94089b-land-images')
        .upload(fileName, imageBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return c.json({ error: 'Failed to upload image: ' + uploadError.message }, 500);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('make-bf94089b-land-images')
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    // Save analysis to KV store
    const analysisRecord = {
      id: analysisId,
      userId: userId || 'guest',
      imageUrl,
      analysis,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await kv.set(`land_analysis:${analysisId}`, analysisRecord);

    // Also save to user's analysis list if userId is provided
    if (userId) {
      const userAnalysesKey = `user_analyses:${userId}`;
      const existingAnalyses = await kv.get(userAnalysesKey) || [];
      existingAnalyses.push(analysisId);
      await kv.set(userAnalysesKey, existingAnalyses);
    }

    console.log('Land analysis saved successfully:', analysisId);

    return c.json({
      success: true,
      analysisId,
      imageUrl,
      analysis: analysisRecord,
    });
  } catch (error: any) {
    console.error('Error saving land analysis:', error);
    return c.json({ error: 'Failed to save analysis: ' + error.message }, 500);
  }
});

// Get analysis by ID
app.get("/make-server-bf94089b/api/land-analysis/:id", async (c) => {
  try {
    const analysisId = c.req.param('id');
    const analysis = await kv.get(`land_analysis:${analysisId}`);

    if (!analysis) {
      return c.json({ error: 'Analysis not found' }, 404);
    }

    return c.json({ analysis });
  } catch (error: any) {
    console.error('Error fetching analysis:', error);
    return c.json({ error: 'Failed to fetch analysis: ' + error.message }, 500);
  }
});

// Get all analyses for a user
app.get("/make-server-bf94089b/api/land-analysis/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const analysisIds = await kv.get(`user_analyses:${userId}`) || [];

    const analyses = [];
    for (const id of analysisIds) {
      const analysis = await kv.get(`land_analysis:${id}`);
      if (analysis) {
        analyses.push(analysis);
      }
    }

    return c.json({ analyses });
  } catch (error: any) {
    console.error('Error fetching user analyses:', error);
    return c.json({ error: 'Failed to fetch analyses: ' + error.message }, 500);
  }
});

// Delete analysis
app.delete("/make-server-bf94089b/api/land-analysis/:id", async (c) => {
  try {
    const analysisId = c.req.param('id');
    const accessToken = c.req.header('X-User-Token');

    // Get the analysis to check ownership
    const analysis = await kv.get(`land_analysis:${analysisId}`);

    if (!analysis) {
      return c.json({ error: 'Analysis not found' }, 404);
    }

    // Verify user owns this analysis
    if (accessToken) {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (error || !user || analysis.userId !== user.id) {
        return c.json({ error: 'Unauthorized' }, 403);
      }
    } else {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Delete image from storage if exists
    if (analysis.imageUrl) {
      const fileName = analysis.imageUrl.split('/').pop();
      await supabase.storage
        .from('make-bf94089b-land-images')
        .remove([fileName]);
    }

    // Delete analysis record
    await kv.del(`land_analysis:${analysisId}`);

    // Remove from user's analysis list
    const userAnalysesKey = `user_analyses:${analysis.userId}`;
    const userAnalyses = await kv.get(userAnalysesKey) || [];
    const updatedAnalyses = userAnalyses.filter((id: string) => id !== analysisId);
    await kv.set(userAnalysesKey, updatedAnalyses);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting analysis:', error);
    return c.json({ error: 'Failed to delete analysis: ' + error.message }, 500);
  }
});

// Listings API endpoints

// Get all listings (with optional sector filter)
app.get("/make-server-bf94089b/api/listings", async (c) => {
  try {
    const sectorsParam = c.req.query('sectors');
    const sectors = sectorsParam ? sectorsParam.split(',') : [];

    // Get all listing IDs from KV store
    const allListingIds = await kv.get('all_listings') || [];

    const listings = [];
    for (const id of allListingIds) {
      const listing = await kv.get(`listing:${id}`);
      if (listing && listing.status === 'published') {
        // Filter by sectors if specified
        if (sectors.length > 0) {
          const listingSectors = listing.sectors || [];
          const hasMatchingSector = sectors.some((s: string) =>
            listingSectors.includes(s.trim())
          );
          if (hasMatchingSector) {
            listings.push(listing);
          }
        } else {
          listings.push(listing);
        }
      }
    }

    return c.json({ listings });
  } catch (error: any) {
    console.error('Error fetching listings:', error);
    return c.json({ error: 'Failed to fetch listings: ' + error.message }, 500);
  }
});

// Get single listing by ID
app.get("/make-server-bf94089b/api/listings/:id", async (c) => {
  try {
    const listingId = c.req.param('id');
    const listing = await kv.get(`listing:${listingId}`);

    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    return c.json({ listing });
  } catch (error: any) {
    console.error('Error fetching listing:', error);
    return c.json({ error: 'Failed to fetch listing: ' + error.message }, 500);
  }
});

// Create new listing
app.post("/make-server-bf94089b/api/listings", async (c) => {
  try {
    const accessToken = c.req.header('X-User-Token');

    // Verify user is authenticated
    if (!accessToken) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Invalid authentication' }, 401);
    }

    const body = await c.req.json();
    const listingId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const listing = {
      id: listingId,
      owner_id: user.id,
      owner_email: user.email,
      title: body.title || '',
      address: body.address || '',
      developable_area_acres: body.developable_area_acres || 0,
      buildable_floor_area_sqft: body.buildable_floor_area_sqft || 0,
      land_value: body.land_value || 0,
      terms: body.terms || '',
      description: body.description || '',
      sectors: body.sectors || [],
      status: body.status || 'draft',
      created_at: timestamp,
      updated_at: timestamp,
    };

    // Save listing
    await kv.set(`listing:${listingId}`, listing);

    // Add to all listings index
    const allListings = await kv.get('all_listings') || [];
    allListings.push(listingId);
    await kv.set('all_listings', allListings);

    // Add to user's listings
    const userListingsKey = `user_listings:${user.id}`;
    const userListings = await kv.get(userListingsKey) || [];
    userListings.push(listingId);
    await kv.set(userListingsKey, userListings);

    console.log('Listing created successfully:', listingId);

    return c.json({ listing });
  } catch (error: any) {
    console.error('Error creating listing:', error);
    return c.json({ error: 'Failed to create listing: ' + error.message }, 500);
  }
});

// Update listing
app.put("/make-server-bf94089b/api/listings/:id", async (c) => {
  try {
    const accessToken = c.req.header('X-User-Token');
    const listingId = c.req.param('id');

    // Verify user is authenticated
    if (!accessToken) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Invalid authentication' }, 401);
    }

    // Get existing listing
    const existingListing = await kv.get(`listing:${listingId}`);
    if (!existingListing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    // Verify ownership
    if (existingListing.owner_id !== user.id) {
      return c.json({ error: 'Unauthorized - you do not own this listing' }, 403);
    }

    const updates = await c.req.json();
    const timestamp = new Date().toISOString();

    const updatedListing = {
      ...existingListing,
      ...updates,
      id: listingId, // Prevent ID from being changed
      owner_id: existingListing.owner_id, // Prevent owner from being changed
      updated_at: timestamp,
    };

    await kv.set(`listing:${listingId}`, updatedListing);

    console.log('Listing updated successfully:', listingId);

    return c.json({ listing: updatedListing });
  } catch (error: any) {
    console.error('Error updating listing:', error);
    return c.json({ error: 'Failed to update listing: ' + error.message }, 500);
  }
});

Deno.serve(app.fetch);