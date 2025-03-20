"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Settings() {
  const { data: session } = useSession();
  
  const [generalSettings, setGeneralSettings] = useState({
    language: "english",
    units: "metric",
    theme: "light",
    timeFormat: "24h",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    observationReminders: true,
    weatherAlerts: true,
    systemUpdates: false,
  });
  
  const [dataSettings, setDataSettings] = useState({
    autoSync: true,
    syncFrequency: "15min",
    imageQuality: "high",
    autoUploadImages: true,
    offlineMode: false,
  });
  
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setGeneralSettings({
      ...generalSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };
  
  const handleDataSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setDataSettings({
      ...dataSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
  const saveSettings = (section: string) => {
    // In a real app, this would save the settings to the server
    alert(`${section} settings saved successfully!`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">General Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={generalSettings.language}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                Units
              </label>
              <select
                id="units"
                name="units"
                value={generalSettings.units}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              >
                <option value="metric">Metric (cm, m, km)</option>
                <option value="imperial">Imperial (in, ft, mi)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={generalSettings.theme}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-1">
                Time Format
              </label>
              <select
                id="timeFormat"
                name="timeFormat"
                value={generalSettings.timeFormat}
                onChange={handleGeneralSettingsChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => saveSettings("General")}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded"
              >
                Save General Settings
              </button>
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={notificationSettings.pushNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Push Notifications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="observationReminders"
                  checked={notificationSettings.observationReminders}
                  onChange={handleNotificationSettingsChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Observation Reminders</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="weatherAlerts"
                  checked={notificationSettings.weatherAlerts}
                  onChange={handleNotificationSettingsChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Weather Alerts</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="systemUpdates"
                  checked={notificationSettings.systemUpdates}
                  onChange={handleNotificationSettingsChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">System Updates</span>
              </label>
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => saveSettings("Notification")}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded"
              >
                Save Notification Settings
              </button>
            </div>
          </div>
        </div>
        
        {/* Data Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Data & Synchronization</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="autoSync"
                  checked={dataSettings.autoSync}
                  onChange={handleDataSettingsChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-Sync Data</span>
              </label>
            </div>
            
            {dataSettings.autoSync && (
              <div>
                <label htmlFor="syncFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Sync Frequency
                </label>
                <select
                  id="syncFrequency"
                  name="syncFrequency"
                  value={dataSettings.syncFrequency}
                  onChange={handleDataSettingsChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                >
                  <option value="5min">Every 5 minutes</option>
                  <option value="15min">Every 15 minutes</option>
                  <option value="30min">Every 30 minutes</option>
                  <option value="1hour">Every hour</option>
                  <option value="manual">Manual only</option>
                </select>
              </div>
            )}
            
            <div>
              <label htmlFor="imageQuality" className="block text-sm font-medium text-gray-700 mb-1">
                Image Quality
              </label>
              <select
                id="imageQuality"
                name="imageQuality"
                value={dataSettings.imageQuality}
                onChange={handleDataSettingsChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              >
                <option value="low">Low (faster uploads)</option>
                <option value="medium">Medium</option>
                <option value="high">High (better quality)</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="autoUploadImages"
                  checked={dataSettings.autoUploadImages}
                  onChange={handleDataSettingsChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-Upload Images</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="offlineMode"
                  checked={dataSettings.offlineMode}
                  onChange={handleDataSettingsChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Offline Mode</span>
              </label>
              {dataSettings.offlineMode && (
                <p className="mt-1 text-xs text-gray-500">
                  In offline mode, data will only be synced when you manually trigger a sync.
                </p>
              )}
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => saveSettings("Data")}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded"
              >
                Save Data Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Account Settings */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Account Settings</h2>
        </div>
        <div className="p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details associated with your account.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.name || "Not available"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.email || "Not available"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">{session?.user?.role || "Not available"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Organization</dt>
                <dd className="mt-1 text-sm text-gray-900">AgriResearch Inc.</dd>
              </div>
            </dl>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Connected Accounts</h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Google</p>
                    <p className="text-xs text-gray-500">Connected</p>
                  </div>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900">Disconnect</button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="#2F2F2F" />
                    <path
                      fill="#FFF"
                      d="M11.9 8.4l1.3-1.3h5.8v12.7h-13V11.6l1.3-1.3v8.2h10.4V8.4h-5.8zm-1.3 4.5v-8h8v12.7h-2.6v-8H11.9l-1.3 1.3z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Microsoft</p>
                    <p className="text-xs text-gray-500">Not connected</p>
                  </div>
                </div>
                <button className="text-sm text-primary hover:text-primary-dark">Connect</button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Danger Zone</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Be careful with these actions, they cannot be undone.
            </p>
            <div className="mt-4 space-y-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Export All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}