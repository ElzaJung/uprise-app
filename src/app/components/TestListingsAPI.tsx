import { useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const EDGE_FUNCTION_URL = 'https://luokxzkqekitqdmzvrhf.supabase.co/functions/v1/make-server-bf94089b';
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b2t4emtxZWtpdHFkbXp2cmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTA0NjYsImV4cCI6MjA5MDcyNjQ2Nn0.LwbGy5uOP2Po548JEJm48i3W_KJyAjI05dwEq_KPUF4';

export default function TestListingsAPI() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testEndpoint = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    try {
      const url = `${EDGE_FUNCTION_URL}/api/listings`;
      console.log('Testing endpoint:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Test Listings API
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              <strong>Endpoint:</strong> {EDGE_FUNCTION_URL}/api/listings
            </p>
            <p className="text-gray-600">
              <strong>Method:</strong> GET
            </p>
          </div>

          <button
            onClick={testEndpoint}
            disabled={testing}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {testing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Endpoint'
            )}
          </button>

          {result && (
            <div className="mt-8 border border-emerald-200 rounded-lg p-6 bg-emerald-50">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-emerald-900">
                  Success! Fetching from Supabase
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Listings found:</strong> {result.listings?.length || 0}
              </p>
              <pre className="bg-white p-4 rounded border border-emerald-200 overflow-auto max-h-96 text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div className="mt-8 border border-red-200 rounded-lg p-6 bg-red-50">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-red-900">
                  Error - Not Fetching from Supabase
                </h2>
              </div>
              <p className="text-red-700 mb-4 font-mono text-sm">
                {error}
              </p>
              <div className="bg-white p-4 rounded border border-red-200">
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Possible reasons:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Edge function hasn't deployed yet</li>
                  <li>Supabase project is down</li>
                  <li>Network connectivity issue</li>
                  <li>CORS configuration problem</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Expected Result:</h3>
            <p className="text-gray-700 text-sm mb-3">
              If working correctly, you should see 3 listings:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>Prime Solar Development Land (Austin, TX)</li>
              <li>Scenic Tourism Property (Denver, CO)</li>
              <li>Agricultural Excellence (Fresno, CA)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
