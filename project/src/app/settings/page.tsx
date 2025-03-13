'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { FiUser, FiGlobe, FiDatabase, FiWifi, FiTablet } from 'react-icons/fi';

export default function SettingsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isOfflineEnabled, setIsOfflineEnabled] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('auto');
  const [maxStorageSpace, setMaxStorageSpace] = useState('1000');
  const [mapType, setMapType] = useState('satellite');
  const [distanceUnit, setDistanceUnit] = useState('metric');
  const [language, setLanguage] = useState('en');
  
  // Mock profile data
  const profile = {
    name: session?.user?.name || 'User',
    email: session?.user?.email || 'email@example.com',
    role: (session?.user as any)?.role || 'researcher',
    organization: 'AgriTech Research',
  };

  if (status === 'loading') {
    return <div className="flex justify-center py-8">Loading settings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              activeTab === 'profile'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <FiUser className="mr-2" /> Profile
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              activeTab === 'display'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('display')}
          >
            <FiGlobe className="mr-2" /> Display & Language
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              activeTab === 'sync'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('sync')}
          >
            <FiWifi className="mr-2" /> Synchronization
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              activeTab === 'data'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('data')}
          >
            <FiDatabase className="mr-2" /> Data Storage
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              activeTab === 'device'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('device')}
          >
            <FiTablet className="mr-2" /> Device
          </button>
        </div>

        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Name is managed through your SSO provider
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email is managed through your SSO provider
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <input
                    type="text"
                    value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1).replace('-', ' ')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Roles are assigned by administrators
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization</label>
                  <input
                    type="text"
                    value={profile.organization}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Organization membership is managed by administrators
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Display & Language Settings */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Display & Language</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Map Type</label>
                  <select
                    value={mapType}
                    onChange={(e) => setMapType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="satellite">Satellite</option>
                    <option value="terrain">Terrain</option>
                    <option value="roadmap">Road Map</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distance Units</label>
                  <select
                    value={distanceUnit}
                    onChange={(e) => setDistanceUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="metric">Metric (m, km)</option>
                    <option value="imperial">Imperial (ft, mi)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="system">System Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Synchronization Settings */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Synchronization</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isOfflineEnabled}
                      onChange={() => setIsOfflineEnabled(!isOfflineEnabled)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable offline mode</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                    When enabled, data will be stored locally and synchronized when online
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sync Frequency</label>
                  <select
                    value={syncFrequency}
                    onChange={(e) => setSyncFrequency(e.target.value)}
                    disabled={!isOfflineEnabled}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <option value="auto">Automatic (when connection available)</option>
                    <option value="manual">Manual only</option>
                    <option value="15">Every 15 minutes when online</option>
                    <option value="30">Every 30 minutes when online</option>
                    <option value="60">Every hour when online</option>
                  </select>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Sync Status</span>
                    <button
                      disabled={!isOfflineEnabled}
                      className="px-2 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sync Now
                    </button>
                  </div>
                  <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
                    <p>Last successful sync: <span className="font-semibold">Today, 2:45 PM</span></p>
                    <p>Status: <span className="text-green-600 dark:text-green-400">Successful</span></p>
                    <p>Items synchronized: <span>12 observations, 3 images</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Storage Settings */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Data Storage</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Local Storage (MB)
                  </label>
                  <input
                    type="number"
                    value={maxStorageSpace}
                    onChange={(e) => setMaxStorageSpace(e.target.value)}
                    min="100"
                    max="5000"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum space to use for offline data storage
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image Quality</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="high">High (original resolution)</option>
                    <option value="medium">Medium (compressed)</option>
                    <option value="low">Low (highly compressed)</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Lower quality uses less storage space
                  </p>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <button
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Clear Local Data Cache
                  </button>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This will remove all locally stored data. Make sure everything is synchronized first.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Device Settings */}
          {activeTab === 'device' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Device Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GPS Accuracy</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="high">High (uses more battery)</option>
                    <option value="balanced">Balanced</option>
                    <option value="low">Low Power</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Connected Equipment
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
                    No equipment connected
                  </div>
                  <button className="mt-2 px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                    Connect Device
                  </button>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Device Information</h3>
                  <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
                    <p>App Version: <span className="font-semibold">1.0.0</span></p>
                    <p>Browser: <span className="font-semibold">Chrome 98.0.4758.102</span></p>
                    <p>Operating System: <span className="font-semibold">macOS 12.2.1</span></p>
                    <p>Device Type: <span className="font-semibold">Desktop</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}