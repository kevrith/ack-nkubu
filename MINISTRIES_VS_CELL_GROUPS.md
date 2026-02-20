# Ministries vs Cell Groups - Complete Guide

## 🎯 Understanding the Two Systems

### **Ministries/Departments** 
Church-wide service and fellowship groups based on function/interest

**Examples:**
- KAMA (Kenya Anglican Men Association)
- Youth Fellowship
- Sunday School
- Choir
- Mother's Union
- Ushers & Hospitality
- Women's Guild
- Altar Guild
- Evangelism Team
- Prayer Ministry

**Characteristics:**
- Church-wide (not geographic)
- Based on age, gender, or service area
- Can have many members (30-50+)
- Meet for specific purposes
- Members can join multiple ministries

---

### **Cell Groups**
Geographic/neighborhood small groups for fellowship and discipleship

**Examples:**
- Nkubu East Cell
- Nkubu West Cell
- Nkubu Central Cell
- Karingani Cell
- Mitunguu Cell

**Characteristics:**
- Geographic/location-based
- Small groups (10-15 members max)
- Meet in homes or local venues
- Focus on fellowship, prayer, Bible study
- Members typically join ONE cell group

---

## 📊 Comparison Table

| Feature | Ministries | Cell Groups |
|---------|-----------|-------------|
| **Purpose** | Service & ministry | Fellowship & discipleship |
| **Basis** | Function/interest | Geography/neighborhood |
| **Size** | Large (30-50+) | Small (10-15) |
| **Membership** | Multiple allowed | One per person |
| **Meeting Focus** | Ministry activities | Prayer, Bible study, fellowship |
| **Examples** | KAMA, Choir, Youth | Nkubu East, Karingani Cell |

---

## 🗄️ Database Structure

### Ministries Tables
```sql
ministries
- id, name, description, category
- leader_id, assistant_leader_id
- meeting_day, meeting_time, location
- is_active

ministry_members
- ministry_id, member_id, role
- joined_at, is_active

ministry_events
- ministry_id, title, event_date
- description, location

ministry_announcements
- ministry_id, title, content
```

### Cell Groups Tables
```sql
cell_groups
- id, name, description
- leader_id, assistant_leader_id
- meeting_day, meeting_time, location, address
- max_members, is_active

cell_group_members
- cell_group_id, member_id
- joined_at, is_active

cell_group_meetings
- cell_group_id, meeting_date
- topic, notes, attendance_count

cell_group_attendance
- meeting_id, member_id, was_present

cell_group_announcements
- cell_group_id, title, content
```

---

## 🚀 User Flows

### Joining a Ministry
```
Member → /ministries → Browse by category
    ↓
Select "KAMA" → Click "Join Ministry"
    ↓
Added to ministry_members
    ↓
Can view ministry page, events, announcements
```

### Joining a Cell Group
```
Member → /cell-groups → Browse by location
    ↓
Select "Nkubu East Cell" → Click "Join Group"
    ↓
Added to cell_group_members
    ↓
Profile updated with cell_group name
    ↓
Can view meetings, attendance, announcements
```

---

## 🎨 Pages & Routes

### Member Pages
- `/ministries` - Browse and join ministries
- `/ministries/:id` - Ministry detail (coming soon)
- `/cell-groups` - Browse and join cell groups
- `/cell-groups/:id` - Cell group detail with tabs

### Admin Pages
- `/admin/ministries` - Manage ministries (Leaders+)
- `/admin/cell-groups` - Manage cell groups (Leaders+)

---

## 📱 Pre-seeded Data

### Ministries (12 total)
1. KAMA (Kenya Anglican Men Association)
2. Youth Fellowship
3. Sunday School
4. Choir
5. Mother's Union
6. Ushers & Hospitality
7. Women's Guild
8. Altar Guild
9. Evangelism Team
10. Prayer Ministry
11. Bible Study Group
12. Confirmation Class

### Cell Groups (5 examples)
1. Nkubu East Cell
2. Nkubu West Cell
3. Nkubu Central Cell
4. Karingani Cell
5. Mitunguu Cell

---

## 🔐 Permissions

### Ministries
- **View**: All members
- **Join**: All members
- **Manage**: Leaders, Clergy, Admin

### Cell Groups
- **View**: All members
- **Join**: All members (if not full)
- **Manage**: Leaders, Clergy, Admin
- **Record Attendance**: Cell group leaders

---

## 🚀 Deployment

### Run Migrations
```sql
-- 1. Run existing migrations first (001-017)
-- 2. Run new migration:
supabase/migrations/018_ministries_departments.sql
```

### What Migration 018 Does
1. Creates ministries tables
2. Seeds 12 common ministries
3. Removes ministry-like entries from cell_groups
4. Adds 5 example geographic cell groups
5. Sets up RLS policies

---

## ✅ Complete Feature List

### Ministries System
- ✅ Browse ministries by category
- ✅ Join/leave ministries
- ✅ View member count
- ✅ See ministry leaders
- ✅ Admin CRUD interface
- ✅ Category filtering (Fellowship, Service, Worship, Education, Outreach)
- ⏳ Ministry detail page (coming soon)
- ⏳ Ministry events calendar (coming soon)

### Cell Groups System
- ✅ Browse cell groups
- ✅ Join/leave cell groups
- ✅ View group details
- ✅ Announcements tab
- ✅ Members tab
- ✅ Meetings tab
- ✅ Attendance tracking
- ✅ Admin CRUD interface
- ✅ Sync with profiles.cell_group

---

## 💡 Real-World Example

**John Kamau** is a member of ACK St Francis Nkubu:

**His Ministries** (can join multiple):
- KAMA (meets Saturdays 3pm)
- Ushers & Hospitality (serves on rotation)
- Evangelism Team (monthly outreach)

**His Cell Group** (joins one):
- Nkubu East Cell (meets Wednesdays 6pm at Leader's home)

**In the App:**
- Goes to `/ministries` → Joins KAMA, Ushers, Evangelism
- Goes to `/cell-groups` → Joins Nkubu East Cell
- Profile shows: `cell_group: "Nkubu East Cell"`
- Can view all ministry announcements
- Can view cell group meetings and attendance

---

## 🎯 Key Differences Summary

**Use MINISTRIES for:**
- Church-wide service groups
- Age/gender-based fellowships
- Worship teams (choir, altar guild)
- Ministry departments (evangelism, prayer)

**Use CELL GROUPS for:**
- Neighborhood fellowship
- Small group discipleship
- Geographic communities
- Home-based meetings

---

**Status**: ✅ Both systems fully implemented and ready for production
