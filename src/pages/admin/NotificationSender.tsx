import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, Send, Users } from 'lucide-react';

export function NotificationSender() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState<'all' | 'role'>('all');
  const [targetRole, setTargetRole] = useState('basic_member');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!title || !body) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      let query = supabase
        .from('profiles')
        .select('notification_token')
        .not('notification_token', 'is', null);

      if (target === 'role') {
        query = query.eq('role', targetRole);
      }

      const { data: profiles } = await query;

      if (!profiles || profiles.length === 0) {
        alert('No users with notification tokens found');
        setLoading(false);
        return;
      }

      // Get user IDs for database notifications
      const { data: userProfiles } = await supabase
        .from('profiles')
        .select('id')
        .not('notification_token', 'is', null);

      // Save to database for in-app notifications
      if (userProfiles && userProfiles.length > 0) {
        const notifications = userProfiles.map(p => ({
          user_id: p.id,
          title,
          message: body,
        }));
        await supabase.from('notifications').insert(notifications);
      }

      // Call Firebase Cloud Messaging via edge function
      await supabase.functions.invoke('send-notification', {
        body: {
          tokens: profiles.map(p => p.notification_token),
          title,
          body,
        },
      });

      setSuccess(true);
      setTitle('');
      setBody('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8 text-navy" />
        <h1 className="text-3xl font-playfair text-navy">Send Notification</h1>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ Notification sent successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Target Audience</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="all"
                checked={target === 'all'}
                onChange={(e) => setTarget(e.target.value as any)}
                className="rounded"
              />
              <span>All Users</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="role"
                checked={target === 'role'}
                onChange={(e) => setTarget(e.target.value as any)}
                className="rounded"
              />
              <span>By Role</span>
            </label>
          </div>

          {target === 'role' && (
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="basic_member">Basic Members</option>
              <option value="leader">Leaders</option>
              <option value="clergy">Clergy</option>
              <option value="admin">Admins</option>
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notification Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., New Event This Sunday"
            className="w-full px-4 py-2 border rounded-lg"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter your notification message..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{body.length}/200 characters</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Preview</p>
              <p className="font-semibold">{title || 'Notification Title'}</p>
              <p className="text-blue-700">{body || 'Notification message will appear here...'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={loading || !title || !body}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
          {loading ? 'Sending...' : 'Send Notification'}
        </button>
      </div>
    </div>
  );
}
