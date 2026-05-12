import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, ArrowLeft, Check, X } from 'lucide-react';

export default function AuthGate() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successUser, setSuccessUser] = useState<any>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading, login, signup, loginWithOAuth } = useAuth();
  const [searchParams] = useSearchParams();

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  // Auto redirect if already logged in and not showing success animation
  useEffect(() => {
    if (!authLoading && user && !successUser) {
      console.log("AuthGate: User already logged in, redirecting to land analyzer");
      navigate('/land_analyzer', { replace: true });
    }
  }, [user, authLoading, navigate, successUser]);

  const handleRedirect = (loggedInUser: any) => {
    setTimeout(() => {
      navigate('/land_analyzer');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isSignUp) {
        const newUser = await signup(email, password, name);
        if (newUser) {
          setSuccessUser(newUser);
          handleRedirect(newUser);
        }
      } else {
        const loggedInUser = await login(email, password);
        if (loggedInUser) {
          setSuccessUser(loggedInUser);
          handleRedirect(loggedInUser);
        }
      }
    } catch (err: any) {
      let message = err.message || 'An error occurred during authentication';
      
      // Provide more helpful context for generic auth errors
      if (message.includes('Invalid login credentials') || message.includes('Email not confirmed')) {
        if (message.includes('Invalid login credentials')) {
          message = 'Invalid email or password. Please check your credentials or switch to Sign Up if you don\'t have an account.';
        }
      } else {
        // Log unexpected errors
        console.error('Authentication error:', err);
      }
      
      setError(message);
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setError(null);
    setLoading(true);
    
    try {
      await loginWithOAuth(provider);
      // OAuth will redirect, so no need to navigate manually
    } catch (err: any) {
      console.error(`OAuth ${provider} error:`, err);
      setError(err.message || `An error occurred during ${provider} authentication`);
      setLoading(false);
    }
  };

  const handleGuestBrowse = () => {
    navigate('/browse');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (successUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div 
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center"
          style={{ animation: 'popIn 0.5s ease-out forwards' }}
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600 animate-[bounce_1s_ease-in-out_1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome{successUser.name ? ` ${successUser.name}` : ''}!</h2>
          <p className="text-gray-500 mb-6">Taking you to your dashboard...</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 bg-emerald-600 h-full rounded-full" 
              style={{ animation: 'progressBar 1.5s ease-out forwards' }}
            ></div>
            <style>{`
              @keyframes progressBar {
                0% { width: 0%; }
                100% { width: 100%; }
              }
              @keyframes popIn {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
          
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 ${
                  isSignUp && password.length > 0 && !isPasswordValid
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
                placeholder="••••••••"
                required
                minLength={isSignUp ? 8 : 6}
              />
              {isSignUp && (
                <div className="mt-3 text-sm">
                  <p className="text-gray-600 mb-3">
                    Use at least 8 characters, including uppercase, lowercase, number, and special character.
                  </p>
                  <ul className="space-y-2">
                    <li className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {hasMinLength ? <Check className="size-4" /> : <X className="size-4" />} Minimum 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${hasUpperCase ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {hasUpperCase ? <Check className="size-4" /> : <X className="size-4" />} One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${hasLowerCase ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {hasLowerCase ? <Check className="size-4" /> : <X className="size-4" />} One lowercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {hasNumber ? <Check className="size-4" /> : <X className="size-4" />} One number
                    </li>
                    <li className={`flex items-center gap-2 ${hasSpecialChar ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {hasSpecialChar ? <Check className="size-4" /> : <X className="size-4" />} One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || (isSignUp && !isPasswordValid)}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleGuestBrowse}
              className="text-gray-600 hover:text-gray-900 text-sm"
              disabled={loading}
            >
              Continue as Guest (View Only)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}