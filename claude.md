# CLAUDE.md — ACK Parish Church Web Application
> Claude Code configuration file. Read this before writing any code.

---

## 🏛️ Project Identity

**Project Name:** ACK Parish Church Web Application  
**Type:** Progressive Web App (PWA) — Mobile-first, Desktop-ready  
**Church Denomination:** Anglican Church of Kenya (ACK)  
**Target Users:** Congregation members, parish leadership, clergy, administrators  
**Geographic Context:** Kenya — KES currency, M-Pesa payments, Kenyan phone numbers  
**Design Language:** Reverent, modern, accessible — Navy & Gold brand palette

---

## 🛠️ Full Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| shadcn/ui | latest | Component library |
| React Router DOM | 6.x | Client-side routing |
| React Query (TanStack) | 5.x | Server state management |
| Zustand | 4.x | Client state management |
| React Hook Form | 7.x | Form handling |
| Zod | 3.x | Schema validation |
| Framer Motion | 10.x | Animations |
| Lucide React | latest | Icons |
| Recharts | 2.x | Analytics charts |
| date-fns | 3.x | Date utilities |

### Backend / BaaS
| Technology | Purpose |
|---|---|
| Supabase | PostgreSQL DB, Auth, Realtime, Storage, Edge Functions |
| Firebase | Push notifications (FCM), optional hosting |
| Cloudinary | Media storage (sermon videos, images, PDFs) |

### Integrations
| Service | Purpose | Docs |
|---|---|---|
| Flutterwave | M-Pesa STK Push, payment processing | `https://developer.flutterwave.com` |
| api.bible | Bible content — NIV, NLT, KJV, NRSV, NKJV | `https://scripture.api.bible` |
| Firebase Cloud Messaging | Push notifications | `https://firebase.google.com/docs/cloud-messaging` |

### PWA
| Tool | Purpose |
|---|---|
| Vite PWA Plugin | Service worker, manifest |
| Workbox | Caching strategies |

---

## 🎨 Design System & Color Palette

```typescript
// tailwind.config.ts — extend colors
const colors = {
  navy: {
    DEFAULT: '#1a3a5c',
    50:  '#e8eef5',
    100: '#c5d4e6',
    200: '#9eb7d4',
    300: '#7799c2',
    400: '#5a83b5',
    500: '#3d6da8',
    600: '#2f5a8f',
    700: '#1a3a5c',  // PRIMARY
    800: '#122940',
    900: '#0a1827',
  },
  gold: {
    DEFAULT: '#c9a84c',
    50:  '#fdf8ec',
    100: '#f7ecc8',
    200: '#f0dea0',
    300: '#e8cf78',
    400: '#dfc158',
    500: '#c9a84c',  // PRIMARY
    600: '#a8873a',
    700: '#82682b',
    800: '#5c491e',
    900: '#362b11',
  },
  cream: '#faf8f4',
  charcoal: '#2d2d2d',
}
```

### Typography
- **Headings:** Playfair Display (serif) — liturgical gravitas
- **Body:** Inter (sans-serif) — modern readability
- **Scripture:** Georgia or Lora — readability for Bible text

### Component Conventions
```tsx
// Buttons
<Button className="bg-navy text-white hover:bg-navy-600">Primary</Button>
<Button className="bg-gold text-navy hover:bg-gold-600">Accent</Button>
<Button variant="outline" className="border-navy text-navy">Secondary</Button>

// Cards
<Card className="border-l-4 border-l-gold shadow-md">

// Section Headers
<h2 className="text-2xl font-playfair text-navy border-b-2 border-gold pb-2">
```

---

## 👥 User Roles & Permissions

```typescript
type UserRole = 'basic_member' | 'leader' | 'clergy' | 'admin';

const ROLE_PERMISSIONS = {
  basic_member: [
    'read:bible',
    'read:prayers',
    'read:sermons',
    'read:notices',
    'read:events',
    'create:prayer_request',
    'create:giving',
    'read:community',
    'create:community_post',
    'read:pastoral_care',
  ],
  leader: [
    ...ROLE_PERMISSIONS.basic_member,
    'write:notices',
    'write:events',
    'read:giving_reports',
    'moderate:community',
    'read:member_list',
  ],
  clergy: [
    ...ROLE_PERMISSIONS.leader,
    'write:sermons',
    'write:prayers',
    'write:pastors_corner',
    'read:prayer_requests',
    'respond:prayer_requests',
    'read:pastoral_care_private',
    'write:liturgy',
  ],
  admin: [
    ...ROLE_PERMISSIONS.clergy,
    'manage:users',
    'manage:roles',
    'manage:settings',
    'write:cms_all',
    'read:analytics',
    'manage:giving',
    'manage:integrations',
  ],
} as const;
```

### Role Guard Component
```tsx
// src/components/auth/RoleGuard.tsx
interface RoleGuardProps {
  requiredRole: UserRole | UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  requiredRole, fallback = null, children 
}) => {
  const { user } = useAuth();
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  if (!user || !roles.some(r => hasPermission(user.role, r))) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
```

---

## 📁 Complete File Structure

```
ack-parish-app/
├── public/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── apple-touch-icon.png
│   └── offline.html
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   │
│   ├── types/
│   │   ├── index.ts              # Re-exports all types
│   │   ├── auth.ts               # User, Session, UserRole
│   │   ├── bible.ts              # BibleVersion, Book, Chapter, Verse
│   │   ├── sermon.ts             # Sermon, SermonSeries, Speaker
│   │   ├── prayer.ts             # Prayer, PrayerRequest
│   │   ├── event.ts              # Event, EventCategory
│   │   ├── notice.ts             # Notice, NoticeCategory
│   │   ├── giving.ts             # Giving, GivingCategory, MpesaTransaction
│   │   ├── community.ts          # Post, Comment, Group
│   │   ├── pastoral.ts           # PastoralCare, Appointment
│   │   └── cms.ts                # CMSPage, CMSBlock, CMSSettings
│   │
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client init
│   │   ├── firebase.ts           # Firebase app + FCM init
│   │   ├── cloudinary.ts         # Cloudinary upload helpers
│   │   ├── flutterwave.ts        # Payment init + STK push
│   │   ├── apibible.ts           # api.bible client
│   │   ├── queryClient.ts        # React Query config
│   │   └── utils.ts              # cn(), formatKES(), formatDate()
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBible.ts
│   │   ├── useSermons.ts
│   │   ├── usePrayers.ts
│   │   ├── useEvents.ts
│   │   ├── useNotices.ts
│   │   ├── useGiving.ts
│   │   ├── useCommunity.ts
│   │   ├── usePastoralCare.ts
│   │   ├── useCMS.ts
│   │   ├── useAnalytics.ts
│   │   ├── usePushNotifications.ts
│   │   ├── useOffline.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── store/
│   │   ├── authStore.ts          # Zustand auth state
│   │   ├── bibleStore.ts         # Reading position, bookmarks
│   │   ├── notificationStore.ts  # Push notification state
│   │   └── offlineStore.ts       # Offline queue
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── bible.service.ts
│   │   ├── sermon.service.ts
│   │   ├── prayer.service.ts
│   │   ├── event.service.ts
│   │   ├── notice.service.ts
│   │   ├── giving.service.ts
│   │   ├── community.service.ts
│   │   ├── pastoral.service.ts
│   │   ├── cms.service.ts
│   │   ├── analytics.service.ts
│   │   ├── media.service.ts      # Cloudinary ops
│   │   └── notification.service.ts
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (auto-generated)
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RoleGuard.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── DesktopSidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── bible/
│   │   │   ├── BibleReader.tsx
│   │   │   ├── VersionSelector.tsx
│   │   │   ├── BookNavigator.tsx
│   │   │   ├── ChapterView.tsx
│   │   │   ├── VerseHighlighter.tsx
│   │   │   ├── BibleSearch.tsx
│   │   │   ├── DailyVerse.tsx
│   │   │   └── ReadingPlan.tsx
│   │   ├── sermons/
│   │   │   ├── SermonCard.tsx
│   │   │   ├── SermonPlayer.tsx
│   │   │   ├── SermonGrid.tsx
│   │   │   ├── SermonFilters.tsx
│   │   │   ├── SermonUploader.tsx
│   │   │   └── SeriesCard.tsx
│   │   ├── prayers/
│   │   │   ├── PrayerList.tsx
│   │   │   ├── PrayerCard.tsx
│   │   │   ├── PrayerRequestForm.tsx
│   │   │   ├── LiturgicalCalendar.tsx
│   │   │   └── DailyPrayer.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventCalendar.tsx
│   │   │   ├── EventList.tsx
│   │   │   ├── EventForm.tsx
│   │   │   └── RSVPButton.tsx
│   │   ├── giving/
│   │   │   ├── GivingForm.tsx
│   │   │   ├── MpesaPrompt.tsx
│   │   │   ├── GivingHistory.tsx
│   │   │   ├── GivingCategories.tsx
│   │   │   └── GivingReceipt.tsx
│   │   ├── community/
│   │   │   ├── PostFeed.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostForm.tsx
│   │   │   ├── CommentThread.tsx
│   │   │   └── GroupCard.tsx
│   │   ├── pastoral/
│   │   │   ├── PastoralCareForm.tsx
│   │   │   ├── AppointmentBooking.tsx
│   │   │   └── CareRequestStatus.tsx
│   │   ├── cms/
│   │   │   ├── CMSProvider.tsx
│   │   │   ├── PageEditor.tsx
│   │   │   ├── BlockEditor.tsx
│   │   │   ├── DragDropCanvas.tsx
│   │   │   ├── FormBuilder.tsx
│   │   │   └── MediaLibrary.tsx
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── MemberGrowthChart.tsx
│   │   │   ├── GivingTrendsChart.tsx
│   │   │   ├── SermonEngagementChart.tsx
│   │   │   ├── EventAttendanceChart.tsx
│   │   │   └── PrayerRequestsChart.tsx
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── OfflineBanner.tsx
│   │       ├── MediaUploader.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── EmptyState.tsx
│   │       └── Breadcrumb.tsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LandingPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── app/
│   │   │   ├── HomePage.tsx
│   │   │   ├── BiblePage.tsx
│   │   │   ├── PrayersPage.tsx
│   │   │   ├── SermonsPage.tsx
│   │   │   ├── PastorsCornerPage.tsx
│   │   │   ├── NoticesPage.tsx
│   │   │   ├── EventsPage.tsx
│   │   │   ├── GivingPage.tsx
│   │   │   ├── CommunityPage.tsx
│   │   │   ├── PastoralCarePage.tsx
│   │   │   └── ProfilePage.tsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── CMSPage.tsx
│   │       ├── UsersPage.tsx
│   │       ├── AnalyticsPage.tsx
│   │       ├── GivingManagementPage.tsx
│   │       ├── NotificationsPage.tsx
│   │       └── SettingsPage.tsx
│   │
│   ├── router/
│   │   ├── index.tsx             # Route definitions
│   │   └── guards.tsx            # Auth + role route guards
│   │
│   └── styles/
│       ├── globals.css
│       └── fonts.css
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_functions.sql
│   │   └── 004_seed_data.sql
│   └── functions/
│       ├── mpesa-webhook/
│       │   └── index.ts
│       ├── send-notification/
│       │   └── index.ts
│       └── analytics-aggregate/
│           └── index.ts
│
├── .env.local                    # Never commit
├── .env.example
├── .gitignore
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🗄️ Database Schema (Supabase / PostgreSQL)

```sql
-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('basic_member', 'leader', 'clergy', 'admin');
CREATE TYPE giving_category AS ENUM ('tithe', 'offering', 'harambee', 'building_fund', 'missions', 'welfare', 'other');
CREATE TYPE mpesa_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE sermon_type AS ENUM ('audio', 'video', 'text');
CREATE TYPE prayer_category AS ENUM ('morning', 'evening', 'intercessory', 'liturgical', 'special');
CREATE TYPE notice_category AS ENUM ('general', 'urgent', 'youth', 'women', 'men', 'choir', 'ushers');
CREATE TYPE event_category AS ENUM ('service', 'fellowship', 'conference', 'retreat', 'youth', 'outreach', 'committee');
CREATE TYPE pastoral_care_type AS ENUM ('prayer', 'counselling', 'hospital_visit', 'home_visit', 'bereavement', 'marriage', 'other');
CREATE TYPE pastoral_care_status AS ENUM ('pending', 'acknowledged', 'in_progress', 'completed');
CREATE TYPE bible_version AS ENUM ('NIV', 'NLT', 'KJV', 'NRSV', 'NKJV');
CREATE TYPE cms_block_type AS ENUM ('hero', 'text', 'image', 'video', 'scripture', 'cta', 'grid', 'carousel');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,                              -- +254XXXXXXXXX format
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'basic_member',
  cell_group TEXT,
  membership_number TEXT UNIQUE,
  date_joined DATE,
  is_active BOOLEAN DEFAULT true,
  notification_token TEXT,                 -- FCM token
  preferred_bible_version bible_version DEFAULT 'NIV',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERMONS
-- ============================================
CREATE TABLE sermon_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sermons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  scripture_reference TEXT,               -- e.g. "John 3:16-17"
  sermon_date DATE NOT NULL,
  preacher_id UUID REFERENCES profiles(id),
  series_id UUID REFERENCES sermon_series(id),
  type sermon_type NOT NULL DEFAULT 'audio',
  media_url TEXT,                          -- Cloudinary URL
  media_duration INTEGER,                  -- seconds
  thumbnail_url TEXT,
  pdf_url TEXT,                            -- sermon notes PDF
  cloudinary_public_id TEXT,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRAYERS & LITURGY
-- ============================================
CREATE TABLE prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category prayer_category NOT NULL,
  liturgical_season TEXT,                  -- Advent, Lent, Ordinary Time, etc.
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  request TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  prayer_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  clergy_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prayer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prayed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, user_id)
);

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category event_category NOT NULL,
  location TEXT,
  maps_url TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  cover_image_url TEXT,
  max_attendees INTEGER,
  rsvp_enabled BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending',         -- attending | maybe | not_attending
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- NOTICES
-- ============================================
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category notice_category NOT NULL DEFAULT 'general',
  is_urgent BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  publish_date DATE,
  expiry_date DATE,
  attachment_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GIVING & M-PESA
-- ============================================
CREATE TABLE giving_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES profiles(id),
  amount_kes DECIMAL(12, 2) NOT NULL,      -- Always KES
  category giving_category NOT NULL,
  description TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  mpesa_transaction_id UUID,
  receipt_number TEXT UNIQUE,
  giving_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giving_record_id UUID REFERENCES giving_records(id),
  phone_number TEXT NOT NULL,              -- +254XXXXXXXXX
  amount_kes DECIMAL(12, 2) NOT NULL,
  merchant_request_id TEXT UNIQUE,
  checkout_request_id TEXT UNIQUE,
  mpesa_receipt_number TEXT,
  status mpesa_status NOT NULL DEFAULT 'pending',
  result_code INTEGER,
  result_description TEXT,
  transaction_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMUNITY
-- ============================================
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  group_id UUID,                           -- FK to community_groups
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  leader_id UUID REFERENCES profiles(id),
  is_private BOOLEAN DEFAULT false,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PASTORAL CARE
-- ============================================
CREATE TABLE pastoral_care_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type pastoral_care_type NOT NULL,
  details TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT true,
  preferred_date DATE,
  preferred_time TIME,
  contact_phone TEXT,
  status pastoral_care_status DEFAULT 'pending',
  assigned_clergy_id UUID REFERENCES profiles(id),
  clergy_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PASTOR'S CORNER
-- ============================================
CREATE TABLE pastors_corner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,                   -- Rich text / Markdown
  excerpt TEXT,
  cover_image_url TEXT,
  category TEXT DEFAULT 'message',         -- message | devotional | reflection
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CMS
-- ============================================
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  last_edited_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cms_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES cms_pages(id) ON DELETE CASCADE,
  type cms_block_type NOT NULL,
  order_index INTEGER NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cms_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BIBLE BOOKMARKS & READING PLANS
-- ============================================
CREATE TABLE bible_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  version bible_version NOT NULL,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reading_plan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  current_day INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(user_id, plan_name)
);

-- ============================================
-- ANALYTICS EVENTS
-- ============================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE giving_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastoral_care_requests ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: users see their own, admins see all
CREATE POLICY "profiles_own_read" ON profiles
  FOR SELECT USING (id = auth.uid() OR get_user_role() IN ('admin', 'clergy'));

CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Published sermons visible to all authenticated users
CREATE POLICY "sermons_read_published" ON sermons
  FOR SELECT USING (is_published = true OR get_user_role() IN ('clergy', 'admin'));

-- Giving: users see own records, leaders/admins see all
CREATE POLICY "giving_own_read" ON giving_records
  FOR SELECT USING (
    (is_anonymous = false AND donor_id = auth.uid())
    OR get_user_role() IN ('leader', 'clergy', 'admin')
  );

-- Pastoral care: requester + assigned clergy + admin only
CREATE POLICY "pastoral_care_read" ON pastoral_care_requests
  FOR SELECT USING (
    requester_id = auth.uid()
    OR assigned_clergy_id = auth.uid()
    OR get_user_role() = 'admin'
  );
```

---

## 🧩 Key Service Implementations

### Kenyan Phone Validation
```typescript
// src/lib/utils.ts

/**
 * Validates and normalizes Kenyan phone numbers.
 * Accepts: 07XXXXXXXX | 01XXXXXXXX | +2547XXXXXXXX | 2547XXXXXXXX
 * Returns: +254XXXXXXXXX format or null if invalid
 */
export function normalizeKenyanPhone(phone: string): string | null {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
  
  // Already in +254 format
  if (/^\+254[17]\d{8}$/.test(cleaned)) return cleaned;
  
  // 254 format without +
  if (/^254[17]\d{8}$/.test(cleaned)) return `+${cleaned}`;
  
  // 07 or 01 format (Safaricom/Airtel)
  if (/^0[17]\d{8}$/.test(cleaned)) return `+254${cleaned.slice(1)}`;
  
  return null;
}

export function isValidKenyanPhone(phone: string): boolean {
  return normalizeKenyanPhone(phone) !== null;
}

/** Format amount as KES */
export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
```

### M-Pesa STK Push (Flutterwave)
```typescript
// src/services/giving.service.ts
import { supabase } from '@/lib/supabase';
import { normalizeKenyanPhone, formatKES } from '@/lib/utils';

export async function initiateGiving(params: {
  phone: string;
  amountKes: number;
  category: GivingCategory;
  donorId: string;
  isAnonymous?: boolean;
}): Promise<{ success: boolean; message: string; transactionId?: string }> {
  const normalizedPhone = normalizeKenyanPhone(params.phone);
  if (!normalizedPhone) {
    return { success: false, message: 'Invalid Kenyan phone number' };
  }
  
  if (params.amountKes < 10) {
    return { success: false, message: `Minimum giving amount is ${formatKES(10)}` };
  }
  
  // Create pending giving record
  const { data: giving, error: givingError } = await supabase
    .from('giving_records')
    .insert({
      donor_id: params.donorId,
      amount_kes: params.amountKes,
      category: params.category,
      is_anonymous: params.isAnonymous ?? false,
    })
    .select()
    .single();
    
  if (givingError) throw givingError;
  
  // Create M-Pesa transaction record
  const { data: mpesa } = await supabase
    .from('mpesa_transactions')
    .insert({
      giving_record_id: giving.id,
      phone_number: normalizedPhone,
      amount_kes: params.amountKes,
      status: 'pending',
    })
    .select()
    .single();
  
  // Trigger STK push via Supabase Edge Function
  const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
    body: {
      transactionId: mpesa.id,
      phone: normalizedPhone,
      amount: params.amountKes,
    },
  });
  
  if (error) {
    return { success: false, message: 'Failed to initiate M-Pesa payment. Please try again.' };
  }
  
  return {
    success: true,
    message: `M-Pesa prompt sent to ${normalizedPhone}. Enter your PIN to complete.`,
    transactionId: mpesa.id,
  };
}
```

### api.bible Integration
```typescript
// src/services/bible.service.ts
const API_BIBLE_KEY = import.meta.env.VITE_API_BIBLE_KEY;
const BASE_URL = 'https://api.scripture.api.bible/v1';

const VERSION_IDS: Record<BibleVersion, string> = {
  NIV:  'de4e12af7f28f599-01',
  NLT:  '65eec8e0b60e656b-01',
  KJV:  'de4e12af7f28f599-02',
  NRSV: 'bba9f40183526463-01',
  NKJV: '9879dbb7cfe39e4d-04',
};

async function bibleRequest<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'api-key': API_BIBLE_KEY },
  });
  if (!res.ok) throw new Error(`api.bible error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export const bibleService = {
  getBooks: (version: BibleVersion) => 
    bibleRequest<Book[]>(`/bibles/${VERSION_IDS[version]}/books`),
  
  getChapter: (version: BibleVersion, chapterId: string) =>
    bibleRequest<Chapter>(`/bibles/${VERSION_IDS[version]}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false`),
  
  search: (version: BibleVersion, query: string) =>
    bibleRequest<SearchResult>(`/bibles/${VERSION_IDS[version]}/search?query=${encodeURIComponent(query)}&limit=20`),
  
  getDailyVerse: async (version: BibleVersion): Promise<Verse> => {
    // Deterministic daily verse using day-of-year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const DAILY_VERSES = ['JHN.3.16', 'PSA.23.1', 'ROM.8.28', /* ... more */];
    const verseId = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
    return bibleRequest(`/bibles/${VERSION_IDS[version]}/verses/${verseId}?content-type=text`);
  },
};
```

---

## ✅ 11 Development Phases Checklist

### Phase 1: Foundation & Auth ⬜
- [ ] Vite + React + TypeScript project scaffold
- [ ] Tailwind CSS + shadcn/ui setup
- [ ] Supabase project + connection
- [ ] Authentication (email/password + phone OTP)
- [ ] Profiles table + RLS
- [ ] Role-based routing
- [ ] App shell (Header, MobileNav, DesktopSidebar)
- [ ] PWA manifest + service worker

### Phase 2: Bible Module ⬜
- [ ] api.bible integration (all 5 versions)
- [ ] Book + chapter navigator
- [ ] Verse highlighting + bookmarks
- [ ] Bible search
- [ ] Daily verse widget
- [ ] Reading plans

### Phase 3: Prayers & Liturgy ⬜
- [ ] Prayer list with categories
- [ ] Anglican liturgical calendar
- [ ] Prayer request submission
- [ ] Clergy prayer request management
- [ ] Daily morning/evening prayer

### Phase 4: Sermons ⬜
- [ ] Cloudinary video/audio upload
- [ ] Sermon listing + filters
- [ ] Media player (audio/video)
- [ ] Sermon series grouping
- [ ] PDF sermon notes
- [ ] Search by preacher/topic/scripture

### Phase 5: Pastor's Corner ⬜
- [ ] Rich text editor for clergy
- [ ] Articles / devotionals / reflections
- [ ] Category filtering
- [ ] Featured post widget

### Phase 6: Notices & Events ⬜
- [ ] Notice board with urgency levels
- [ ] Event calendar view
- [ ] RSVP system
- [ ] Event categories + filtering
- [ ] Google Maps integration for venue

### Phase 7: M-Pesa Giving ⬜
- [ ] Flutterwave SDK integration
- [ ] STK Push flow
- [ ] Giving categories (Tithe, Harambee, etc.)
- [ ] Transaction status polling
- [ ] Giving history + receipts
- [ ] Admin giving reports

### Phase 8: Community ⬜
- [ ] Post feed
- [ ] Like + comment system
- [ ] Community groups
- [ ] Moderation tools (leader role)
- [ ] Image posting (Cloudinary)

### Phase 9: Pastoral Care ⬜
- [ ] Care request form (confidential)
- [ ] Clergy dashboard for requests
- [ ] Status updates
- [ ] Appointment scheduling

### Phase 10: Admin CMS & Analytics ⬜
- [ ] No-code page editor (drag-and-drop blocks)
- [ ] Form builder
- [ ] Media library
- [ ] Analytics dashboard (5 charts)
- [ ] Member management
- [ ] Push notification sender
- [ ] Settings panel

### Phase 11: Polish & Deployment ⬜
- [ ] Offline support (Workbox caching)
- [ ] Push notifications (FCM)
- [ ] Performance audit (Lighthouse ≥90)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Firebase hosting deploy
- [ ] Custom domain + SSL
- [ ] Production Supabase RLS audit
- [ ] Error monitoring (Sentry)

---

## 🇰🇪 Kenyan Context Rules

1. **Currency:** All monetary values stored and displayed in **KES (Kenyan Shillings)**. Never USD unless explicitly for a currency converter.

2. **Phone Numbers:**
   - Always validate with `isValidKenyanPhone()` before saving
   - Store in `+254XXXXXXXXX` format
   - Safaricom: 0700–0709, 0110–0119, 0729, 0768–0769
   - Airtel: 0730–0739, 0750–0756, 0780
   - Telkom: 0770–0779

3. **M-Pesa:**
   - Minimum transaction: KES 10
   - Maximum: KES 150,000 (Flutterwave limit)
   - Always show clear STK push instructions in Swahili + English
   - Handle timeout after 60 seconds gracefully

4. **Dates & Times:**
   - Default timezone: `Africa/Nairobi` (EAT, UTC+3)
   - Date format: `DD/MM/YYYY` for display
   - Time format: 12-hour with AM/PM for church schedules

5. **Language:** Primary English. Key phrases in Swahili where appropriate:
   - "Kutoa / Toa" for giving
   - "Sala" for prayer
   - "Mkesha" for night prayer service

6. **Kenyan Holidays & Church Calendar:** Include public holidays relevant to scheduling (Good Friday, Easter Monday, Christmas, etc.)

---

## 📋 Coding Standards

### TypeScript
```typescript
// ✅ DO: Explicit types for all function signatures
async function createSermon(data: CreateSermonInput): Promise<Sermon> {}

// ✅ DO: Zod validation for all forms
const givingSchema = z.object({
  phone: z.string().refine(isValidKenyanPhone, 'Invalid Kenyan phone number'),
  amount: z.number().min(10, 'Minimum KES 10').max(150000, 'Maximum KES 150,000'),
  category: z.enum(['tithe', 'offering', 'harambee', 'building_fund', 'missions', 'welfare', 'other']),
});

// ❌ DON'T: any type
function processData(data: any) {}  // FORBIDDEN

// ❌ DON'T: Non-null assertions without checks
const user = auth.currentUser!;  // AVOID
```

### React Components
```tsx
// ✅ DO: Functional components with explicit prop types
interface SermonCardProps {
  sermon: Sermon;
  onPlay?: (id: string) => void;
  className?: string;
}

export const SermonCard: React.FC<SermonCardProps> = ({ sermon, onPlay, className }) => {
  // ...
};

// ✅ DO: Error boundaries around data-fetching components
// ✅ DO: Loading + error states for ALL async operations
// ✅ DO: Memoize expensive calculations
const sortedSermons = useMemo(() => [...sermons].sort(...), [sermons]);
```

### Supabase Queries
```typescript
// ✅ DO: Always handle errors explicitly
const { data, error } = await supabase.from('sermons').select('*');
if (error) throw error;

// ✅ DO: Use select() to limit columns
const { data } = await supabase
  .from('sermons')
  .select('id, title, preacher_id, sermon_date, type')
  .eq('is_published', true)
  .order('sermon_date', { ascending: false })
  .limit(20);

// ❌ DON'T: Select * when specific columns suffice
```

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Services: `camelCase.service.ts`
- Types: `camelCase.ts`
- Utils: `camelCase.ts`

---

## 🚨 15 Critical Rules for Claude Code

1. **NEVER commit `.env.local`** — Always use `.env.example` with placeholder values for documentation.

2. **ALL monetary values in KES** — Never hardcode USD amounts. Use `formatKES()` for display, store raw numbers in DB.

3. **Validate Kenyan phone numbers** — Every phone input must pass through `isValidKenyanPhone()` before hitting Supabase or Flutterwave.

4. **RLS is mandatory** — Never disable Row Level Security on any table. Always test queries as non-admin users.

5. **Respect user roles** — Every admin/clergy UI must be wrapped in `<RoleGuard>`. Never trust role checks only on the frontend; always enforce in RLS policies.

6. **Pastoral care is confidential** — All pastoral care requests default to `is_confidential = true`. Never expose these in community feeds or analytics with PII.

7. **TypeScript strict mode** — `tsconfig.json` must have `"strict": true`. No `any` types without a justifying comment.

8. **Cloudinary for all media** — Never store media blobs in Supabase Storage directly. Always upload to Cloudinary and store the URL.

9. **M-Pesa idempotency** — Each M-Pesa transaction must have a unique `merchant_request_id`. Never retry without checking if a transaction is already `pending`.

10. **Offline-first for Bible** — Bible chapters must be cached in IndexedDB (Workbox) so users can read offline. Show `<OfflineBanner>` when network is unavailable.

11. **Anglican-specific content** — Prayer categories must include Anglican liturgical seasons (Advent, Christmas, Epiphany, Lent, Easter, Ordinary Time). Never use generic "Christian" labels.

12. **Push notifications are opt-in** — Never request notification permissions on app load. Show a contextual prompt after the user has been active for 30 seconds or completed an action.

13. **Analytics are aggregated** — Analytics charts must show aggregate data only. Never render a chart that could deanonymize a specific donor or prayer requester.

14. **Image optimization** — Always use Cloudinary transformation URLs (`f_auto,q_auto,w_400`) for thumbnails. Never serve raw uploaded images without optimization.

15. **i18n-ready strings** — All user-facing strings must be in English by default but structured to support Swahili translations in the future. No hardcoded sentence fragments — keep whole sentences together.

---

## 🔧 Environment Variables

```bash
# .env.example — Copy to .env.local and fill in values

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Only for Edge Functions

# api.bible
VITE_API_BIBLE_KEY=your-api-bible-key

# Flutterwave
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxx-X
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxx-X  # Only server-side

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=ack-parish-unsigned
CLOUDINARY_API_KEY=your-api-key          # Only server-side
CLOUDINARY_API_SECRET=your-api-secret    # Only server-side

# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key
```

---

*Last updated: February 2026 | ACK Parish Web Application*