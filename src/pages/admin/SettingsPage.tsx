import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Save, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceTime {
  time: string
  language: string
  venue: string
}

const DEFAULT_SERVICE_TIMES: ServiceTime[] = [
  { time: '8:30 AM - 9:45 AM', language: 'English', venue: 'Main Church' },
  { time: '10:00 AM - 12:00 PM', language: 'Kiswahili', venue: 'Main Church' },
]

export function SettingsPage() {
  const [churchName, setChurchName] = useState('ACK St Francis Nkubu');
  const [churchEmail, setChurchEmail] = useState('');
  const [churchPhone, setChurchPhone] = useState('');
  const [churchAddress, setChurchAddress] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableGiving, setEnableGiving] = useState(true);
  const [enableCommunity, setEnableCommunity] = useState(true);
  const [serviceTimes, setServiceTimes] = useState<ServiceTime[]>(DEFAULT_SERVICE_TIMES);
  const [dailyVerseText, setDailyVerseText] = useState('');
  const [dailyVerseReference, setDailyVerseReference] = useState('');
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
          case 'service_times': if (Array.isArray(value) && value.length) setServiceTimes(value); break;
          case 'daily_verse':
            if (value?.text) setDailyVerseText(value.text);
            if (value?.reference) setDailyVerseReference(value.reference);
            break;
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
      { key: 'service_times', value: serviceTimes },
      { key: 'daily_verse', value: { text: dailyVerseText, reference: dailyVerseReference } },
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
          <h2 className="text-xl font-semibold text-navy mb-4">M-Pesa Paybill</h2>
          <Link
            to="/admin/paybill-settings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Smartphone className="w-5 h-5" />
            Configure Paybill Settings
          </Link>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Sunday Service Times</h2>
          <div className="space-y-3">
            {serviceTimes.map((slot, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-center">
                <input
                  type="text"
                  value={slot.time}
                  onChange={(e) => setServiceTimes(prev => prev.map((s, idx) => idx === i ? { ...s, time: e.target.value } : s))}
                  placeholder="e.g. 8:30 AM - 9:45 AM"
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={slot.language}
                  onChange={(e) => setServiceTimes(prev => prev.map((s, idx) => idx === i ? { ...s, language: e.target.value } : s))}
                  placeholder="Language"
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slot.venue}
                    onChange={(e) => setServiceTimes(prev => prev.map((s, idx) => idx === i ? { ...s, venue: e.target.value } : s))}
                    placeholder="Venue"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  {serviceTimes.length > 1 && (
                    <button
                      onClick={() => setServiceTimes(prev => prev.filter((_, idx) => idx !== i))}
                      className="px-2 py-1 text-red-500 hover:bg-red-50 rounded text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => setServiceTimes(prev => [...prev, { time: '', language: '', venue: '' }])}
              className="text-sm text-navy hover:underline"
            >
              + Add service time
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Daily Verse</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Verse Text</label>
              <textarea
                value={dailyVerseText}
                onChange={(e) => setDailyVerseText(e.target.value)}
                rows={3}
                placeholder="Enter the Bible verse text..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reference</label>
              <input
                type="text"
                value={dailyVerseReference}
                onChange={(e) => setDailyVerseReference(e.target.value)}
                placeholder="e.g. John 3:16"
                className="w-full px-3 py-2 border rounded-lg text-sm"
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
