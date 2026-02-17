importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyAc2vHnVWLNIoDPwO6VLhruB-GVhOtF6UU',
  authDomain: 'acknkubu.firebaseapp.com',
  projectId: 'acknkubu',
  storageBucket: 'acknkubu.firebasestorage.app',
  messagingSenderId: '728140484672',
  appId: '1:728140484672:web:2f3acda3ede36f57b8cfa5',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
