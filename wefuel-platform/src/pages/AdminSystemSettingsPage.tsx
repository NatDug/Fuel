import React, { useState } from "react";

interface PricingSettings {
  baseFuelPrice: number;
  vatRate: number;
  loadSheddingSurcharge: number;
  regionalSurcharge: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  driverCommission: number;
}

interface SystemSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  requireFicaVerification: boolean;
  maxCardAccounts: number;
  sessionTimeout: number;
  maxRetryAttempts: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderAlerts: boolean;
  systemAlerts: boolean;
}

const mockPricingSettings: PricingSettings = {
  baseFuelPrice: 24.50,
  vatRate: 15,
  loadSheddingSurcharge: 2.50,
  regionalSurcharge: 1.00,
  minimumOrderAmount: 100,
  deliveryFee: 25,
  driverCommission: 12
};

const mockSystemSettings: SystemSettings = {
  maintenanceMode: false,
  allowNewRegistrations: true,
  requireFicaVerification: true,
  maxCardAccounts: 3,
  sessionTimeout: 30,
  maxRetryAttempts: 3
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  orderAlerts: true,
  systemAlerts: true
};

const AdminSystemSettingsPage: React.FC = () => {
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(mockPricingSettings);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(mockSystemSettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [activeTab, setActiveTab] = useState("pricing");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handlePricingChange = (field: keyof PricingSettings, value: number) => {
    setPricingSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemChange = (field: keyof SystemSettings, value: boolean | number) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleReset = () => {
    setPricingSettings(mockPricingSettings);
    setSystemSettings(mockSystemSettings);
    setNotificationSettings(mockNotificationSettings);
  };

  const tabs = [
    { id: "pricing", name: "Pricing & Fees", icon: "💰" },
    { id: "system", name: "System Settings", icon: "⚙️" },
    { id: "notifications", name: "Notifications", icon: "🔔" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure platform settings and parameters</p>
        </div>

        {/* Success Message */}
        {showSaveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Settings saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === "pricing" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">Pricing & Fee Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Fuel Price (R/litre)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingSettings.baseFuelPrice}
                    onChange={(e) => handlePricingChange('baseFuelPrice', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricingSettings.vatRate}
                    onChange={(e) => handlePricingChange('vatRate', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Load Shedding Surcharge (R/litre)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingSettings.loadSheddingSurcharge}
                    onChange={(e) => handlePricingChange('loadSheddingSurcharge', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regional Surcharge (R/litre)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingSettings.regionalSurcharge}
                    onChange={(e) => handlePricingChange('regionalSurcharge', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Amount (R)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingSettings.minimumOrderAmount}
                    onChange={(e) => handlePricingChange('minimumOrderAmount', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Fee (R)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingSettings.deliveryFee}
                    onChange={(e) => handlePricingChange('deliveryFee', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricingSettings.driverCommission}
                    onChange={(e) => handlePricingChange('driverCommission', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">System Configuration</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                    <p className="text-sm text-gray-500">Temporarily disable the platform for maintenance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => handleSystemChange('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Allow New Registrations</h4>
                    <p className="text-sm text-gray-500">Enable or disable new user registrations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.allowNewRegistrations}
                      onChange={(e) => handleSystemChange('allowNewRegistrations', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Require FICA Verification</h4>
                    <p className="text-sm text-gray-500">Mandate FICA document verification for all users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.requireFicaVerification}
                      onChange={(e) => handleSystemChange('requireFicaVerification', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Card Accounts
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={systemSettings.maxCardAccounts}
                    onChange={(e) => handleSystemChange('maxCardAccounts', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Maximum number of accounts that can use the same card</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => handleSystemChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">How long before users are automatically logged out</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Retry Attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={systemSettings.maxRetryAttempts}
                    onChange={(e) => handleSystemChange('maxRetryAttempts', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Maximum login attempts before account lockout</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">Notification Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Send notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">Send notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-500">Send push notifications to mobile apps</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Order Alerts</h4>
                    <p className="text-sm text-gray-500">Send alerts for new orders and status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderAlerts}
                      onChange={(e) => handleNotificationChange('orderAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">System Alerts</h4>
                    <p className="text-sm text-gray-500">Send alerts for system issues and maintenance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.systemAlerts}
                      onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemSettingsPage; 