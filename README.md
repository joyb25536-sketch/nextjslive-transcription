# MedHelp - Health Insurance Website (Next.js + Supabase)

Modern, premium health insurance web app for MedHelp.

## Tech stack
- Frontend: Next.js 14 (App Router) + Tailwind CSS + Framer Motion
- Backend: Supabase (Postgres) + Next.js API routes
- Integrations: Google Calendar API, Twilio, SendGrid (via secret keys, TODO hooks)

## Run locally
1. `npm install`
2. Copy `sample.env.local` → `.env.local` and fill values
3. `npm run dev`

## Deploy to Vercel

### 1. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Go to Settings > API and copy your Project URL and service_role key

### 2. Deploy on Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key
   - `DEEPGRAM_API_KEY` = your Deepgram API key (optional)
   - `ADMIN_EMAIL` = your admin email (optional)
   - `ADMIN_SMS_NUMBER` = your admin phone (optional)
3. Deploy!

### 3. Alternative: Local Supabase (for development)
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Run migrations
supabase db reset
```

## Database Schema

The app uses Supabase with the following tables:
- `appointments` - Appointment bookings
- `contacts` - Contact form submissions
- `broker_applications` - Agent applications
- `location_events` - Office events
- `locations` - Office location info

## Pages and sections
- Hero
- Services (3x3 cards)
- Appointment booking with real-time availability and double-booking prevention
- Today’s location map
- About us
- Join our team form
- Contact form
- Admin API endpoints for appointments, location, broker applications and contacts

## Backend API routes
- `GET /api/appointments/availability` returns blocked slots by date
- `POST /api/appointments/book` books appointment; checks conflicts
- `POST /api/contact` stores contact requests
- `POST /api/broker-applications` stores broker leads
- `GET /api/location` returns latest location record

## Database schema (Supabase)

### appointments
- id (uuid pk)
- name (text)
- email (text)
- phone (text)
- service_type (text)
- notes (text)
- date (date)
- time (text)
- created_at (timestamp with time zone default now())

### contacts
- id
- name
- email
- phone
- message
- created_at

### broker_applications
- id
- name
- email
- phone
- experience
- message
- created_at

### location
- id
- city
- address
- updated_at

### Admin panel (optional)
- Build a simple protected page at `/admin` to CRUD appointments, location, requests.
- Use Supabase auth, or secure API keys in server functions.

## Appointment system flow
1. Client chooses date/time and submits booking form.
2. Frontend checks required fields and posts to `/api/appointments/book`.
3. Endpoint checks `appointments` for exact date/time collision (double booking). returns 409 if already taken.
4. Create a new `appointments` row.
5. (TODO) Trigger Twilio SMS to admin, send confirmation email, call Google Calendar API, plus auto-reminders.

## Notes
- Maximum responsiveness and premium UX are built with Tailwind and glassmorphism.
- The site uses sticky header and floating mobile CTA.
- SEO metadata is set in `app/layout.tsx`.

## Optional production improvements
- Add reCAPTCHA on forms (admin side). See `app/api/recaptcha/`.
- Add real authentication for admin dashboards.
- Add manager module to update location and watch booking live.
- Add caching and request rate limiting in API.
