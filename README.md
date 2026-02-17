# ACK Parish Web Application

A Progressive Web App for Anglican Church of Kenya parishes, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 📖 **Bible Reader** - Multiple versions (NIV, NLT, KJV, NRSV, NKJV)
- 🙏 **Prayers & Liturgy** - Anglican prayers and liturgical calendar
- 🎙️ **Sermon Library** - Audio/video sermons with search
- ✝️ **Pastor's Corner** - Messages and devotionals
- 📋 **Notices** - Parish announcements
- 📅 **Events** - Calendar with RSVP system
- 💛 **M-Pesa Giving** - Secure digital tithing
- 👥 **Community** - Social feed for members
- 🕊️ **Pastoral Care** - Confidential support requests
- 📊 **Admin Dashboard** - Analytics and CMS

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Flutterwave (M-Pesa)
- **Media**: Cloudinary
- **Bible API**: api.bible
- **Notifications**: Firebase Cloud Messaging

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cloudinary account
- Flutterwave account (for M-Pesa)
- api.bible API key
- Firebase project (for push notifications)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd church
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Set up Supabase:
   - Create a new Supabase project
   - Run migrations in `supabase/migrations/` in order
   - Copy your project URL and anon key to `.env.local`

6. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # React components
│   ├── auth/      # Authentication components
│   ├── layout/    # Layout components
│   └── shared/    # Shared/reusable components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
├── pages/         # Page components
├── router/        # Routing configuration
├── services/      # API services
├── store/         # State management (Zustand)
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The database schema is defined in `supabase/migrations/`:
- `001_initial_schema.sql` - Tables and enums
- `002_rls_policies.sql` - Row Level Security policies

## User Roles

- **basic_member** - Regular congregation members
- **leader** - Cell group leaders, ministry heads
- **clergy** - Pastors and priests
- **admin** - Full system access

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

The app can be deployed to:
- Firebase Hosting
- Vercel
- Netlify
- Any static hosting service

## License

Proprietary - ACK Parish

## Support

For support, contact the development team.
