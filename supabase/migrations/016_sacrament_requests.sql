-- Sacrament Requests System
-- =====================================================================

-- Sacrament request types enum
CREATE TYPE sacrament_type AS ENUM ('baptism', 'wedding', 'funeral');

-- Request status enum
CREATE TYPE sacrament_request_status AS ENUM ('pending', 'under_review', 'approved', 'scheduled', 'completed', 'rejected');

-- Sacrament requests table
CREATE TABLE sacrament_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sacrament_type sacrament_type NOT NULL,
  status sacrament_request_status DEFAULT 'pending',
  
  -- Common fields
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  
  -- Baptism specific
  baptism_candidate_name TEXT,
  baptism_candidate_dob DATE,
  baptism_parent_names TEXT,
  baptism_godparents TEXT,
  
  -- Wedding specific
  wedding_groom_name TEXT,
  wedding_groom_dob DATE,
  wedding_bride_name TEXT,
  wedding_bride_dob DATE,
  wedding_preferred_date DATE,
  wedding_venue_preference TEXT,
  
  -- Funeral specific
  funeral_deceased_name TEXT,
  funeral_deceased_dob DATE,
  funeral_deceased_dod DATE,
  funeral_relationship TEXT,
  funeral_preferred_date DATE,
  funeral_venue_preference TEXT,
  
  -- Additional info
  additional_notes TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  
  -- Clergy processing
  assigned_clergy_id UUID REFERENCES auth.users(id),
  clergy_notes TEXT,
  scheduled_date TIMESTAMPTZ,
  scheduled_location TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Request documents table
CREATE TABLE sacrament_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES sacrament_requests(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Request activity log
CREATE TABLE sacrament_request_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES sacrament_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sacrament_requests_user ON sacrament_requests(user_id);
CREATE INDEX idx_sacrament_requests_type ON sacrament_requests(sacrament_type);
CREATE INDEX idx_sacrament_requests_status ON sacrament_requests(status);
CREATE INDEX idx_sacrament_requests_clergy ON sacrament_requests(assigned_clergy_id);
CREATE INDEX idx_sacrament_documents_request ON sacrament_documents(request_id);

-- RLS Policies
ALTER TABLE sacrament_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sacrament_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sacrament_request_activity ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own requests"
  ON sacrament_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create requests
CREATE POLICY "Users can create requests"
  ON sacrament_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their pending requests
CREATE POLICY "Users can update own pending requests"
  ON sacrament_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Clergy can view all requests
CREATE POLICY "Clergy can view all requests"
  ON sacrament_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );

-- Clergy can update requests
CREATE POLICY "Clergy can update requests"
  ON sacrament_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );

-- Document policies
CREATE POLICY "Users can view own documents"
  ON sacrament_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sacrament_requests
      WHERE sacrament_requests.id = request_id
      AND sacrament_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Clergy can view all documents"
  ON sacrament_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );

CREATE POLICY "Users can upload documents"
  ON sacrament_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sacrament_requests
      WHERE sacrament_requests.id = request_id
      AND sacrament_requests.user_id = auth.uid()
    )
  );

-- Activity log policies
CREATE POLICY "Users can view activity for own requests"
  ON sacrament_request_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sacrament_requests
      WHERE sacrament_requests.id = request_id
      AND sacrament_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Clergy can view all activity"
  ON sacrament_request_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('clergy', 'admin')
    )
  );

CREATE POLICY "Anyone can create activity"
  ON sacrament_request_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);
