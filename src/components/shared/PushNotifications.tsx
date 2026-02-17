import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export function PushNotifications() {
  const { user } = useAuthStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    onMessageListener().then((payload: any) => {
      setNotification(payload);
      setTimeout(() => setNotification(null), 5000);
    });
  }, []);

  const handleEnable = async () => {
    try {
      const token = await requestNotificationPermission();
      if (token && user) {
        await supabase
          .from('profiles')
          .update({ notification_token: token })
          .eq('id', user.id);
        setShowPrompt(false);
      } else {
        console.error('Failed to get notification token');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  return (
    <>
      {showPrompt && (
        <div className="fixed bottom-20 right-4 md:bottom-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50 border-l-4 border-navy">
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <Bell className="h-6 w-6 text-navy flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-navy mb-1">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enable notifications to receive updates about events, sermons, and announcements.
              </p>
              <button
                onClick={handleEnable}
                className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 text-sm"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50 border-l-4 border-gold">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-navy">{notification.notification?.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notification.notification?.body}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
