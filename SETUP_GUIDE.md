# MedHelp Insurance Platform - Complete Setup Guide

## 🚀 Quick Start (Localhost)

```bash
npm install
npm run dev
```

Visit: **http://localhost:3001** (or http://localhost:3000 if port 3000 is free)

---

## 📋 Features Implemented

### ✅ 1. APPOINTMENT BOOKING SYSTEM
- **Unified booking** for clients and agent meetings
- Time zone support (auto-detect + manual selection)
- Real-time availability checking
- Automatic conflict prevention
- UTC normalization for database storage
- Responsive calendar UI

**Access:** Home page → Scroll to "Book Appointment" or click "Book an Appointment" button

---

### ✅ 2. BECOME AN AGENT SYSTEM

**Page:** http://localhost:3001/agents (or #team on home page)

**Form Fields:**
- Full Name *
- Phone Number *
- Email Address *
- City / Location *
- Experience Level (Dropdown): Beginner / Intermediate / Experienced *
- License Status: Yes / No *
- Why do you want to join? (Textarea)
- Upload Resume (PDF, optional)

**Workflow:**
1. User fills out application form
2. Submit → Saves to database + sends admin notification
3. Automatically redirects to scheduler
4. User selects meeting date/time
5. Meeting booked as "Agent Meeting" service type
6. Confirmation email sent

---

### ✅ 3. FIND ME ON THE FIELD

**Page:** http://localhost:3001/find-me

**Features:**
- Real-time location display
- "Available" / "Not Available" status
- Get Directions button (opens Google Maps)
- Book Appointment button (redirects to booking)
- All upcoming locations list
- Auto-refresh every minute

**Data Source:** Location events from database

---

### ✅ 4. MONTHLY LOCATION CALENDAR

**Page:** http://localhost:3001/admin/locations

**Features:**
- View all location events for the month
- Add new location events
- Set date, time, status
- Full CRUD operations
- Real-time updates

---

### ✅ 5. ADMIN DASHBOARD

**Access:** http://localhost:3001/admin

**Admin Sections:**
1. **Dashboard Overview** - Stats and quick actions
2. **Manage Locations** - Add/edit/delete location events
3. **Agent Applications** - Review and approve/reject applications
4. **Appointments** - View all booked appointments

---

## 🗄️ DATABASE STRUCTURE

Required Supabase tables:

```sql
-- Appointments
CREATE TABLE appointments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  timezone TEXT,
  appointment_utc TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broker Applications
CREATE TABLE broker_applications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  license_status TEXT,
  message TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location Events
CREATE TABLE location_events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'Available',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location (for today's location display)
CREATE TABLE location (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚙️ Environment Configuration

Create `.env.local` file in project root:

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM_EMAIL=noreply@medhelp.com
SMTP_SECURE=false

# Twilio SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=your-token-here
TWILIO_PHONE_NUMBER=+1234567890

# Admin Notifications
ADMIN_EMAIL=admin@medhelp.com
ADMIN_SMS_NUMBER=+1234567890

# Google Calendar (Optional - for future integration)
GOOGLE_CALENDAR_API_KEY=your-key
GOOGLE_CALENDAR_ID=your-calendar-id@google.com
```

---

## 🔗 API Endpoints

### Appointments
- `GET /api/appointments/availability` - Get booked slots
- `POST /api/appointments/book` - Book appointment

### Broker Applications
- `GET /api/broker-applications` - List all applications
- `POST /api/broker-applications` - Submit application (FormData)
- `PATCH /api/broker-applications/[id]` - Approve/reject application

### Location Events
- `GET /api/location-events` - List all location events
- `POST /api/location-events` - Create new event

### Location
- `GET /api/location` - Get today's location

### Contact
- `POST /api/contact` - Submit contact form

### Notifications
- `POST /api/notifications/admin` - Send admin notification

---

## 📱 URL Map

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page, booking, join team |
| Scheduler | `/scheduler` | Auto-redirect after agent application |
| Find Me on the Field | `/find-me` | Location tracking |
| Admin Dashboard | `/admin` | Dashboard overview |
| Manage Locations | `/admin/locations` | Location event management |
| Agent Applications | `/admin/agents` | Review applications |
| View Appointments | `/admin/appointments` | See all bookings |

---

## 🎯 Core Workflows

### Workflow 1: Client Books Appointment
1. Visit home page
2. Scroll to "Book Appointment" 
3. Select timezone
4. Choose date from 7-day calendar
5. Select available time slot
6. Fill in name, email, phone
7. Submit
8. Confirmation sent to email + SMS

### Workflow 2: Agent Application → Meeting
1. Visit home page
2. Scroll to "Become an Agent"
3. Fill application form
4. Upload resume (optional)
5. Submit
6. **Auto-redirect to scheduler**
7. Select meeting date/time
8. Confirm meeting
9. Meeting saved as "Agent Meeting"

### Workflow 3: Admin Manages Locations
1. Visit `/admin/locations`
2. Click "Add Event"
3. Fill: title, location, date, time, status
4. Save
5. Event appears on `/find-me` page in real-time

### Workflow 4: Admin Reviews Agent Applications
1. Visit `/admin/agents`
2. View pending applications
3. Click "Approve" or "Reject"
4. Status updates in database

---

## 🔐 Features

✅ **Fully Functional**
- All forms save to database
- Real-time availability checking
- Timezone-aware scheduling
- Auto-notifications (when env vars set)

✅ **Security**
- Server-side validation
- FormData handling for file uploads
- Environment variable protection

✅ **Performance**
- Static prerendering (next build)
- Lazy loading for components
- Optimized images
- Responsive design (mobile-first)

✅ **User Experience**
- Glassmorphism design
- Dark professional theme
- Smooth animations
- One-click navigation

---

## 🛠️ Development

### Run Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Lint Code
```bash
npm run lint
```

### Install Dependencies
```bash
npm install
```

---

## 📦 Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Supabase (PostgreSQL)
- **Styling:** Glassmorphism, dark theme
- **Calendar:** react-calendar (optional)
- **Notifications:** Twilio (SMS), Nodemailer (Email)
- **Timezone:** date-fns-tz

---

## 🚨 Troubleshooting

### Port Already in Use
The app will automatically try port 3001, 3002, etc.

### Database Connection Issues
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase table schemas match the SQL above
- Tables default to empty (no errors)

### Forms Not Saving
- Ensure Supabase env vars are set
- Check browser console for API errors
- Verify table names match configuration

### Notifications Not Sending
- Email: Set SMTP_* vars (optional)
- SMS: Set TWILIO_* vars (optional)
- System works without them (best-effort)

---

## ✨ Next Features (Optional)

- [ ] Google Calendar integration
- [ ] SMS reminders before appointments
- [ ] Email digest for admin
- [ ] reCAPTCHA on forms
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Custom admin branding
- [ ] Zoom meeting integration

---

## 📞 Support

For issues, check:
1. `.env.local` configuration
2. Supabase database tables
3. Browser console errors
4. Server logs in terminal

---

**Status:** ✅ Production-ready for localhost
**Last Updated:** April 2, 2026
