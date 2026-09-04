import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import fs from 'fs'

function firebaseSwPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'firebase-sw',
    writeBundle(options) {
      const outDir = options.dir || 'dist'
      const template = fs.readFileSync(
        path.resolve(__dirname, 'src/sw/firebase-messaging-sw.template.js'),
        'utf-8',
      )

      const sw = template
        .replace('__FIREBASE_API_KEY__', env.VITE_FIREBASE_API_KEY || '')
        .replace('__FIREBASE_AUTH_DOMAIN__', env.VITE_FIREBASE_AUTH_DOMAIN || '')
        .replace('__FIREBASE_PROJECT_ID__', env.VITE_FIREBASE_PROJECT_ID || '')
        .replace('__FIREBASE_STORAGE_BUCKET__', env.VITE_FIREBASE_STORAGE_BUCKET || '')
        .replace('__FIREBASE_MESSAGING_SENDER_ID__', env.VITE_FIREBASE_MESSAGING_SENDER_ID || '')
        .replace('__FIREBASE_APP_ID__', env.VITE_FIREBASE_APP_ID || '')

      fs.writeFileSync(path.join(outDir, 'firebase-messaging-sw.js'), sw)
    },
  }
}

export default defineConfig(({ mode }) => {
  // loadEnv, not process.env: Vite does not push .env files into process.env,
  // so a local `npm run build` was writing a service worker with empty config.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
  plugins: [
    react(),
    firebaseSwPlugin(env),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'robots.txt', 'sitemap.xml', 'og-image.jpg'],
      // public/manifest.json is the single source of truth for PWA identity —
      // letting the plugin emit a second one gave index.html two <link rel="manifest">.
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            // Bundled offline Bible JSON (public/bible/**). Deliberately not in
            // globPatterns — precaching ~14 MB would bloat every install — so it
            // is cached on demand instead. Content is immutable per build.
            urlPattern: ({ url }) => url.pathname.startsWith('/bible/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'bible-offline-text',
              expiration: {
                maxEntries: 250,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // api.bible serves the licensed versions from rest.api.bible.
            urlPattern: /^https:\/\/rest\.api\.bible\/.*/i,
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
  }
})
