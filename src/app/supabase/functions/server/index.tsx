import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";

const TABLE_NAME = "kv_store_bf94089b";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  '*',
  cors({
    origin: "*",
    allowHeaders: ["Accept", "Content-Type", "Authorization", "X-Supabase-Project-Id", "X-Supabase-Anon-Key", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.options('*', (c) => c.text('', 204));

// Health check endpoint - updated to trigger hot reload
app.get("/make-server-bf94089b/health", (c) => {
  return c.json({ status: "ok", v: 2 });
});

app.post("/make-server-bf94089b/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: "Server configuration error" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error: any) {
    console.error("Unexpected signup error:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

app.get("/make-server-bf94089b/api/parcels", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userTokenHeader = c.req.header('X-User-Token');
    const token = userTokenHeader || authHeader.replace('Bearer ', '');
    const customProjectId = c.req.header('X-Supabase-Project-Id');
    const customAnonKey = c.req.header('X-Supabase-Anon-Key');

    // Use frontend project for Auth if provided, else fallback to backend env
    const supabaseUrl = customProjectId ? `https://${customProjectId}.supabase.co` : Deno.env.get("SUPABASE_URL");
    const supabaseKey = customAnonKey || Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: "Server configuration error" }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth validation failed:", authError);
      return c.json({ error: "Invalid session token", details: authError }, 401);
    }

    // Create backend DB client to access the KV table
    const backendDbUrl = Deno.env.get("SUPABASE_URL");
    const backendDbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!backendDbUrl || !backendDbKey) {
      return c.json({ error: "Backend DB configuration error" }, 500);
    }
    const backendSupabase = createClient(backendDbUrl, backendDbKey);

    // Fetch all keys that start with "parcel" directly from the table
    const { data: kvData, error: kvError } = await backendSupabase
      .from(TABLE_NAME)
      .select("key, value")
      .like("key", "parcel%");
      
    if (kvError) {
      throw new Error(kvError.message);
    }
    
    const allParcels = kvData?.map((d) => d.value) ?? [];
    
    // Filter only parcels where user_id matches current user
    const parcels = allParcels.filter((p: any) => p && (p.user_id === user.id || p.owner_id === user.id));
    
    return c.json({ parcels });
  } catch (error: any) {
    console.error("Error fetching parcels:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

app.post("/make-server-bf94089b/api/parcels", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userTokenHeader = c.req.header('X-User-Token');
    const token = userTokenHeader || authHeader.replace('Bearer ', '');
    const customProjectId = c.req.header('X-Supabase-Project-Id');
    const customAnonKey = c.req.header('X-Supabase-Anon-Key');

    // Use frontend project for Auth if provided, else fallback to backend env
    const supabaseUrl = customProjectId ? `https://${customProjectId}.supabase.co` : Deno.env.get("SUPABASE_URL");
    const supabaseKey = customAnonKey || Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: "Server configuration error" }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth validation failed:", authError);
      return c.json({ error: "Invalid session token", details: authError }, 401);
    }

    const body = await c.req.json();
    const { user_id, location, sector, created_at } = body;

    const newParcel = {
      user_id: user_id || user.id,
      location,
      sector,
      created_at: created_at || new Date().toISOString()
    };

    const key = `parcel:${newParcel.user_id}:${newParcel.created_at}`;

    // Create backend DB client to access the KV table
    const backendDbUrl = Deno.env.get("SUPABASE_URL");
    const backendDbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!backendDbUrl || !backendDbKey) {
      return c.json({ error: "Backend DB configuration error" }, 500);
    }
    const backendSupabase = createClient(backendDbUrl, backendDbKey);

    const { error: upsertError } = await backendSupabase
      .from(TABLE_NAME)
      .upsert({ key, value: newParcel });
      
    if (upsertError) {
      throw new Error(upsertError.message);
    }

    return c.json({ parcel: newParcel });
  } catch (error: any) {
    console.error("Error creating parcel:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

// GET all listings (public endpoint - no auth required, or optional auth for filtering)
app.get("/make-server-bf94089b/api/listings", async (c) => {
  try {
    // Create backend DB client to access the database
    const backendDbUrl = Deno.env.get("SUPABASE_URL");
    const backendDbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!backendDbUrl || !backendDbKey) {
      return c.json({ error: "Backend DB configuration error" }, 500);
    }
    const backendSupabase = createClient(backendDbUrl, backendDbKey);

    // Get sector filters from query params (can be comma-separated)
    const sectorsParam = c.req.query('sectors');
    const selectedSectors = sectorsParam ? sectorsParam.split(',').filter(Boolean) : [];

    let query = backendSupabase
      .from("listing")
      .select(`
        *,
        listing_description (*),
        listing_categories (
          categories (*)
        ),
        listing_contacts (
          contacts (*)
        )
      `);

    // If sectors are specified, filter by them
    if (selectedSectors.length > 0) {
      // Capitalize sector names for case-insensitive matching (energy -> Energy)
      const capitalizedSectors = selectedSectors.map(sector => 
        sector.charAt(0).toUpperCase() + sector.slice(1).toLowerCase()
      );
      
      console.log('Filtering by sectors:', capitalizedSectors);
      
      // First get listing IDs that match the selected sectors
      const { data: matchingListingCategories, error: categoryError } = await backendSupabase
        .from("listing_categories")
        .select("listing_id, categories!inner(name)")
        .in("categories.name", capitalizedSectors);

      if (categoryError) {
        console.error("Error filtering by categories:", categoryError);
        throw new Error(categoryError.message);
      }

      console.log('Found matching listing categories:', matchingListingCategories);

      // Extract unique listing IDs
      const listingIds = [...new Set(matchingListingCategories?.map((lc: any) => lc.listing_id) || [])];

      console.log('Matching listing IDs:', listingIds);

      if (listingIds.length === 0) {
        // No listings match the selected sectors
        return c.json({ listings: [] });
      }

      // Filter main query by these listing IDs
      query = query.in("id", listingIds);
    }

    const { data: listingsData, error: listingsError } = await query;
      
    if (listingsError) {
      console.error("Error fetching listings from database:", listingsError);
      throw new Error(listingsError.message);
    }
    
    // Transform the data to match the frontend format
    const listings = (listingsData || []).map((listing: any) => {
      // Extract categories
      const categories = listing.listing_categories?.map((lc: any) => lc.categories?.name).filter(Boolean) || [];
      
      // Extract contacts
      const contacts = listing.listing_contacts?.map((lc: any) => lc.contacts).filter(Boolean) || [];
      
      // Get listing description (should be single record)
      const description = listing.listing_description?.[0] || null;
      
      return {
        id: listing.id,
        title: listing.title,
        address: listing.address,
        developable_area_acres: listing.developable_area_acres,
        buildable_floor_area_sqft: listing.buildable_floor_area_sqft,
        land_value: listing.land_value,
        terms: listing.terms,
        categories,
        contacts,
        description: description ? {
          typography: description.typography,
          access_infrastructure: description.access_infrastructure,
          opportunity_summary: description.opportunity_summary,
          visible_constraints: description.visible_constraints,
          confidence_score: description.confidence_score,
          confidence_explanation: description.confidence_explanation,
        } : null,
      };
    });
    
    return c.json({ listings });
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

// GET single listing by ID
app.get("/make-server-bf94089b/api/listings/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    // Create backend DB client to access the database
    const backendDbUrl = Deno.env.get("SUPABASE_URL");
    const backendDbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!backendDbUrl || !backendDbKey) {
      return c.json({ error: "Backend DB configuration error" }, 500);
    }
    const backendSupabase = createClient(backendDbUrl, backendDbKey);

    // Fetch single listing with all related data
    const { data: listingData, error: listingError } = await backendSupabase
      .from("listing")
      .select(`
        *,
        listing_description (*),
        listing_categories (
          categories (*)
        ),
        listing_contacts (
          contacts (*)
        )
      `)
      .eq("id", id)
      .single();
      
    if (listingError) {
      console.error("Error fetching listing from database:", listingError);
      return c.json({ error: "Listing not found" }, 404);
    }
    
    // Transform the data to match the frontend format
    const categories = listingData.listing_categories?.map((lc: any) => lc.categories?.name).filter(Boolean) || [];
    const contacts = listingData.listing_contacts?.map((lc: any) => lc.contacts).filter(Boolean) || [];
    const description = listingData.listing_description?.[0] || null;
    
    const listing = {
      id: listingData.id,
      title: listingData.title,
      address: listingData.address,
      developable_area_acres: listingData.developable_area_acres,
      buildable_floor_area_sqft: listingData.buildable_floor_area_sqft,
      land_value: listingData.land_value,
      terms: listingData.terms,
      categories,
      contacts,
      description: description ? {
        typography: description.typography,
        access_infrastructure: description.access_infrastructure,
        opportunity_summary: description.opportunity_summary,
        visible_constraints: description.visible_constraints,
        confidence_score: description.confidence_score,
        confidence_explanation: description.confidence_explanation,
      } : null,
    };
    
    return c.json({ listing });
  } catch (error: any) {
    console.error("Error fetching listing:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

// POST create new listing (requires auth)
app.post("/make-server-bf94089b/api/listings", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userTokenHeader = c.req.header('X-User-Token');
    const token = userTokenHeader || authHeader.replace('Bearer ', '');
    const customProjectId = c.req.header('X-Supabase-Project-Id');
    const customAnonKey = c.req.header('X-Supabase-Anon-Key');

    // Use frontend project for Auth if provided, else fallback to backend env
    const supabaseUrl = customProjectId ? `https://${customProjectId}.supabase.co` : Deno.env.get("SUPABASE_URL");
    const supabaseKey = customAnonKey || Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: "Server configuration error" }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth validation failed:", authError);
      return c.json({ error: "Invalid session token", details: authError }, 401);
    }

    const body = await c.req.json();
    const { 
      title, 
      address, 
      developable_area_acres, 
      buildable_floor_area_sqft, 
      land_value, 
      terms,
      status,
      sectors,
      description
    } = body;

    // Generate UUID for the listing
    const id = crypto.randomUUID();
    
    const newListing = {
      id,
      owner_id: user.id,
      owner_email: user.email,
      title,
      address,
      developable_area_acres: developable_area_acres ? parseFloat(developable_area_acres) : null,
      buildable_floor_area_sqft: buildable_floor_area_sqft ? parseFloat(buildable_floor_area_sqft) : null,
      land_value: land_value ? parseFloat(land_value) : null,
      terms: terms || '',
      status: status || 'draft',
      sectors: sectors || [],
      description: description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const key = `listing:${id}`;

    // Create backend DB client to access the KV table
    const backendDbUrl = Deno.env.get("SUPABASE_URL");
    const backendDbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!backendDbUrl || !backendDbKey) {
      return c.json({ error: "Backend DB configuration error" }, 500);
    }
    const backendSupabase = createClient(backendDbUrl, backendDbKey);

    const { error: upsertError } = await backendSupabase
      .from(TABLE_NAME)
      .upsert({ key, value: newListing });
      
    if (upsertError) {
      throw new Error(upsertError.message);
    }

    return c.json({ listing: newListing });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

// PUT update existing listing (requires auth + ownership)
app.put("/make-server-bf94089b/api/listings/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userTokenHeader = c.req.header('X-User-Token');
    const token = userTokenHeader || authHeader.replace('Bearer ', '');
    const customProjectId = c.req.header('X-Supabase-Project-Id');
    const customAnonKey = c.req.header('X-Supabase-Anon-Key');

    // Use frontend project for Auth if provided, else fallback to backend env
    const supabaseUrl = customProjectId ? `https://${customProjectId}.supabase.co` : Deno.env.get("SUPABASE_URL");
    const supabaseKey = customAnonKey || Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      return c.json({ error: "Server configuration error" }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth validation failed:", authError);
      return c.json({ error: "Invalid session token", details: authError }, 401);
    }

    const id = c.req.param('id');
    
    // Create backend DB client to access the KV table
    const backendDbUrl = Deno.env.get("SUPABASE_URL");
    const backendDbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!backendDbUrl || !backendDbKey) {
      return c.json({ error: "Backend DB configuration error" }, 500);
    }
    const backendSupabase = createClient(backendDbUrl, backendDbKey);

    // Fetch existing listing
    const key = `listing:${id}`;
    const { data: existingData, error: fetchError } = await backendSupabase
      .from(TABLE_NAME)
      .select("value")
      .eq("key", key)
      .single();
      
    if (fetchError || !existingData) {
      return c.json({ error: "Listing not found" }, 404);
    }

    const existingListing = existingData.value;
    
    // Check ownership
    if (existingListing.owner_id !== user.id) {
      return c.json({ error: "You do not have permission to edit this listing" }, 403);
    }

    const body = await c.req.json();
    
    const updatedListing = {
      ...existingListing,
      ...body,
      id, // Ensure ID doesn't change
      owner_id: existingListing.owner_id, // Ensure owner doesn't change
      updated_at: new Date().toISOString()
    };

    // Update the listing in KV store
    const { error: upsertError } = await backendSupabase
      .from(TABLE_NAME)
      .upsert({ key, value: updatedListing });
      
    if (upsertError) {
      throw new Error(upsertError.message);
    }

    return c.json({ listing: updatedListing });
  } catch (error: any) {
    console.error("Error updating listing:", error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);