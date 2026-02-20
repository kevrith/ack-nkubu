# Sacrament Requests System

## Overview
Complete system for managing baptism, wedding, and funeral requests with document uploads, clergy workflow, and calendar integration.

## Features Implemented

### 1. Database Schema (`016_sacrament_requests.sql`)
- **sacrament_requests** table with fields for all three sacrament types
- **sacrament_documents** table for file uploads
- **sacrament_request_activity** table for audit trail
- Row Level Security (RLS) policies for users and clergy
- Indexes for performance

### 2. User Features

#### Request Form (`/sacraments/new`)
- Type selection (Baptism, Wedding, Funeral)
- Dynamic form fields based on selected type
- Document upload via Cloudinary
- Additional notes field

#### My Requests (`/sacraments`)
- View all submitted requests
- Status tracking with color-coded badges
- Quick view of scheduled dates
- Empty state with call-to-action

### 3. Clergy Dashboard (`/clergy/sacraments`)
- View all requests with filtering by status
- Detailed request information
- Status management workflow:
  - Pending → Under Review → Approved → Scheduled → Completed
  - Reject option available
- Schedule requests with date/time and location
- Activity logging for all actions

### 4. Request Types

#### Baptism
- Candidate name and DOB
- Parent names
- Godparents
- Birth certificate upload

#### Wedding
- Groom and bride details
- DOBs for both parties
- Preferred date
- Venue preference
- ID/certificate uploads

#### Funeral
- Deceased name and dates
- Relationship to requester
- Preferred date
- Venue preference
- Death certificate upload

## Routes Added
- `/sacraments` - User's requests list
- `/sacraments/new` - Submit new request
- `/clergy/sacraments` - Clergy dashboard

## Database Migration
Run in Supabase SQL Editor:
```sql
-- File: supabase/migrations/016_sacrament_requests.sql
```

## Access Control
- **All Members**: Can submit and view their own requests
- **Clergy/Admin**: Can view all requests, update status, schedule services

## Status Workflow
1. **Pending** - Just submitted
2. **Under Review** - Clergy reviewing
3. **Approved** - Ready to schedule
4. **Scheduled** - Date/time/location set
5. **Completed** - Service performed
6. **Rejected** - Request denied (with notes)

## Document Types Supported
- Birth certificates
- Death certificates
- National IDs
- Marriage certificates
- Any PDF or image file

## Next Steps (Optional Enhancements)
1. Email notifications on status changes
2. SMS reminders for scheduled services
3. Calendar export (iCal format)
4. Automated follow-up after completion
5. Pre-marriage counseling scheduling
6. Baptism class enrollment
7. Certificate generation after completion

## Usage

### For Members:
1. Navigate to "Sacraments" in menu
2. Click "New Request"
3. Select type and fill form
4. Upload required documents
5. Submit and track status

### For Clergy:
1. Access clergy dashboard
2. Filter by status
3. Click request to view details
4. Update status as needed
5. Schedule when approved
6. Mark complete after service

## Integration Points
- **Cloudinary**: Document storage
- **Supabase**: Database and auth
- **Calendar**: Scheduled dates visible in events (future)
- **Notifications**: Activity updates (future)
