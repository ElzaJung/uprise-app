import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';

const SECTORS = [
  { id: 'energy', name: 'Energy', icon: '⚡' },
  { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
  { id: 'community', name: 'Community', icon: '🏘️' },
  { id: 'tourism', name: 'Tourism', icon: '🏞️' },
];

export default function SearcherOnboarding() {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    company: '',
  });
  const [interests, setInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleInterest = (sectorId: string) => {
    setInterests((prev) =>
      prev.includes(sectorId)
        ? prev.filter((id) => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const handleComplete = () => {
    navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Profile Basics */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Basics</h2>
            <p className="text-gray-600 mb-8">Tell us about yourself</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Your company"
                />
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}

        {/* Step 2: Interest Filters */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Are You Looking For?</h2>
            <p className="text-gray-600 mb-8">Select the types of land opportunities that interest you</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {SECTORS.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => toggleInterest(sector.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    interests.includes(sector.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-3">{sector.icon}</div>
                  <h3 className="font-semibold text-gray-900">{sector.name}</h3>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">You're All Set!</h2>
            <p className="text-gray-600 mb-8">Start browsing available land listings</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Your Interests:</h3>
              <div className="flex flex-wrap gap-2">
                {interests.length > 0 ? (
                  interests.map((id) => {
                    const sector = SECTORS.find((s) => s.id === id);
                    return (
                      <span
                        key={id}
                        className="px-4 py-2 bg-white border border-blue-300 rounded-full text-sm font-medium text-gray-700"
                      >
                        {sector?.icon} {sector?.name}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-600">All sectors</span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                Browse Listings
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}