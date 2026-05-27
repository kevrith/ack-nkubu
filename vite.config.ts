import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import fs from 'fs'

function firebaseSwPlugin(): Plugin {
  return {
    name: 'firebase-sw',
    writeBundle(options) {
      const outDir = options.dir || 'dist'
      const apiKey = process.env.VITE_FIREBASE_API_KEY || ''
      const authDomain = process.env.VITE_FIREBASE_AUTH_DOMAIN || ''
      const projectId = process.env.VITE_FIREBASE_PROJECT_ID || ''
      const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET || ''
      const messagingSenderId = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''
      const appId = process.env.VITE_FIREBASE_APP_ID || ''

      const sw = `importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: '${apiKey}',
  authDomain: '${authDomain}',
  projectId: '${projectId}',
  storageBucket: '${storageBucket}',
  messagingSenderId: '${messagingSenderId}',
  appId: '${appId}',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'New Message'
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})
`
      fs.writeFileSync(path.join(outDir, 'firebase-messaging-sw.js'), sw)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    firebaseSwPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'ACK Parish Church',
        short_name: 'ACK Parish',
        description: 'Anglican Church of Kenya Parish Web Application',
        theme_color: '#1a3a5c',
        background_color: '#1a3a5c',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.bible\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bible-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          },
          {
            // Supabase REST API — network-first with offline fallback
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-data-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Supabase Storage (images, media)
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-storage-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Google Fonts and other static external assets
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
