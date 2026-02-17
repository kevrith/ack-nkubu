# ACK St Francis Nkubu Parish Web Application

<div align="center">
  <img src="public/MERU.png" alt="ACK St Francis Nkubu" width="120" />
  <h3>A Modern Progressive Web App for Anglican Church of Kenya</h3>
  <p>Built with React, TypeScript, Tailwind CSS, and Supabase</p>
</div>

---

## 🌟 Overview

ACK St Francis Nkubu Parish Web Application is a comprehensive digital platform designed to connect, engage, and serve the parish community. This Progressive Web App (PWA) provides members with instant access to spiritual resources, community features, and parish services from any device.

### Why This App?

- **📱 Mobile-First**: Fully responsive design optimized for smartphones, tablets, and desktops
- **⚡ Progressive Web App**: Install on any device, works offline, fast loading
- **🔒 Secure**: Role-based access control with Supabase authentication and RLS
- **🌐 Real-time**: Live updates for events, notices, and community interactions
- **💰 Digital Giving**: Integrated M-Pesa payments for tithes and offerings
- **🔔 Push Notifications**: Stay updated with parish announcements

---

## ✨ Features

### For All Members

#### 📖 Bible Reader
- Multiple translations (NIV, NLT, KJV, NRSV, NKJV)
- Chapter selector for quick navigation
- Adjustable font sizes
- Bookmarks and reading plans
- Search functionality
- Keyboard shortcuts (Arrow keys for navigation)

#### 🙏 Prayers & Liturgy
- Daily prayers and devotions
- Anglican liturgical calendar
- Morning and evening prayers
- Special occasion prayers

#### 🎙️ Sermon Library
- Audio and video sermons
- Search by topic, speaker, or date
- Downloadable content
- Categorized by series

#### ✝️ Pastor's Corner
- Weekly messages from clergy
- Devotional content
- Spiritual guidance

#### 📋 Notices & Announcements
- Parish news and updates
- Important announcements
- Event reminders

#### 📅 Events Calendar
- Upcoming parish events
- RSVP system
- Event details and locations
- Add to personal calendar

#### 💛 Digital Giving (M-Pesa)
- Secure online tithing
- Offering contributions
- Special projects donations
- Transaction history
- Flutterwave payment integration

#### 👥 Community Feed
- Share testimonies and prayer requests
- Like and comment on posts
- Member interactions
- Photo sharing

#### 🕊️ Pastoral Care
- Confidential support requests
- Prayer requests
- Counseling appointments
- Direct communication with clergy

#### 🔔 Notifications
- In-app notification center
- Push notifications (with permission)
- Mark as read/delete
- Notification history

#### 👤 Profile Management
- Personal information
- Avatar upload
- Notification preferences
- Account settings

### For Leaders & Clergy

#### 📇 Member Directory
- View member information
- Contact details
- Role-based access

#### 📊 Pastoral Care Dashboard
- View and manage care requests
- Track follow-ups
- Assign to clergy members
- Mark as resolved

### For Administrators

#### 📊 Admin Dashboard
- Analytics and statistics
- User activity metrics
- Giving reports
- Event attendance

#### ➕ Content Management
- Add/edit sermons
- Manage notices
- Create events
- Upload media

#### 👥 User Management
- View all users
- Assign roles (basic_member, leader, clergy, admin)
- Manage permissions
- User activity logs

#### 📸 Media Library
- Upload images and videos
- Cloudinary integration
- Organize media files
- Bulk uploads

#### 🔔 Notification Sender
- Send push notifications
- Target all users or by role
- Preview before sending
- Notification history

#### ⏰ Scheduled Content
- Schedule posts in advance
- Auto-publish at set times
- Manage scheduled items

#### 📝 Page Editor
- Custom page creation
- Rich text editor
- Dynamic content

#### 📋 Form Builder
- Create custom forms
- Collect responses
- Export data

#### ⚙️ Settings
- Parish information
- App configuration
- Integration settings

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon library

### Backend & Services
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions, storage
- **Flutterwave** - M-Pesa payment processing
- **Cloudinary** - Media storage and optimization
- **api.bible** - Bible content API
- **Firebase Cloud Messaging** - Push notifications

### PWA Features
- **Service Worker** - Offline functionality
- **Web App Manifest** - Installable app
- **Workbox** - Advanced caching strategies

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and npm/yarn
- **Supabase account** - [Sign up](https://supabase.com)
- **Cloudinary account** - [Sign up](https://cloudinary.com)
- **Flutterwave account** - [Sign up](https://flutterwave.com)
- **api.bible API key** - [Get key](https://scripture.api.bible)
- **Firebase project** - [Create project](https://console.firebase.google.com)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kevrith/ack-nkubu.git
cd ack-nkubu
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# api.bible
VITE_API_BIBLE_KEY=your_api_bible_key

# Flutterwave
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

4. **Set up Firebase Service Worker**
```bash
cp public/firebase-messaging-sw.js.example public/firebase-messaging-sw.js
```
Edit `public/firebase-messaging-sw.js` with your Firebase config.

5. **Set up Supabase database**

Run migrations in order in Supabase SQL Editor:
```bash
# supabase/migrations/001_initial_schema.sql
# supabase/migrations/002_rls_policies.sql
# ... and so on
```

6. **Start development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
ack-nkubu/
├── public/
│   ├── icon-192.png              # PWA icon (192x192)
│   ├── icon-512.png              # PWA icon (512x512)
│   ├── MERU.png                  # Parish logo
│   ├── manifest.json             # PWA manifest
│   └── firebase-messaging-sw.js  # Service worker (gitignored)
├── src/
│   ├── components/
│   │   ├── auth/                 # Login, Register, ProtectedRoute
│   │   ├── bible/                # Bible reader components
│   │   ├── layout/               # Header, Sidebar, MobileNav
│   │   └── shared/               # Reusable components
│   ├── hooks/
│   │   └── useAuth.ts            # Authentication hook
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── firebase.ts           # Firebase config
│   │   └── utils.ts              # Utility functions
│   ├── pages/
│   │   ├── admin/                # Admin pages
│   │   ├── app/                  # User pages
│   │   ├── auth/                 # Auth pages
│   │   └── public/               # Public pages
│   ├── router/
│   │   └── index.tsx             # Route configuration
│   ├── services/
│   │   ├── bible.service.ts      # Bible API
│   │   └── payment.service.ts    # Payment API
│   ├── store/
│   │   ├── authStore.ts          # Auth state
│   │   └── bibleStore.ts         # Bible state
│   ├── styles/
│   │   └── globals.css           # Global styles
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── supabase/
│   ├── functions/                # Edge functions
│   └── migrations/               # Database migrations
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── DEPLOYMENT.md                 # Deployment guide
├── FIREBASE_SECURITY.md          # Security notes
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite config
```

---

## 👥 User Roles & Permissions

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **basic_member** | Standard | View content, community posts, give, request pastoral care |
| **leader** | Enhanced | + Member directory, manage small groups |
| **clergy** | Advanced | + Pastoral care dashboard, content creation, notifications |
| **admin** | Full | + User management, all admin features, system settings |

---

## 🗄️ Database Schema

The database uses PostgreSQL via Supabase with Row Level Security (RLS) policies.

### Main Tables
- `profiles` - User profiles and roles
- `sermons` - Sermon library
- `events` - Parish events
- `notices` - Announcements
- `community_posts` - Social feed
- `pastoral_care_requests` - Support requests
- `giving_transactions` - Donation records
- `notifications` - User notifications
- `bible_bookmarks` - Saved verses
- `prayer_requests` - Prayer needs

### Migrations
Run migrations in order from `supabase/migrations/`:
1. `001_initial_schema.sql` - Core tables and enums
2. `002_rls_policies.sql` - Security policies
3. `003_bible_bookmarks.sql` - Bible features
4. `004_prayer_interactions.sql` - Prayer system
5. `005_pastors_corner.sql` - Pastor content
6. `006_community_comments.sql` - Comments
7. `007_cms_tables.sql` - CMS features
8. `008_community_reactions.sql` - Reactions
9. `009_fix_content_policies.sql` - Policy fixes
10. `010_notifications_table.sql` - Notifications

---

## 🔧 Development

### Available Scripts

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Tips

1. **Hot Module Replacement**: Changes reflect instantly without page reload
2. **TypeScript**: Use strict typing for better code quality
3. **Tailwind**: Use utility classes, check `tailwind.config.js` for custom colors
4. **State Management**: Use Zustand stores for global state
5. **API Calls**: Use service files in `src/services/`

### Code Style

- Use functional components with hooks
- Follow TypeScript best practices
- Use Tailwind utility classes
- Keep components small and focused
- Write descriptive commit messages

---

## 🚀 Deployment

### Recommended: Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy

### Alternative: Netlify

1. Push code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables

### Alternative: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Post-Deployment Checklist

- [ ] Update Supabase auth URLs
- [ ] Add domain to Firebase authorized domains
- [ ] Update Flutterwave redirect URLs
- [ ] Test PWA install
- [ ] Test push notifications
- [ ] Verify M-Pesa payments
- [ ] Check all admin features

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📱 Progressive Web App

### Features

- ✅ Installable on any device
- ✅ Works offline
- ✅ Fast loading with caching
- ✅ Push notifications
- ✅ App-like experience

### Install Instructions

**Mobile (Chrome/Safari)**
1. Open the app in browser
2. Tap "Install" prompt or
3. Menu → "Add to Home Screen"

**Desktop (Chrome/Edge)**
1. Open the app in browser
2. Click install icon in address bar or
3. Menu → "Install ACK St Francis Nkubu"

---

## 🔒 Security

### Authentication
- Supabase Auth with email/password
- Row Level Security (RLS) policies
- Role-based access control
- Secure session management

### Data Protection
- All API calls over HTTPS
- Environment variables for secrets
- Client-side validation
- Server-side authorization

### Payment Security
- Flutterwave PCI-compliant processing
- No card data stored locally
- Transaction verification
- Webhook validation

### Firebase API Keys
Firebase client API keys are safe to expose. See [FIREBASE_SECURITY.md](FIREBASE_SECURITY.md) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Proprietary - ACK St Francis Nkubu Parish

---

## 📞 Support

For technical support or questions:
- **Email**: support@acknkubu.org
- **Phone**: +254 XXX XXX XXX
- **GitHub Issues**: [Report a bug](https://github.com/kevrith/ack-nkubu/issues)

---

## 🙏 Acknowledgments

- Anglican Church of Kenya
- ACK St Francis Nkubu Parish Community
- All contributors and testers

---

<div align="center">
  <p>Built with ❤️ for ACK St Francis Nkubu Parish</p>
  <p>© 2024 ACK St Francis Nkubu. All rights reserved.</p>
</div>
