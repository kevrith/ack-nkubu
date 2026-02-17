-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('basic_member', 'leader', 'clergy', 'admin');
CREATE TYPE bible_version AS ENUM ('NIV', 'NLT', 'KJV', 'NRSV', 'NKJV');
CREATE TYPE giving_category AS ENUM ('tithe', 'offering', 'harambee', 'building_fund', 'missions', 'welfare', 'other');
CREATE TYPE mpesa_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE sermon_type AS ENUM ('audio', 'video', 'text');
CREATE TYPE prayer_category AS ENUM ('morning', 'evening', 'intercessory', 'liturgical', 'special');
CREATE TYPE notice_category AS ENUM ('general', 'urgent', 'youth', 'women', 'men', 'choir', 'ushers');
CREATE TYPE event_category AS ENUM ('service', 'fellowship', 'conference', 'retreat', 'youth', 'outreach', 'committee');
CREATE TYPE pastoral_care_type AS ENUM ('prayer', 'counselling', 'hospital_visit', 'home_visit', 'bereavement', 'marriage', 'other');
CREATE TYPE pastoral_care_status AS ENUM ('pending', 'acknowledged', 'in_progress', 'completed');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'basic_member',
  cell_group TEXT,
  membership_number TEXT UNIQUE,
  date_joined DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  notification_token TEXT,
  preferred_bible_version bible_version DEFAULT 'NIV',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermon series
CREATE TABLE sermon_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermons
CREATE TABLE sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  scripture_reference TEXT,
  sermon_date DATE NOT NULL,
  preacher_id UUID REFERENCES profiles(id),
  series_id UUID REFERENCES sermon_series(id),
  type sermon_type NOT NULL DEFAULT 'audio',
  media_url TEXT,
  media_duration INTEGER,
  thumbnail_url TEXT,
  pdf_url TEXT,
  cloudinary_public_id TEXT,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayers
CREATE TABLE prayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category prayer_category NOT NULL,
  liturgical_season TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayer requests
CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Notices
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Giving records
CREATE TABLE giving_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES profiles(id),
  amount_kes DECIMAL(12, 2) NOT NULL,
  category giving_category NOT NULL,
  description TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  mpesa_transaction_id UUID,
  receipt_number TEXT UNIQUE,
  giving_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- M-Pesa transactions
CREATE TABLE mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  giving_record_id UUID REFERENCES giving_records(id),
  phone_number TEXT NOT NULL,
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

-- Community posts
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  group_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pastoral care requests
CREATE TABLE pastoral_care_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
