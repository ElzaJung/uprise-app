import { supabase } from './supabase/client';
import { projectId, publicAnonKey } from './supabase/info';

const EDGE_FUNCTION_URL = 'https://luokxzkqekitqdmzvrhf.supabase.co/functions/v1/make-server-bf94089b';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  
  return {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json',
    'X-User-Token': session?.access_token || '',
    'X-Supabase-Project-Id': projectId,
    'X-Supabase-Anon-Key': publicAnonKey,
  };
}

// Listings API
export const listingsAPI = {
  // Get all listings (public, no auth required)
  async getAll(sectors?: string[]) {
    try {
      let url = `${EDGE_FUNCTION_URL}/api/listings`;

      // Add sectors filter if provided
      if (sectors && sectors.length > 0) {
        url += `?sectors=${sectors.join(',')}`;
      }

      console.log('📡 [API] Fetching listings from:', url);
      console.log('📡 [API] Using anon key:', publicAnonKey.substring(0, 20) + '...');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [API] Response status:', response.status);
      console.log('📡 [API] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('📡 [API] Response error:', errorText);
        throw new Error(`Failed to fetch listings: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📡 [API] Fetched data:', data);
      console.log('📡 [API] Listings count:', data.listings?.length || 0);
      return data.listings || [];
    } catch (error: any) {
      console.error('📡 [API] Error fetching listings:', error);
      console.error('📡 [API] Error name:', error.name);
      console.error('📡 [API] Error message:', error.message);
      throw new Error(error.message || 'Failed to fetch listings');
    }
  },

  // Get single listing by ID (public)
  async getById(id: string) {
    try {
      const url = `${EDGE_FUNCTION_URL}/api/listings/${id}`;
      console.log('Fetching listing from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch listing: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched listing:', data);
      return data.listing;
    } catch (error: any) {
      console.error('Error fetching listing:', error);
      throw new Error(error.message || 'Failed to fetch listing');
    }
  },

  // Create new listing (requires auth)
  async create(listingData: any) {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${EDGE_FUNCTION_URL}/api/listings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(listingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create listing');
      }
      
      const data = await response.json();
      return data.listing;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  // Update existing listing (requires auth + ownership)
  async update(id: string, updates: any) {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${EDGE_FUNCTION_URL}/api/listings/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update listing');
      }
      
      const data = await response.json();
      return data.listing;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },
};

// Parcels API (existing)
export const parcelsAPI = {
  async getAll() {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${EDGE_FUNCTION_URL}/api/parcels`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch parcels');
      }
      
      const data = await response.json();
      return data.parcels || [];
    } catch (error) {
      console.error('Error fetching parcels:', error);
      throw error;
    }
  },

  async create(parcelData: any) {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${EDGE_FUNCTION_URL}/api/parcels`, {
        method: 'POST',
        headers,
        body: JSON.stringify(parcelData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create parcel');
      }

      const data = await response.json();
      return data.parcel;
    } catch (error) {
      console.error('Error creating parcel:', error);
      throw error;
    }
  },
};

// Land Analysis API
export const landAnalysisAPI = {
  // Save land analysis with image
  async create(imageData: string, analysis: any) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const response = await fetch(`${EDGE_FUNCTION_URL}/api/land-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
          'X-User-Token': session?.access_token || '',
        },
        body: JSON.stringify({
          imageData,
          analysis,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save analysis');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving land analysis:', error);
      throw error;
    }
  },

  // Get analysis by ID
  async getById(id: string) {
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/api/land-analysis/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw error;
    }
  },

  // Get all analyses for current user
  async getUserAnalyses() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${EDGE_FUNCTION_URL}/api/land-analysis/user/${session.user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
          'X-User-Token': session.access_token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user analyses');
      }

      const data = await response.json();
      return data.analyses || [];
    } catch (error) {
      console.error('Error fetching user analyses:', error);
      throw error;
    }
  },

  // Delete analysis
  async delete(id: string) {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${EDGE_FUNCTION_URL}/api/land-analysis/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete analysis');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  },
};

// AI Analyzer API (integrated into edge function)
export const aiAnalyzerAPI = {
  // Analyze image with specific analyzer
  async analyze(imageDataUrl: string, analyzer: 'solar' | 'agriculture' | 'building', location?: string) {
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageDataUrl,
          analyzer,
          context: location ? { location } : {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Analysis failed for ${analyzer}`);
      }

      const data = await response.json();
      return data.report;
    } catch (error) {
      console.error(`Error in ${analyzer} analysis:`, error);
      throw error;
    }
  },

  // Run all three analyzers in parallel
  async analyzeAll(imageDataUrl: string, location?: string) {
    try {
      const [solarReport, agricultureReport, buildingReport] = await Promise.all([
        this.analyze(imageDataUrl, 'solar', location),
        this.analyze(imageDataUrl, 'agriculture', location),
        this.analyze(imageDataUrl, 'building', location),
      ]);

      return {
        solar: solarReport,
        agriculture: agricultureReport,
        building: buildingReport,
      };
    } catch (error) {
      console.error('Error running all analyzers:', error);
      throw error;
    }
  },

  // Get list of available analyzers
  async listAnalyzers() {
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/ai/analyzers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch analyzers');
      }
      const data = await response.json();
      return data.analyzers;
    } catch (error) {
      console.error('Error fetching analyzers:', error);
      throw error;
    }
  },

  // Health check
  async health() {
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/ai/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Analyzer API health check failed');
      }
      const data = await response.json();
      return data.status === 'ok' && data.available;
    } catch (error) {
      console.error('Analyzer API health check error:', error);
      return false;
    }
  },
};