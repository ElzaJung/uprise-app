import { useState } from 'react';
import { User, Building2, Bell, Lock, CreditCard, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
      <div className="h-full overflow-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          <div className="flex gap-8">
            {/* Tabs */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-emerald-50 text-emerald-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="size-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-semibold text-emerald-700">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Change Photo
                        </button>
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="(555) 123-4567"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.role}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'organization' && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Organization Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="Acme Corp"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                        <option>Individual</option>
                        <option>Company</option>
                        <option>Non-profit</option>
                        <option>Government</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div className="pt-6 border-t border-gray-200">
                      <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    {[
                      { title: 'Analysis Complete', desc: 'Get notified when your parcel analysis is ready' },
                      { title: 'New Requests', desc: 'Receive alerts when someone requests collaboration' },
                      { title: 'Messages', desc: 'Get notified of new messages in your inbox' },
                      { title: 'Listing Activity', desc: 'Updates on views and saves for your listings' },
                      { title: 'Weekly Summary', desc: 'Receive a weekly digest of your activity' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start justify-between py-4 border-b border-gray-200 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-red-200 p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Account</h2>
                    <p className="text-gray-600 mb-6">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2">
                      <Trash2 className="size-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription & Billing</h2>
                  <div className="space-y-6">
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Free Plan</h3>
                          <p className="text-sm text-gray-600 mt-1">Basic features for individual users</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                          Active
                        </span>
                      </div>
                      <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                        Upgrade to Pro
                      </button>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Billing History</h3>
                      <div className="text-center py-8 text-gray-500">
                        No billing history available
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
