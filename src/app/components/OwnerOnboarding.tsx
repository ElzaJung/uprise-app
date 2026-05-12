import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, MapPin, Users, ArrowLeft, Navigation, Loader2 } from 'lucide-react';
import { supabase } from "../utils/supabase/client";
import { useAuth } from "../contexts/AuthContext";
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SECTORS = [
  { id: 'energy', name: 'Energy' },
  { id: 'agriculture', name: 'Agriculture' },
  { id: 'community', name: 'Community' },
  { id: 'tourism', name: 'Tourism' },
];

export default function OwnerOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [parcelAddress, setParcelAddress] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Address search debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (parcelAddress && parcelAddress.length >= 3 && showSuggestions) {
        setIsSearchingAddress(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parcelAddress)}&limit=5&addressdetails=1`);
          const data = await res.json();
          setAddressSuggestions(data);
        } catch (err) {
          console.error("Error fetching address:", err);
        } finally {
          setIsSearchingAddress(false);
        }
      } else if (!parcelAddress || parcelAddress.length < 3) {
        setAddressSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [parcelAddress, showSuggestions]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ NEW: Edge function insert via KV Store
  const saveParcel = async () => {
    if (!user) {
      console.log("User not logged in");
      return false;
    }

    if (!parcelAddress) {
      console.log("Please enter a parcel address");
      return false;
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      console.log("Error: No valid session token available");
      setLoading(false);
      return false;
    }

    try {
      const fetchUrl = `https://${projectId}.supabase.co/functions/v1/make-server-bf94089b/api/parcels`;
      console.log("Saving parcel to:", fetchUrl);

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': token,
          'X-Supabase-Project-Id': projectId,
          'X-Supabase-Anon-Key': publicAnonKey
        },
        body: JSON.stringify({
          user_id: user.id,
          location: parcelAddress,
          sector: selectedSectors.join(','),
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        let err;
        try { err = JSON.parse(errText); } catch(e) { err = errText; }
        console.log("Error saving parcel:", err);
        setLoading(false);

        if (response.status === 401 && err?.error === "Invalid session token") {
          // Token is invalid/expired - clear session
          await supabase.auth.signOut();
          window.location.href = '/role-select'; // redirect to login
        }

        return false;
      }

      console.log("✅ Parcel saved successfully");
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error("Error saving parcel caught in try/catch:", err.message || err);
      setLoading(false);
      return false;
    }
  };

  const toggleSector = (sectorId: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorId)
        ? prev.filter((id) => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const addCollaborator = () => {
    if (newCollaborator && !collaborators.includes(newCollaborator)) {
      setCollaborators([...collaborators, newCollaborator]);
      setNewCollaborator('');
    }
  };

  const handleDecision = (action: 'analysis' | 'listing') => {
    if (action === 'analysis') {
      navigate('/dashboard/owner?action=analysis-requested');
    } else {
      navigate('/dashboard/owner'); // 👈 better than mock id
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          let formattedAddress = "";

          // Try Mapbox first if token is available
          const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
          if (mapboxToken) {
            // types: address is most precise, but we fallback to poi, locality, place, region if address is unavailable
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&types=address,poi,locality,place,region&limit=1`);
            
            if (res.ok) {
              const data = await res.json();
              if (data.features && data.features.length > 0) {
                // Mapbox naturally orders features from most precise to least precise
                // place_name includes the full readable address (e.g., street, city, region)
                formattedAddress = data.features[0].place_name;
              }
            }
          }

          // Fallback to Nominatim if Mapbox fails, has no token, or returns no results
          if (!formattedAddress) {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();

            if (data && data.display_name) {
              formattedAddress = data.display_name;
            }
          }

          if (formattedAddress) {
            setParcelAddress(formattedAddress);
            setShowSuggestions(false);
          } else {
            setLocationError("Unable to determine a precise or nearby address");
          }
        } catch (err) {
          console.error("Error reverse geocoding:", err);
          setLocationError("Error connecting to location service");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("An unknown location error occurred");
            break;
        }
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate('/role-select')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Profile Basics</h2>
            <button onClick={() => setStep(2)} className="bg-emerald-600 text-white px-4 py-2 rounded">
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Select Sectors</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSector(s.id)}
                  className={`p-4 border rounded ${
                    selectedSectors.includes(s.id)
                      ? 'bg-emerald-100 border-emerald-600'
                      : ''
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(3)}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Select Parcel</h2>

            <div className="relative mb-2" ref={wrapperRef}>
              <input
                value={parcelAddress}
                onChange={(e) => {
                  setParcelAddress(e.target.value);
                  setShowSuggestions(true);
                  setLocationError("");
                }}
                onFocus={() => {
                  if (parcelAddress.length >= 3) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Enter address"
                className="w-full border p-3 pr-12 rounded"
              />
              
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                title="Use my location"
              >
                {isLocating ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Navigation className="size-5" />
                )}
              </button>

              {showSuggestions && (addressSuggestions.length > 0 || isSearchingAddress) && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg overflow-hidden">
                  {isSearchingAddress ? (
                    <div className="p-3 text-sm text-gray-500">Searching...</div>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto">
                      {addressSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          onClick={() => {
                            setParcelAddress(suggestion.display_name);
                            setShowSuggestions(false);
                            setLocationError("");
                          }}
                          className="px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-start gap-2">
                            <MapPin className="size-4 text-gray-400 mt-0.5 shrink-0" />
                            <span>{suggestion.display_name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {locationError && (
              <p className="text-sm text-red-500 mb-4">{locationError}</p>
            )}

            <div className="bg-gray-100 h-40 flex items-center justify-center mb-4 mt-4">
              Map Placeholder
            </div>

            <button
              onClick={async () => {
                const success = await saveParcel();
                if (success) {
                  setStep(4);
                }
              }}
              disabled={loading}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Confirm Parcel"}
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="bg-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Workspace</h2>

            <input
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              placeholder="Add collaborator"
              className="border p-2 rounded"
            />

            <button
              onClick={addCollaborator}
              className="ml-2 px-3 py-2 bg-emerald-600 text-white rounded"
            >
              Add
            </button>

            <button
              onClick={() => setStep(5)}
              className="block mt-4 bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="bg-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Next Step</h2>

            <button
              onClick={() => handleDecision('analysis')}
              className="block mb-3 bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Request Analysis
            </button>

            <button
              onClick={() => handleDecision('listing')}
              className="block bg-gray-300 px-4 py-2 rounded"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}