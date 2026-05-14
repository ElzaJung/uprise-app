import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { MapPin, MessageSquare, Plus, Mail, CheckCircle, X, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CollaborationRequest {
  id: string;
  senderName: string;
  message: string;
  parcelName: string;
  date: string;
  status: 'new' | 'replied';
  replyMessage?: string;
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Request Data
  const [requests, setRequests] = useState<CollaborationRequest[]>([
    {
      id: 'req_1',
      senderName: 'Sarah Jenkins',
      message: 'Hello, I am very interested in partnering on your solar development land. We have funding ready to deploy for suitable plots in this region.',
      parcelName: 'Prime Solar Development Land',
      date: '2026-04-12T10:30:00Z',
      status: 'new'
    },
    {
      id: 'req_2',
      senderName: 'David Chen',
      message: 'Could you provide more details regarding the soil quality and historical yields of the agricultural plot?',
      parcelName: 'Agricultural Excellence',
      date: '2026-04-10T14:15:00Z',
      status: 'replied',
      replyMessage: 'Absolutely, I will send over the soil reports later today.'
    }
  ]);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const newRequestsCount = requests.filter(r => r.status === 'new').length;

  // 🔥 FETCH REAL PARCELS
  useEffect(() => {
    const fetchParcels = async () => {
      if (!user) return;

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setParcels([]);
          setLoading(false);
          return;
        }

        const token = session?.access_token;

        if (!token) {
          console.error("No access token available");
          setParcels([]);
          setLoading(false);
          return;
        }

        const fetchUrl = `https://${projectId}.supabase.co/functions/v1/make-server-bf94089b/api/parcels`;
        console.log("Fetching parcels from:", fetchUrl);

        const response = await fetch(fetchUrl, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-User-Token': token,
            'X-Supabase-Project-Id': projectId,
            'X-Supabase-Anon-Key': publicAnonKey
          }
        });

        if (!response.ok) {
          const errText = await response.text();
          let err;
          try { err = JSON.parse(errText); } catch (e) { err = errText; }
          console.error("Failed to fetch parcels", err);

          if (response.status === 401 && err?.error === "Invalid session token") {
            await supabase.auth.signOut();
            window.location.href = '/role-select';
            return;
          }

          setParcels([]);
        } else {
          const result = await response.json();
          setParcels(result.parcels || []);
        }
      } catch (err: any) {
        console.error("Fetch error caught in try/catch block:", err.message || err);
        setParcels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, [user]);

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;

    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'replied', replyMessage: replyText } : req
    ));
    setActiveReplyId(null);
    setReplyText('');

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="relative w-full h-full max-w-6xl mx-auto pb-20">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back, {user?.name || 'Owner'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">

        <button
          onClick={() => navigate('/onboarding/owner')}
          className="p-5 sm:p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left group border-2 border-dashed border-emerald-300"
        >
          <Plus className="size-6 sm:size-8 text-emerald-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Add New Parcel</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Start analyzing a new property
          </p>
        </button>

        <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <MapPin className="size-6 sm:size-8 text-emerald-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">My Parcels</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {parcels.length}
          </p>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <MessageSquare className="size-6 sm:size-8 text-emerald-600 mb-2 sm:mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">New Requests</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {newRequestsCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: My Parcels */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col h-fit">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            My Parcels
          </h2>

          {loading ? (
            <p className="text-gray-500 animate-pulse">Loading parcels...</p>
          ) : parcels.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
              <MapPin className="size-10 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No parcels yet.</p>
              <p className="text-sm text-gray-400 mt-1">Add your first one to get started 🚀</p>
            </div>
          ) : (
            <div className="space-y-4">
              {parcels.map((parcel, index) => (
                <div
                  key={parcel.created_at || index}
                  className="p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all bg-gray-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate mb-1">
                        {parcel.location}
                      </p>
                      {parcel.sector && (
                        <p className="text-sm text-gray-600 mb-1">
                          Sector: {parcel.sector}
                        </p>
                      )}
                      {parcel.created_at && (
                        <p className="text-xs text-gray-400">
                          Added: {new Date(parcel.created_at).toLocaleDateString()}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending Analysis
                        </span>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
                          Draft
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/listing/draft/${parcel.created_at || index}`)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-semibold whitespace-nowrap"
                    >
                      Edit Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Collaboration Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col h-fit">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Collaboration Requests
          </h2>

          {requests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
              <Mail className="size-10 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No requests yet.</p>
              <p className="text-sm text-gray-400 mt-1">When someone contacts you, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const isReplying = activeReplyId === request.id;
                return (
                  <div
                    key={request.id}
                    className={`p-5 rounded-xl border transition-all ${request.status === 'new'
                        ? 'border-emerald-200 bg-emerald-50/50 shadow-sm'
                        : 'border-gray-200 bg-gray-50'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900">{request.senderName}</h3>
                          <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${request.status === 'new'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-700'
                            }`}>
                            {request.status === 'new' ? 'New' : 'Replied'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-700">
                          Re: {request.parcelName}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap pt-0.5">
                        {new Date(request.date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 leading-relaxed bg-white p-3 rounded-lg border border-gray-100 shadow-sm italic">
                      "{request.message}"
                    </p>

                    {/* Action Button Row (hidden when replying) */}
                    {!isReplying && !request.replyMessage && (
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => {
                            setActiveReplyId(request.id);
                            setReplyText('');
                          }}
                          className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${request.status === 'new'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          Reply
                        </button>
                      </div>
                    )}

                    {/* Reply Input Area */}
                    <AnimatePresence>
                      {isReplying && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Type your reply to ${request.senderName}...`}
                              className="w-full p-3 text-sm bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none shadow-inner"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2 mt-3">
                              <button
                                onClick={() => {
                                  setActiveReplyId(null);
                                  setReplyText('');
                                }}
                                className="text-sm font-semibold px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSendReply(request.id)}
                                disabled={!replyText.trim()}
                                className="text-sm font-semibold px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                              >
                                Send Reply
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Display Sent Reply if exists */}
                    {!isReplying && request.replyMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-start gap-2 pt-4 border-t border-gray-200/60"
                      >
                        <CornerDownRight className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Your Reply</p>
                          <p className="text-sm font-medium text-emerald-900">{request.replyMessage}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xl ring-1 ring-emerald-900/5"
          >
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-800">Reply sent successfully!</span>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-4 p-1 rounded-full text-emerald-600 hover:bg-emerald-100/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}