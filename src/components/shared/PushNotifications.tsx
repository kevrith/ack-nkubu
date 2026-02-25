import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export function PushNotifications() {
  const { user } = useAuthStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const [enabling, setEnabling] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [foregroundNotif, setForegroundNotif] = useState<any>(null);

  // Show the permission prompt after 10 s if not yet decided
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [user]);

  // Persistent foreground message listener
  useEffect(() => {
    const unsubscribe = onMessageListener((payload: any) => {
      setForegroundNotif(payload);
      setTimeout(() => setForegroundNotif(null), 6000);
    });
    return () => unsubscribe();
  }, []);

  const handleEnable = async () => {
    setEnabling(true);
    setStatus('idle');
    try {
      const token = await requestNotificationPermission();
      if (token && user) {
        const { error } = await supabase
          .from('profiles')
          .update({ notification_token: token })
          .eq('id', user.id);

        if (error) throw error;

        setStatus('success');
        setTimeout(() => {
          setShowPrompt(false);
          setStatus('idle');
        }, 2000);
      } else {
        // Permission was denied or token retrieval failed
        setStatus('error');
      }
    } catch (err) {
      console.error('Error enabling notifications:', err);
      setStatus('error');
    } finally {
      setEnabling(false);
    }
  };

  return (
    <>
      {/* ── Permission prompt ── */}
      {showPrompt && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-white rounded-xl shadow-2xl p-4 w-80 z-[70] border-l-4 border-navy animate-in slide-in-from-right">
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-navy mb-1">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Get notified about sermons, events, and church announcements.
              </p>

              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                  <CheckCircle className="h-4 w-4" />
                  Notifications enabled!
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
                  <AlertCircle className="h-4 w-4" />
                  Could not enable — check browser permissions.
                </div>
              )}

              {status !== 'success' && (
                <div className="flex gap-2">
                  <button
                    onClick={handleEnable}
                    disabled={enabling}
                    className="flex-1 px-3 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {enabling ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enabling…
                      </span>
                    ) : (
                      'Enable Notifications'
                    )}
                  </button>
                  <button
                    onClick={() => setShowPrompt(false)}
                    className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  >
                    Later
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Foreground notification toast ── */}
      {foregroundNotif && (
        <div className="fixed top-20 right-4 bg-white rounded-xl shadow-2xl p-4 w-80 z-[70] border-l-4 border-gold">
          <button
            onClick={() => setForegroundNotif(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="h-4 w-4 text-navy" />
            </div>
            <div className="pr-4">
              <h4 className="font-semibold text-navy text-sm">
                {foregroundNotif.notification?.title}
              </h4>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                {foregroundNotif.notification?.body}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
