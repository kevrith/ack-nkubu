/* eslint-disable no-undef */
/**
 * Firebase background-messaging service worker.
 *
 * This is a TEMPLATE, not a shipped file: the `firebaseSwPlugin` in
 * vite.config.ts substitutes the __FIREBASE_*__ placeholders from env at build
 * time and writes the result to dist/firebase-messaging-sw.js, so no keys are
 * committed here.
 */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: '__FIREBASE_API_KEY__',
  authDomain: '__FIREBASE_AUTH_DOMAIN__',
  projectId: '__FIREBASE_PROJECT_ID__',
  storageBucket: '__FIREBASE_STORAGE_BUCKET__',
  messagingSenderId: '__FIREBASE_MESSAGING_SENDER_ID__',
  appId: '__FIREBASE_APP_ID__',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  // Data-only pushes arrive with no "notification" block, so fall back to data.
  const n = payload.notification || payload.data || {}
  const title = n.title || 'ACK St Francis Nkubu'

  self.registration.showNotification(title, {
    body: n.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    // The OS picks the sound for background notifications; vibration and the
    // alert behaviour below are the parts a web app actually controls.
    vibrate: [200, 100, 200],
    silent: false,
    // A stable tag collapses duplicates; renotify still alerts on the newest.
    tag: n.tag || 'ack-notification',
    renotify: true,
    data: { url: (payload.data && payload.data.url) || '/notifications' },
  })
})

// Focus an already-open tab if there is one, otherwise open the app.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/notifications'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if ('navigate' in client) client.navigate(target)
          return client.focus()
        }
      }
      return self.clients.openWindow(target)
    })
  )
})
