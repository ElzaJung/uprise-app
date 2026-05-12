import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function RedirectToLandAnalyzer() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/land_analyzer', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );
}
