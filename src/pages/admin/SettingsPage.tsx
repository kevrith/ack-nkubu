import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Save } from 'lucide-react';

export function SettingsPage() {
  const [churchName, setChurchName] = useState('ACK St Francis Nkubu');
  const [churchEmail, setChurchEmail] = useState('');
  const [churchPhone, setChurchPhone] = useState('');
  const [churchAddress, setChurchAddress] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableGiving, setEnableGiving] = useState(true);
  const [enableCommunity, setEnableCommunity] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('cms_settings')
      .select('*');

    if (data) {
      data.forEach(setting => {
        const value = setting.value;
        switch (setting.key) {
          case 'church_name': setChurchName(value); break;
          case 'church_email': setChurchEmail(value); break;
          case 'church_phone': setChurchPhone(value); break;
          case 'church_address': setChurchAddress(value); break;
          case 'enable_notifications': setEnableNotifications(value); break;
          case 'enable_giving': setEnableGiving(value); break;
          case 'enable_community': setEnableCommunity(value); break;
        }
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const settings = [
      { key: 'church_name', value: churchName },
      { key: 'church_email', value: churchEmail },
      { key: 'church_phone', value: churchPhone },
      { key: 'church_address', value: churchAddress },
      { key: 'enable_notifications', value: enableNotifications },
      { key: 'enable_giving', value: enableGiving },
      { key: 'enable_community', value: enableCommunity },
    ];

    for (const setting of settings) {
      await supabase
        .from('cms_settings')
        .upsert({ key: setting.key, value: setting.value });
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ Settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-navy mb-4">Church Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Church Name</label>
              <input
                type="text"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={churchEmail}
                onChange={(e) => setChurchEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={churchPhone}
                onChange={(e) => setChurchPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                value={churchAddress}
                onChange={(e) => setChurchAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Feature Toggles</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="rounded"
              />
              <span>Enable Push Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enableGiving}
                onChange={(e) => setEnableGiving(e.target.checked)}
                className="rounded"
              />
              <span>Enable Online Giving</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enableCommunity}
                onChange={(e) => setEnableCommunity(e.target.checked)}
                className="rounded"
              />
              <span>Enable Community Posts</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
