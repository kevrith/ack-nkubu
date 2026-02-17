# Supabase Setup Instructions

## Step 1: Get Your Supabase Anon Key

1. Go to https://supabase.com/dashboard/project/bcioubwyogptmotwdgty/settings/api
2. Copy the `anon` `public` key
3. Update `.env.local` file with the actual key (replace the placeholder)

## Step 2: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/bcioubwyogptmotwdgty/editor
2. Click on "SQL Editor"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"
5. Then copy and paste the contents of `supabase/migrations/002_rls_policies.sql`
6. Click "Run"

### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref bcioubwyogptmotwdgty

# Run migrations
supabase db push
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Create First Admin User

1. Register through the app at http://localhost:5173/register
2. Go to Supabase Dashboard > Authentication > Users
3. Find your user and note the UUID
4. Go to SQL Editor and run:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-uuid-here';
```

## Next Steps

Once setup is complete, you can:
- Access the app at http://localhost:5173
- Login with your credentials
- Start building additional modules (Bible, Sermons, etc.)

## Troubleshooting

If you get authentication errors:
- Verify your Supabase URL and anon key in `.env.local`
- Check that migrations ran successfully
- Ensure the `handle_new_user()` trigger is active
