# ACK Parish Church Web Application — Master Plan
## Complete Blueprint, Feature Specifications & Build Roadmap

> **Project:** Anglican Church of Kenya (ACK) Parish Progressive Web App  
> **Stack:** React TypeScript · Tailwind CSS · Supabase · Cloudinary · Flutterwave (M-Pesa) · Firebase · api.bible  
> **Brand:** Navy `#1a3a5c` | Gold `#c9a84c` | Cream `#faf8f4`  
> **Timeline:** 18 Weeks  

---

## 🏛️ Vision Statement

To build a **dignified, accessible, and feature-rich digital home** for the ACK Parish community — connecting members to Scripture, prayer, worship, and each other. The app should feel like walking into the parish: welcoming, purposeful, and rooted in Anglican tradition.

---

## 🧭 Navigation Structure

```
PUBLIC (unauthenticated)
├── / — Landing Page
└── /about — About the Parish

AUTHENTICATED MEMBERS (basic_member+)
├── /home — Dashboard / Feed
├── /bible — Bible Reader (NIV, NLT, KJV, NRSV, NKJV)
├── /prayers — Prayers & Liturgy
├── /sermons — Sermon Library
├── /pastors-corner — Pastor's Blog
├── /notices — Parish Notices
├── /events — Events Calendar
├── /giving — M-Pesa Giving
├── /community — Community Feed
├── /pastoral-care — Request Pastoral Support
└── /profile — My Account

ADMIN (admin role)
├── /admin — Dashboard + Analytics
├── /admin/cms — No-Code Content Editor
├── /admin/users — Member Management
├── /admin/giving — Giving Reports
├── /admin/analytics — Full Analytics
├── /admin/notifications — Push Notifications
└── /admin/settings — App Settings
```

---

## 📱 Module Specifications

---

### Module 1: Bible Reader

**Purpose:** Provide beautiful, distraction-free access to multiple Bible versions relevant to Anglican worship.

**Supported Versions:**
| Version | Full Name | Notes |
|---|---|---|
| NIV | New International Version | Default for general reading |
| NLT | New Living Translation | For easy comprehension |
| KJV | King James Version | Traditional Anglican worship |
| NRSV | New Revised Standard Version | Ecumenical / scholarly |
| NKJV | New King James Version | Modern traditional |

**Features:**
- **Book & Chapter Navigator** — Responsive accordion for Old/New Testament
- **Verse Highlighting** — Tap/click a verse to highlight; choose color from gold/blue/green/pink
- **Personal Notes** — Attach a note to any verse (stored in Supabase per user)
- **Bookmarks** — Save position across devices; bookmark icon on each chapter
- **Bible Search** — Full-text search within a selected version with highlighted results
- **Version Comparison** — Side-by-side view of the same verse in 2 versions
- **Daily Verse Widget** — Deterministic daily verse shown on home dashboard
- **Reading Plans:**
  - 90-Day Bible
  - Annual Bible Reading
  - Psalms in 30 Days
  - Lenten Reading Plan (40 days)
  - Advent Plan (4 weeks)
- **Offline Access** — Last 10 chapters cached via IndexedDB (Workbox)
- **Font Size Control** — Small / Medium / Large / X-Large

**Data Source:** `api.scripture.api.bible` — all content fetched, not stored locally (except cache)

---

### Module 2: Prayers & Liturgy

**Purpose:** Give congregation members access to Anglican prayers, the liturgical calendar, and a prayer request community.

**Sub-sections:**

**2a. Daily Prayers**
- Morning Prayer (Matins) — BCP format
- Evening Prayer (Evensong) — BCP format
- Compline (Night Prayer)
- Automatically surfaced based on time of day in Nairobi timezone

**2b. Prayer Library**
- Categories: General Prayers, Intercessory, Thanksgiving, Healing, Protection, Family, National
- Anglican Collects organized by liturgical season
- Clergy can add, edit, and feature prayers

**2c. Liturgical Calendar**
- Visual calendar showing current Anglican season with color coding:
  - Advent: Purple/Blue
  - Christmas: White/Gold
  - Epiphany: Green
  - Lent: Purple
  - Holy Week: Deep Red
  - Easter: White/Gold
  - Ordinary Time: Green
- Upcoming special days highlighted

**2d. Prayer Requests (Community)**
- Members submit prayer requests (public or anonymous)
- Others can "Pray" (like) to show solidarity — shows count
- Clergy can mark a request as "Prayed For" and add a pastoral note
- Option: submit privately to clergy only (not visible to congregation)

**2e. Prayer Wall**
- Live-updating feed of public prayer requests
- Filter: All | My Requests | Urgent | Answered

---

### Module 3: Sermon Library

**Purpose:** Host and surface the parish's full sermon archive with rich discovery tools.

**Features:**
- **Grid / List toggle** — Card view with cover thumbnail or compact list
- **Filters:**
  - By preacher (dropdown from clergy roster)
  - By scripture reference (book/chapter)
  - By sermon series
  - By date range
  - By type: Audio | Video | Text
- **Sermon Player:**
  - Audio player with playback speed (0.75x / 1x / 1.25x / 1.5x)
  - Video embed for Cloudinary-hosted video
  - Timestamps / chapter markers
  - Download for offline (audio MP3)
  - Share button (Web Share API)
- **Sermon Notes PDF** — Downloadable study notes attached per sermon
- **Series View** — Grouped card view for multi-part series
- **"Now Streaming" Banner** — Show live Sunday service if stream URL is configured

**Upload Flow (Clergy/Admin only):**
1. Title + description + scripture reference
2. Select/create series
3. Upload audio or video to Cloudinary via signed URL
4. Attach optional PDF notes
5. Set publish date (schedule for future)
6. Preview + Publish

---

### Module 4: Pastor's Corner

**Purpose:** Personal space for the Senior Pastor (and other clergy) to share messages, devotionals, and reflections — more intimate than a sermon.

**Features:**
- **Article Types:** Message from the Desk | Devotional | Reflection | Announcement
- **Rich Text Editor** — Markdown/WYSIWYG (TipTap or Quill)
- **Cover Image** — Cloudinary upload per article
- **Reading time estimate** — auto-calculated
- **Featured Article** — Admin pins one article to top
- **Author Profile Snippet** — Name, photo, title displayed on each post
- **Sharing** — Web Share API + copy link
- **Related Articles** — 3 articles from same author or category
- **Comments** — Optional per-article (can be disabled by admin)

---

### Module 5: Parish Notices

**Purpose:** Replicate and enhance the physical notice board — timely, categorized communications.

**Notice Types:**
| Type | Color Badge | Use Case |
|---|---|---|
| General | Navy | Sunday announcements, general info |
| Urgent | Red | Emergency, urgent prayer |
| Youth | Green | Youth group communications |
| Women | Purple | Women's Guild / Mother's Union |
| Men | Teal | Men's Fellowship |
| Choir | Gold | Choir rehearsals, events |
| Ushers | Orange | Usher rota, instructions |

**Features:**
- **Expiry Date** — Notices auto-archive after expiry_date
- **Pinning** — Admin can pin up to 3 notices to top
- **Attachments** — PDF or image attached per notice (Cloudinary)
- **Read Receipts** — Track who has read a notice (for leaders)
- **Push Notification** — Trigger push to all members when urgent notice posted

---

### Module 6: Events Calendar

**Purpose:** Full-featured church events management with RSVP.

**Event Categories:**
- Sunday Services, Midweek Services, Fellowship, Conferences, Retreats, Youth Events, Outreach, Committee Meetings, Special Occasions

**Views:**
- **Calendar View** — Monthly grid (react-big-calendar or custom)
- **List View** — Upcoming events sorted chronologically
- **Category Filter** — Multi-select checkbox filters

**Features:**
- **RSVP System:** Attending | Maybe | Not Attending — with count visible to leaders
- **Google Maps Integration** — "Get Directions" button for physical events
- **Event Reminders** — Push notification 24h and 1h before
- **Virtual Events** — Zoom/YouTube link for online events
- **Recurring Events** — Weekly Sunday service auto-populates
- **iCal Export** — Add to Google Calendar / iPhone Calendar

---

### Module 7: M-Pesa Giving

**Purpose:** Frictionless digital tithing and offering, powered by Flutterwave's M-Pesa STK Push.

**Giving Categories:**
| Category | KES Min | Description |
|---|---|---|
| Tithe | 10 | Monthly tithe (10% income) |
| Offering | 10 | General church offering |
| Harambee | 100 | Community fundraiser |
| Building Fund | 100 | Church construction/renovation |
| Missions | 100 | Outreach and missions work |
| Welfare | 50 | Support needy church members |
| Other | 10 | Free-form giving |

**STK Push Flow:**
```
Member enters phone + amount + category
    ↓
Frontend validates (phone + amount range)
    ↓
Supabase Edge Function calls Flutterwave API
    ↓
M-Pesa STK Push appears on member's phone
    ↓
Member enters M-Pesa PIN
    ↓
Flutterwave webhook → Supabase confirms transaction
    ↓
Member sees success screen + receipt
```

**Features:**
- **Giving History** — Personal giving timeline with category breakdown
- **Annual Statement** — Downloadable PDF giving statement (for tax/tithe accountability)
- **Anonymous Option** — Give without associating donor name to amount in public reports
- **Recurring Giving** — Set weekly/monthly auto-give reminder (notification-based, not auto-debit)
- **Admin Reports:**
  - Total by category (pie chart)
  - Weekly/monthly trends (line chart)
  - Top givers (anonymized or named — admin toggle)
  - Export to CSV

---

### Module 8: Community

**Purpose:** A moderated, faith-focused social space for congregation members.

**Features:**
- **Post Feed** — Chronological feed with image support
- **Reactions** — 🙏 Pray | ❤️ Amen | 🕊️ Peace (no generic thumbs-up)
- **Comments** — Threaded replies
- **Community Groups:**
  - Youth Group
  - Women's Guild / Mother's Union
  - Men's Fellowship
  - Bible Study Group
  - Cell Groups (by geographical area)
  - Choir
- **Moderation Tools (Leader role):**
  - Pin posts
  - Delete inappropriate content
  - Mute member temporarily
  - Report to admin
- **Media Posts** — Image upload via Cloudinary
- **Event Share** — Share an event from the Events module into the feed
- **Scripture Share** — Share a Bible verse from the Bible module into feed

**Community Guidelines Banner** — Always visible: "This space is governed by our values of love, respect, and Christian brotherhood."

---

### Module 9: Pastoral Care

**Purpose:** Private, dignified channel for members to request spiritual and practical support from clergy.

**Care Request Types:**
- 🙏 Prayer Support
- 💬 Counselling / Pastoral Visit
- 🏥 Hospital / Sick Visit
- 🏠 Home Visit
- ✝️ Bereavement Support
- 💒 Marriage Preparation / Counselling
- ❓ Other

**Flow:**
```
Member fills confidential form
    ↓
Supabase stores with is_confidential = true (RLS: only requester + clergy)
    ↓
Assigned clergy receives push notification + in-app alert
    ↓
Clergy acknowledges, updates status (Pending → In Progress → Completed)
    ↓
Member sees status update (no PII exposed)
    ↓
Clergy can add private note visible only to admin
```

**Features:**
- **Confidential by default** — Zero community visibility
- **Preferred Date/Time** — Member suggests availability
- **Status Tracker** — Member can see Pending | Acknowledged | In Progress | Completed
- **Contact Phone** — Member provides alternate contact number
- **Clergy Dashboard:** List of requests grouped by status; assignment to specific clergy
- **Urgency Flag** — Mark request as urgent (surfaces at top of clergy queue)

---

### Module 10: No-Code Admin CMS

**Purpose:** Empower administrators and non-technical clergy to manage content without touching code.

**CMS Architecture:** Block-based page editor with drag-and-drop reordering.

**Editable Pages:**
- Home / Landing Page
- About the Parish
- Meet the Clergy
- Services Schedule
- Ministries
- Contact & Location

**Block Types:**
| Block | Drag In | Configure |
|---|---|---|
| Hero Banner | ✅ | Image, headline, subtext, CTA button |
| Rich Text | ✅ | WYSIWYG editor |
| Image + Caption | ✅ | Cloudinary picker, alt text |
| Video Embed | ✅ | YouTube / Cloudinary URL |
| Scripture Quote | ✅ | api.bible verse picker |
| Call to Action | ✅ | Button text, link, color |
| Grid / Columns | ✅ | 2 or 3 columns with nested blocks |
| Carousel | ✅ | Swipeable image gallery |
| Spacer | ✅ | Height in px |

**Drag-and-Drop Canvas:**
- Uses `@dnd-kit/core` + `@dnd-kit/sortable`
- Each block: drag handle left | settings gear right | delete trash right
- Preview toggle (desktop / mobile wireframe)
- "Publish" vs "Save Draft" states

**Form Builder:**
- Create custom forms (contact form, volunteer sign-up, cell group registration)
- Field types: Text, Email, Phone (Kenyan), Number, Dropdown, Checkbox, Radio, Date, Textarea
- Responses stored in Supabase with export to CSV
- Embed form on any CMS page via Form Block

**Media Library:**
- Cloudinary-backed grid of all uploaded images/videos/PDFs
- Filter by type, upload date, uploader
- Bulk delete
- Copy URL to clipboard
- Used by all upload pickers across the CMS

**Global Settings (editable by admin):**
- Parish name, short name, logo
- Contact: phone, email, physical address, PO Box
- Service times (Sunday, midweek, etc.)
- Social links: Facebook, YouTube, Instagram, WhatsApp Group
- M-Pesa Paybill / Till number (display only — for reference)
- App theme accent (choose from preset navy/gold variations)

---

### Module 11: Analytics Dashboard

**Purpose:** Give parish leadership clear insight into community engagement, growth, and giving.

**Access:** Admin role only. All data is aggregated — no individual PII exposed in charts.

**Dashboard Overview Cards:**
```
┌─────────────────┬─────────────────┬─────────────────┐
│  Total Members  │  Active Members │  This Month New │
│     1,247       │    89% active   │     +23         │
├─────────────────┼─────────────────┼─────────────────┤
│  Total Given    │  This Month     │  M-Pesa Success │
│  KES 2.4M       │  KES 180,000    │     96.4%       │
└─────────────────┴─────────────────┴─────────────────┘
```

**Chart 1: Member Growth (Line Chart)**
- X-axis: Month (last 12 months)
- Y-axis: Total registered members
- Color: Navy `#1a3a5c`
- Shows: New registrations per month as secondary bar

**Chart 2: Giving Trends (Bar + Line Combo)**
- X-axis: Week / Month toggle
- Y-axis: Total KES given
- Bars by category color (Tithe, Offering, Harambee, etc.)
- Line overlay: last year same period for comparison

**Chart 3: Sermon Engagement (Horizontal Bar)**
- Shows top 10 sermons by view count
- Segmented by type: Audio / Video
- Color: Gold `#c9a84c`

**Chart 4: Event Attendance (Grouped Bar)**
- X-axis: Event name / date
- Y-axis: RSVP count vs expected attendance
- Groups: Attending | Maybe | Not Attending

**Chart 5: Prayer Requests Over Time (Area Chart)**
- X-axis: Week
- Y-axis: New prayer requests submitted
- Shaded area with naval gradient
- Overlapping line: prayer interactions (solidarity clicks)

**Date Range Filter:** Last 7 days | Last 30 days | Last 3 months | Last 12 months | Custom range

**Export:** All charts export to PNG. Summary report exports to PDF.

---

## 📐 PWA Design System

### Mobile Layout (< 768px)
```
┌──────────────────────┐
│  HEADER              │  ← Parish logo + notification bell + profile avatar
│  (sticky, navy bg)   │
├──────────────────────┤
│                      │
│  PAGE CONTENT        │
│  (scrollable)        │
│                      │
│                      │
├──────────────────────┤
│  BOTTOM NAV          │  ← Home | Bible | Sermons | Giving | More
│  (fixed, white bg)   │
└──────────────────────┘
```

**Bottom Navigation Icons (Mobile):**
- 🏠 Home
- 📖 Bible
- 🎙️ Sermons
- 💛 Give
- ⋯ More (opens sheet with: Prayers, Events, Notices, Community, Pastoral Care, Profile)

### Desktop Layout (≥ 1024px)
```
┌────────┬────────────────────────────────────────┐
│        │  TOPBAR                                 │
│ SIDE   │  (breadcrumb + search + notifications)  │
│  BAR   ├────────────────────────────────────────┤
│ (240px)│                                        │
│        │  PAGE CONTENT                          │
│ Navy   │  (max-w-5xl centered)                  │
│ bg     │                                        │
│        │                                        │
└────────┴────────────────────────────────────────┘
```

**Sidebar Navigation (Desktop):**
- Home
- 📖 Bible
- 🙏 Prayers
- 🎙️ Sermons
- ✝️ Pastor's Corner
- 📋 Notices
- 📅 Events
- 💛 Giving
- 👥 Community
- 🕊️ Pastoral Care
- ⚙️ Admin (if admin role)

### PWA Install Prompt
- Show "Add to Home Screen" prompt after:
  - User has visited 3 times OR
  - User has completed a giving action
- Custom install UI (not browser default) — navy card with gold CTA

### Offline State
- Bible: last 10 chapters cached (Workbox CacheFirst)
- Sermons: previously played audio cached in Cache Storage
- App shell: full offline load
- Offline banner: `"You're offline — some features may be unavailable"`
- Prayer requests queue: form submissions stored in IndexedDB, sync when back online

---

## 🗓️ 18-Week Build Timeline

### Weeks 1–2: Foundation
- Project scaffold, Tailwind, shadcn/ui
- Supabase project, schema migration, RLS policies
- Auth flow (register, login, phone OTP, forgot password)
- Profiles table, role system
- App shell (header, nav, protected routes)
- PWA manifest + basic service worker

### Weeks 3–4: Bible Module
- api.bible integration
- Book/chapter navigator
- Bible reader with verse highlighting
- Bookmarks + notes
- Bible search
- Daily verse widget
- Offline chapter caching

### Weeks 5–6: Prayers & Liturgy
- Prayer library (all categories)
- Liturgical calendar
- Daily prayer by time of day
- Prayer request form + wall
- Clergy prayer dashboard

### Weeks 7–8: Sermons
- Cloudinary integration
- Sermon upload (clergy/admin)
- Sermon player (audio + video)
- Filters + search
- Sermon series grouping
- PDF notes download

### Weeks 9–10: Pastor's Corner + Notices + Events
- Pastor's Corner rich text editor + publishing
- Notice board with categories + urgency
- Events calendar (list + month grid)
- RSVP system
- Event notifications

### Weeks 11–12: M-Pesa Giving
- Flutterwave SDK integration
- STK Push Edge Function
- Giving categories form
- M-Pesa webhook handler
- Transaction polling + status display
- Giving history + annual statement
- Admin giving reports

### Weeks 13–14: Community + Pastoral Care
- Community post feed
- Reactions + comments
- Community groups
- Moderation tools
- Pastoral care request form
- Clergy pastoral dashboard
- Status update system

### Weeks 15–16: Admin CMS + Analytics
- No-code block editor (drag-and-drop)
- Form builder
- Media library
- 5 analytics charts (Recharts)
- Member management table
- Push notification sender
- Global settings panel

### Weeks 17–18: Polish + Deployment
- Firebase Cloud Messaging (push notifications)
- Full offline support audit (Workbox)
- Lighthouse performance audit → ≥ 90 score
- Accessibility audit (WCAG 2.1 AA)
- Sentry error monitoring
- Staging environment testing
- DNS + custom domain
- Production Supabase RLS final audit
- Go live 🎉

---

## 💡 13 Lovable.dev Prompts

> Use these prompts sequentially in Lovable.dev to scaffold the application. Each prompt builds on the previous.

---

**Prompt 1 — Project Foundation**

```
Create a React TypeScript Progressive Web App for an Anglican Church of Kenya (ACK) parish called "ACK Parish". 

Tech stack: Vite, React 18, TypeScript 5, Tailwind CSS 3, shadcn/ui, React Router DOM 6, Supabase for auth and database.

Color scheme: Primary navy #1a3a5c, accent gold #c9a84c, cream background #faf8f4.

Set up:
1. Tailwind config extending colors with "navy" and "gold" palettes
2. Supabase client in src/lib/supabase.ts
3. Auth context/provider with login, register, logout, and session persistence
4. Four user roles: basic_member, leader, clergy, admin
5. A ProtectedRoute component that redirects unauthenticated users to /login
6. A RoleGuard component that conditionally renders children based on user role
7. Mobile-first app shell:
   - Header with parish logo (placeholder cross icon), notification bell, avatar
   - Bottom navigation (mobile): Home, Bible, Sermons, Give, More
   - Sidebar navigation (desktop ≥1024px): full menu with all modules
8. A beautiful login/register page with navy + gold branding, Playfair Display serif headings
9. Landing page at "/" for unauthenticated visitors

Include placeholder pages for: Home, Bible, Prayers, Sermons, Pastor's Corner, Notices, Events, Giving, Community, Pastoral Care, Profile.
```

---

**Prompt 2 — Supabase Schema & Auth**

```
Add the complete Supabase database schema for the ACK Parish app. Create a migration file at supabase/migrations/001_initial_schema.sql with these tables:

1. profiles (extends auth.users): id, full_name, phone (Kenyan +254 format), avatar_url, role (enum: basic_member/leader/clergy/admin), cell_group, membership_number, date_joined, is_active, preferred_bible_version
2. sermons: id, title, description, scripture_reference, sermon_date, preacher_id, series_id, type (audio/video/text), media_url, cloudinary_public_id, thumbnail_url, pdf_url, view_count, is_published
3. sermon_series: id, title, description, cover_image_url
4. prayers: id, title, content, category (morning/evening/intercessory/liturgical/special), liturgical_season, is_featured
5. prayer_requests: id, requester_id, request, is_anonymous, is_public, prayer_count, status
6. events: id, title, description, category, location, start_datetime, end_datetime, cover_image_url, rsvp_enabled
7. event_rsvps: id, event_id, user_id, status (attending/maybe/not_attending)
8. notices: id, title, content, category, is_urgent, expiry_date, is_published
9. giving_records: id, donor_id, amount_kes (DECIMAL), category (tithe/offering/harambee/building_fund/missions/welfare/other), is_anonymous
10. mpesa_transactions: id, giving_record_id, phone_number, amount_kes, merchant_request_id, checkout_request_id, mpesa_receipt_number, status (pending/completed/failed)
11. community_posts: id, author_id, content, image_url, likes_count, is_approved, group_id
12. community_comments: id, post_id, author_id, content
13. pastoral_care_requests: id, requester_id, type, details, is_confidential (default true), status (pending/acknowledged/in_progress/completed), assigned_clergy_id
14. pastors_corner: id, author_id, title, content, category, is_published
15. bible_bookmarks: id, user_id, version (NIV/NLT/KJV/NRSV/NKJV), book_id, chapter, verse, note

Enable RLS on all tables. Add policies: users read/update own profile, published sermons visible to authenticated users, pastoral care visible only to requester + assigned clergy + admin.

Create a trigger to auto-insert a profile row when a new auth user signs up.
```

---

**Prompt 3 — Bible Reader Module**

```
Build a complete Bible reader module for the ACK Parish app at /bible.

Integration: Use the api.bible REST API (https://scripture.api.bible/v1). Store the API key in VITE_API_BIBLE_KEY env variable.

Support 5 versions with their api.bible IDs:
- NIV: de4e12af7f28f599-01
- NLT: 65eec8e0b60e656b-01  
- KJV: de4e12af7f28f599-02
- NRSV: bba9f40183526463-01
- NKJV: 9879dbb7cfe39e4d-04

Build these components:
1. VersionSelector — dropdown with all 5 versions, saves preference to Supabase profiles
2. BookNavigator — accordion grouped by Old Testament / New Testament
3. ChapterView — renders HTML content from api.bible with proper typography (Lora font, line-height 1.9, max-w-2xl)
4. VerseHighlighter — click any verse to highlight in gold; save to bible_bookmarks table
5. BibleSearch — search within selected version, display results with book/chapter context
6. DailyVerse — deterministic verse based on day of year, shown in a beautiful gold-bordered card
7. ReadingPlanSelector — show 5 reading plans (90-day, annual, Psalms 30-day, Lenten, Advent)
8. BookmarksList — sidebar sheet showing saved bookmarks with verse preview

Mobile: swipe left/right to navigate chapters. Desktop: keyboard arrows for prev/next chapter.

Cache the last 10 viewed chapters in localStorage for offline reading. Show OfflineBanner component when navigator.onLine is false.
```

---

**Prompt 4 — Prayers & Liturgy Module**

```
Build the Prayers & Liturgy module at /prayers for the ACK Parish app.

Create these sections with tab navigation:

1. Daily Prayer tab:
   - Detect time in Africa/Nairobi timezone
   - Before 12pm: show Morning Prayer (Matins) card with BCP opening sentences
   - 12pm–6pm: show Midday Prayer card
   - After 6pm: show Evening Prayer (Evensong) card
   - Each prayer is a full-screen readable view with navy header, cream background

2. Prayer Library tab:
   - Grid of prayer cards fetched from prayers table in Supabase
   - Category chips: General | Intercessory | Thanksgiving | Healing | National | Family | Anglican Collects
   - Each card: title, excerpt (2 lines), category badge
   - Click to open full prayer in a modal or drawer
   - Clergy/admin see "+ Add Prayer" button

3. Liturgical Calendar tab:
   - Visual display of current Anglican liturgical season with appropriate color
   - Seasons: Advent (purple), Christmas (white/gold), Epiphany (green), Lent (purple), Holy Week (red), Easter (white/gold), Ordinary Time (green)
   - Auto-calculate current season from today's date
   - Show current season name, color indicator, days remaining

4. Prayer Wall tab:
   - Live feed of public prayer_requests from Supabase (realtime subscription)
   - Each card: requester name (or "Anonymous"), request text, pray count, date
   - "🙏 Pray" button — increments prayer_count, saves to prayer_interactions table (one per user)
   - "+ New Prayer Request" button — opens form:
     - Textarea for request
     - Toggle: Share publicly / Keep private (clergy only)
     - Toggle: Use my name / Stay anonymous
     - Submit button with validation
```

---

**Prompt 5 — Sermon Library Module**

```
Build the complete Sermon Library at /sermons for the ACK Parish app.

Cloudinary integration: use VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET env vars. Always serve images with f_auto,q_auto transformations.

Components to build:

1. SermonGrid — responsive grid (1 col mobile, 2 col tablet, 3 col desktop) of SermonCard components
2. SermonCard — thumbnail image (Cloudinary), title, preacher name + avatar, date, scripture reference, type badge (AUDIO/VIDEO/TEXT), play button overlay on hover
3. SermonFilters — horizontal scrollable chip filters: All | Audio | Video | By Preacher (dropdown) | By Series (dropdown) | Date Range picker
4. SermonPlayer — bottom sheet (mobile) / right sidebar (desktop):
   - For audio: custom player with play/pause, seek slider, current time / duration, speed selector (0.75x/1x/1.25x/1.5x), download button
   - For video: Cloudinary video player or <video> tag with controls
   - Sermon details: title, preacher, scripture, description
   - Download sermon notes (PDF link if attached)
   - Share button using Web Share API
5. SeriesCard — grouped view when filter is by Series, showing all sermons in a series
6. SermonUploader (clergy/admin only):
   - Form: title, description, scripture_reference (e.g. "John 3:16"), preacher (dropdown of clergy), series (create or select), type
   - File upload to Cloudinary signed URL
   - Upload progress bar
   - Thumbnail upload (optional)
   - PDF notes upload (optional)
   - Publish toggle + date picker
   - Save as draft / Publish button

Track view_count: increment in Supabase when user opens SermonPlayer for more than 10 seconds.
```

---

**Prompt 6 — Pastor's Corner + Notices + Events**

```
Build three modules for the ACK Parish app:

PASTOR'S CORNER (/pastors-corner):
- List page: Featured article (full-width card with large image), then grid of article cards
- Article page (/pastors-corner/:id): Full content render, author sidebar (name, title, photo), reading time, share button, related articles
- Article card: cover image, category badge (Message/Devotional/Reflection), title, excerpt, author, date, reading time
- Clergy/admin: rich text editor (use TipTap or react-quill) for creating/editing articles
- Categories: "Message from the Desk" | "Devotional" | "Reflection"

NOTICES (/notices):
- List of published notices from notices table, sorted by is_urgent DESC, created_at DESC
- Urgent notices: red left border + "URGENT" badge
- Category badges with colors: General (navy), Urgent (red), Youth (green), Women (purple), Men (teal), Choir (gold), Ushers (orange)
- Auto-hide expired notices (where expiry_date < today)
- Pinned notices shown first
- Leaders/admin: "+ New Notice" button → form with title, content (textarea), category, urgency toggle, expiry date, optional file upload (Cloudinary)

EVENTS (/events):
- Toggle: 📅 Calendar view | ☰ List view
- Calendar: month grid showing event dots on dates, click day to see events
- List view: chronological cards with date badge, title, location, category, RSVP count
- Event detail page (/events/:id):
  - Cover image (Cloudinary)
  - Date, time (Africa/Nairobi timezone)
  - Location with Google Maps link
  - Description
  - RSVP buttons: "✓ Attending" | "? Maybe" | "✗ Not Attending" (upsert to event_rsvps)
  - Attendee count visible to all; attendee list visible to leaders+
- Leaders/admin: event form with all fields + recurrence option (weekly for Sunday services)
```

---

**Prompt 7 — M-Pesa Giving Module**

```
Build the complete M-Pesa Giving module at /giving for the ACK Parish app using Flutterwave.

Kenyan phone validation utility (add to src/lib/utils.ts):
- Accept formats: 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX
- Normalize to +254XXXXXXXXX
- Reject invalid numbers

Giving form (GivingForm component):
1. Giving category selector — card grid with icons:
   - 📿 Tithe | 🎁 Offering | 🤝 Harambee | 🏛️ Building Fund | 🌍 Missions | ❤️ Welfare | ✨ Other
   - Min amounts: Harambee/Building/Missions = KES 100, Welfare = KES 50, others = KES 10
2. Amount input — number field with "KES" prefix, quick-select buttons: KES 100 | 500 | 1,000 | 2,500 | 5,000
3. Phone number input — pre-filled from profile, Kenyan validation with real-time feedback
4. Anonymous toggle — "Give anonymously (your name will not appear in reports)"
5. "Give Now" button → triggers STK push

M-Pesa Flow:
- On submit: call Supabase Edge Function 'mpesa-stk-push' with phone, amount, category
- Show loading state: "Sending M-Pesa prompt to +254..."
- Show instruction card: "Check your phone and enter your M-Pesa PIN to complete"
- Poll transaction status every 3 seconds (max 60 seconds)
- On success: green confirmation with receipt details (amount, reference, timestamp)
- On timeout: "Your session timed out. Please try again."
- On failure: show error message from Flutterwave result

GivingHistory component (tab within /giving):
- List of user's giving_records with date, category badge, amount in KES, status badge
- Annual total summary card: "You have given KES X,XXX this year"
- "Download Annual Statement" button → triggers PDF generation

Admin Giving Dashboard (/admin/giving):
- Summary cards: Total this week, Total this month, Total all time, M-Pesa success rate
- Table: date, donor (name or "Anonymous"), category, amount KES, transaction status, receipt number
- Filter by date range and category
- Export to CSV button
```

---

**Prompt 8 — Community Module**

```
Build the Community module at /community for the ACK Parish app.

Main feed (PostFeed component):
- Vertical list of PostCard components, newest first
- Infinite scroll with React Query's useInfiniteQuery
- Supabase realtime subscription for new posts
- "+ New Post" FAB (bottom right on mobile)

PostCard:
- Author avatar + name + cell group tag + timestamp
- Content text (max 5 lines with "Read more" expand)
- Image (if attached) — Cloudinary URL with w_600,q_auto transform
- Reaction bar: "🙏 Pray (12)" | "✝️ Amen (8)" | "🕊️ Peace (4)" — stored in community_reactions table
- Comment count button → expands inline CommentThread
- Share button (Web Share API)
- Three-dot menu: Report | (Leader+: Pin | Delete | Remove from group)

New Post Form (slide-up sheet mobile / modal desktop):
- Textarea: "What's on your heart?"
- Image upload button → Cloudinary (optional, max 1 image)
- Scripture share button → opens mini Bible picker → appends verse to post
- Group selector → dropdown of community_groups
- Post button with validation (min 10 chars)

Community Groups tab:
- Grid of GroupCard components (cover image, name, member count, leader name)
- "View Group" → group feed filtered to that group_id
- Admin/leaders: "Create Group" form

CommentThread (inline):
- Last 3 comments shown, "View all X comments" link
- Comment input at bottom with submit
- Delete own comment

Moderation (leader+ role):
- Pinned posts appear at top with 📌 badge
- "Reported" tab in leader view showing flagged posts
- One-click delete with confirmation
```

---

**Prompt 9 — Pastoral Care Module**

```
Build the Pastoral Care module at /pastoral-care for the ACK Parish app.

MEMBER VIEW:
Landing page with empathetic intro:
"Our clergy are here for you in every season of life. All requests are completely confidential."

Care Request Form:
- Type selector (card grid with icons):
  🙏 Prayer Support | 💬 Counselling | 🏥 Hospital Visit | 🏠 Home Visit | ✝️ Bereavement | 💒 Marriage | ❓ Other
- Details textarea: "Please share what support you need..." (min 20 chars)
- Preferred date picker (KE timezone) — optional
- Preferred time: Morning (8–12) | Afternoon (12–5) | Evening (5–8) — optional  
- Contact phone — pre-filled from profile, editable
- Confidentiality notice: "🔒 Your request is private. Only authorized clergy and admin can see this."
- Submit button

My Requests tab (member):
- List of own pastoral_care_requests
- Each card: type icon, date submitted, status badge (Pending 🟡 / Acknowledged 🔵 / In Progress 🟣 / Completed 🟢)
- No clergy notes visible to member (privacy)

CLERGY/ADMIN VIEW (/admin/pastoral-care or clergy dashboard tab):
- Request queue sorted by urgency + date
- Assign to self or another clergy member
- Status update dropdown
- Internal notes field (clergy-only, never shown to member)
- Filter by: status, type, date range
- Urgent flag toggle
- Mark complete with optional completion note

RLS enforcement:
- pastoral_care_requests: SELECT only for auth.uid() = requester_id OR auth.uid() = assigned_clergy_id OR role = 'admin'
- Never expose this data in any analytics chart
- Never include in community feed
```

---

**Prompt 10 — Admin CMS (No-Code Editor)**

```
Build the no-code Admin CMS at /admin/cms for the ACK Parish app. This is for admin and clergy roles only.

Page Manager:
- List of CMS pages (slug, title, status, last edited)
- "New Page" button → enter title + slug → creates cms_pages record
- "Edit" button → opens Page Editor

Page Editor (drag-and-drop canvas):
Using @dnd-kit/core and @dnd-kit/sortable:
- Left panel: Block Library (drag from here into canvas)
  - Hero | Rich Text | Image | Video | Scripture Quote | CTA Button | 2-Column Grid | 3-Column Grid | Carousel | Spacer
- Center: Canvas (drop zone, sortable list of blocks)
  - Each block shows: drag handle (⠿) | block preview | settings gear | delete icon
- Right panel: Block Settings (appears when block is selected)

Block configurations:
- Hero: bg image picker (Cloudinary), headline input, subtext input, CTA text + link, overlay opacity slider
- Rich Text: TipTap editor (bold, italic, headings H2/H3, bullet list, numbered list, link, image)
- Image: Cloudinary picker, alt text, caption, alignment (left/center/right)
- Scripture Quote: bible version selector + verse reference input → fetches from api.bible → renders in gold-bordered card
- CTA Button: text, link URL, color (navy/gold), size (sm/md/lg), full-width toggle

Toolbar:
- "Preview" → renders page in read-only mode (desktop/mobile toggle)
- "Save Draft" → saves to cms_blocks with order_index
- "Publish" → sets is_published = true on cms_pages

Media Library tab (/admin/cms/media):
- Grid of all Cloudinary assets (fetch via Cloudinary Admin API or store URLs in Supabase media_assets table)
- Filter: Images | Videos | PDFs
- Upload button → Cloudinary signed upload
- Copy URL button on hover
- Delete button (removes from Cloudinary + Supabase)

Global Settings tab (/admin/settings):
- Form fields for: parish name, tagline, logo upload, contact phone, email, address, service times (repeating fields)
- Social links: Facebook URL, YouTube URL, Instagram URL, WhatsApp group link
- Save button → upserts to cms_settings table
```

---

**Prompt 11 — Analytics Dashboard**

```
Build the Analytics Dashboard at /admin/analytics for the ACK Parish app. Admin role only.

Use Recharts for all charts. Colors: Navy #1a3a5c, Gold #c9a84c, and a full palette: ['#1a3a5c', '#c9a84c', '#2d6a4f', '#e76f51', '#457b9d', '#a8dadc'].

Top row — Summary Cards (6 cards in 2x3 grid):
- Total Members | Active Members (active in last 30 days) | New This Month
- Total Giving (all time) KES | Giving This Month KES | M-Pesa Success Rate %

Date range filter: Last 7 days | 30 days | 3 months | 12 months | Custom — applies to all charts.

Chart 1 — Member Growth (LineChart):
- X: months, Y: cumulative member count
- Secondary bar: new registrations that month
- Tooltip: "Month: [month], Total: [n], New: [n]"
- Data from profiles.created_at grouped by month

Chart 2 — Giving Trends (ComposedChart):
- Stacked bars by giving category (Tithe=navy, Offering=gold, Harambee=green, Building=orange, Missions=blue, Welfare=teal)
- Line overlay showing last year same period
- Y axis: KES amounts formatted with toLocaleString('en-KE')
- Data from giving_records grouped by week/month

Chart 3 — Sermon Engagement (HorizontalBarChart):
- Top 10 sermons by view_count
- Bars colored by type: audio=navy, video=gold
- Tooltip shows: preacher name, date, view count

Chart 4 — Event Attendance (GroupedBarChart):
- X: event names (truncated to 20 chars)
- Y: RSVP counts
- Groups: Attending (green), Maybe (amber), Not Attending (red)
- Data from event_rsvps joined to events

Chart 5 — Prayer Requests (AreaChart):
- X: weeks, Y: new prayer requests
- Shaded area with navy gradient (fill: url(#navyGradient))
- Overlapping line: prayer interactions (solidarity clicks)
- SVG gradient definition included

Export section:
- "Export Summary PDF" button → generates PDF using jsPDF with all 5 charts (as canvas snapshots) and summary numbers
- Each chart also has individual "Save as PNG" button using html2canvas
```

---

**Prompt 12 — Push Notifications & Offline PWA**

```
Complete the PWA features for the ACK Parish app:

FIREBASE CLOUD MESSAGING (Push Notifications):
Setup:
1. Initialize Firebase in src/lib/firebase.ts with config from env vars
2. Request notification permission contextually (show after user has been active 30+ seconds OR after completing a giving action — NOT on page load)
3. Get FCM token and save to profiles.notification_token in Supabase
4. Register service worker for background notifications

Create a Supabase Edge Function 'send-notification' that:
- Accepts: title, body, icon, click_action, target (all | role | specific user_id)
- Fetches notification_token(s) from profiles table based on target
- Calls FCM API (https://fcm.googleapis.com/v1/projects/:projectId/messages:send)
- Returns sent count

Admin Notification Sender (/admin/notifications):
- Form: Title input, Body textarea, Target selector (Everyone | Basic Members | Leaders | Clergy | Specific user search), Icon URL (optional), Click action URL
- "Send Notification" button with confirmation dialog
- Notification History table: date, title, target, recipients sent, status

Trigger notifications automatically for:
- New urgent notice posted → all members
- New event published → all members
- Prayer request answered by clergy → requester only

OFFLINE PWA (Workbox via vite-plugin-pwa):
1. vite.config.ts: configure VitePWA with registerType: 'autoUpdate'
2. Workbox strategies:
   - App shell (JS/CSS/HTML): CacheFirst, max 30 days
   - api.bible responses: CacheFirst, max 7 days, max 50 entries
   - Cloudinary images: CacheFirst, max 60 days, max 100 entries  
   - Supabase API calls: NetworkFirst with fallback
3. Background sync: Queue failed form submissions (prayer requests, giving) in IndexedDB, replay when online
4. OfflineBanner component: shows when navigator.onLine = false, hides when back online (with animation)
5. PWA install prompt: Custom UI prompt after 3rd visit, saves dismissed state to localStorage
```

---

**Prompt 13 — Final Polish, Auth UX & Deployment**

```
Complete the final polish for the ACK Parish app:

AUTHENTICATION UX:
- Login page: beautiful centered card with ACK cross logo, parish name in Playfair Display, email + password form, "Forgot Password" link, "Register" link
- Register page: full_name, email, password, phone (Kenyan format with real-time validation: show +254 normalized version below input), cell_group (optional text)
- Phone OTP option: "Login with M-Pesa Number" → Supabase phone auth
- After login: redirect to /home, show "Welcome back, [name]!" toast
- Profile page (/profile): avatar upload (Cloudinary), edit name/phone/cell_group, change preferred Bible version, change password, notification preferences toggle, delete account option

ONBOARDING FLOW (first-time users):
- Step 1: "Welcome to [Parish Name]! Let's set up your account." → confirm name, add phone
- Step 2: "Choose your preferred Bible version" → 5 version cards with descriptions
- Step 3: "Enable notifications to stay connected?" → permission prompt with clear value proposition
- Step 4: App tour (3 slide highlights: Bible, Giving, Community)
- Skip option on all steps

HOME DASHBOARD (/home):
- Greeting: "Good morning, Kelvin ✝️" (time-aware + name from profile)
- Daily Verse card (navy background, gold text, scripture reference, gold border)
- Quick actions row: 📖 Read | 🙏 Pray | 💛 Give | 👥 Community
- Latest Sermon card (thumbnail + title + preacher + play button)
- Upcoming events (next 3 events as horizontal scroll cards)
- Recent Notices (latest 3 published notices)
- Prayer Wall preview (latest 3 prayer requests with "Pray" buttons)

PERFORMANCE:
- Add React.lazy() + Suspense to all page-level components
- Add loading skeleton components for all list views
- Image lazy loading (loading="lazy" on all Cloudinary images)
- Run Lighthouse audit and fix issues until PWA score ≥ 90

DEPLOYMENT:
- Configure Firebase Hosting (firebase.json, .firebaserc)
- Set up GitHub Actions CI/CD: lint → type-check → build → deploy to Firebase
- Set Supabase environment to production (update auth redirect URLs)
- Configure custom domain in Firebase Hosting
- Add Sentry for error monitoring (VITE_SENTRY_DSN env var)
- Create comprehensive README.md with setup instructions

Final check: verify all RLS policies work correctly by testing as each role (basic_member, leader, clergy, admin). Ensure pastoral_care_requests and anonymous giving cannot be accessed by unauthorized roles.
```

---

## 🔒 Security Checklist

- [ ] All tables have RLS enabled
- [ ] No service role key exposed to frontend
- [ ] Pastoral care data inaccessible to non-clergy
- [ ] M-Pesa webhook validates Flutterwave signature
- [ ] Phone numbers stored in normalized format only
- [ ] Cloudinary unsigned upload preset scoped to specific folder
- [ ] Environment variables audited (no secrets in VITE_ prefix)
- [ ] Admin routes protected by both RoleGuard + Supabase RLS
- [ ] Anonymous giving not linkable to donor in any query
- [ ] Firebase Security Rules configured for FCM

---

## 🙏 ACK-Specific Content Guidelines

### Anglican Liturgical Language
- Use "Collect" not "Prayer of the Week"
- Use "Eucharist" or "Holy Communion" not "Mass"
- Use "Sermon" or "Homily" — not "Message" (generic evangelical)
- Seasons follow the Anglican Communion calendar
- BCP (Book of Common Prayer) forms for morning/evening prayer
- "The Peace" — not "Greeting Time"
- "Offering" — can use "Harambee" for special community fundraisers

### Swahili Phrases (contextual use)
| English | Swahili |
|---|---|
| Giving | Kutoa / Sadaka |
| Prayer | Sala / Maombi |
| Worship | Ibada |
| Welcome | Karibu |
| Blessings | Baraka |
| Night vigil service | Mkesha |
| Church | Kanisa |
| Sermon | Mahubiri |

### Cultural Considerations
- M-Pesa is the primary payment method — credit card is secondary
- Many users on mobile data — optimize aggressively for data usage
- Cell groups are the primary community unit (geographic)
- Women's Guild, Men's Fellowship, Youth are distinct community pillars
- Harambee (community fundraiser) is a distinctly Kenyan cultural institution
- Bereaved families expect pastoral visits — this is core, not optional

---

*ACK Parish Web Application Master Plan — February 2026*  
*Built for the glory of God and the strengthening of His people in Kenya.*