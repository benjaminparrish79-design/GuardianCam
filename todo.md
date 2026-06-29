# GuardianCam - Project TODO

## Phase 1: Core Setup & Authentication
- [x] Set up Supabase integration with environment variables
- [ ] Implement Supabase Auth (signup/login/logout)
- [x] Create user session management with useAuth hook
- [ ] Set up database schema (cameras, events tables with RLS)
- [x] Implement protected routes and auth guards

## Phase 2: Landing Page & Hero
- [x] Create landing page with hero section
- [x] Add feature pills matching AlfredCamera design ("Reuse old phones", "Easy Setup", "See in the Dark", "Talk and View", "Share Live Feeds")
- [x] Implement CTA buttons (Get Started, Learn More)
- [x] Add responsive navigation header
- [x] Style with dark theme matching Figma mockups

## Phase 3: Live View & Camera Features
- [x] Implement real webcam live streaming with getUserMedia
- [x] Create video canvas for live view display
- [x] Implement Night Vision toggle with green thermal-style filter
- [x] Add real-time canvas processing for night vision effect
- [x] Create snapshot functionality (PNG download)
- [x] Implement record clip functionality (WebM video download)
- [x] Add video controls (play, pause, fullscreen)

## Phase 4: Push-to-Talk & Audio
- [x] Implement push-to-talk button (hold to record)
- [x] Add audio recording with Web Audio API
- [x] Implement audio playback for recorded messages
- [x] Add audio feedback (beep on start/stop)
- [x] Create audio visualization during recording

## Phase 5: Motion Alerts & History
- [x] Create motion alert simulation from live view
- [x] Implement alerts history log with timestamps
- [x] Add searchable/filterable event log
- [x] Implement severity levels (low, medium, high)
- [x] Create alert notifications UI
- [ ] Add event details modal/drawer

## Phase 6: Camera Management
- [x] Create camera list/grid view
- [x] Implement add camera functionality
- [x] Implement delete camera functionality
- [x] Show camera status (online/offline)
- [x] Display last seen timestamp
- [ ] Add camera details/settings view

## Phase 7: Broadcast Mode
- [x] Create "Turn this device into a camera" mode
- [x] Implement broadcast status indicator
- [x] Add broadcast controls (start/stop)
- [ ] Store broadcast state in Supabase
- [ ] Create broadcast settings (name, location, type)

## Phase 8: Share Live Feeds
- [ ] Implement secure shareable links generation
- [ ] Create share modal with link copy
- [ ] Add QR code generation for sharing
- [ ] Implement share link expiration/management
- [ ] Create shared view for public access

## Phase 9: Billing & Plans
- [x] Create billing page with Free/Pro/Enterprise plans
- [x] Implement plan comparison table
- [x] Add upgrade functionality (demo mode)
- [ ] Display current plan status
- [ ] Add plan features list
- [ ] Implement subscription management UI

## Phase 10: UI/UX Polish
- [x] Implement dark theme throughout app
- [x] Add smooth animations and transitions
- [x] Create toast notifications for actions
- [ ] Implement loading states and skeletons
- [x] Add error handling and user feedback
- [x] Ensure fully responsive design (mobile-first)
- [ ] Test PWA capabilities

## Phase 11: Database & Supabase Integration
- [ ] Create Supabase project and tables
- [ ] Implement Row Level Security (RLS) policies
- [ ] Create server-side API routes with @supabase/server
- [ ] Implement data persistence for cameras/events
- [ ] Add real-time subscriptions (optional)
- [ ] Set up Supabase Storage for snapshots/clips (optional)

## Phase 12: Testing & Deployment
- [x] Write vitest unit tests for core functions
- [x] Test authentication flows
- [x] Test camera operations (add/delete/broadcast)
- [x] Test motion alerts and history
- [x] Test responsive design on mobile devices
- [x] Create vercel.json configuration
- [x] Prepare for Vercel deployment
- [x] Document deployment instructions

## Phase 13: Final Polish & Delivery
- [ ] Review and refine all UI components
- [ ] Optimize performance and bundle size
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Create comprehensive README
- [ ] Add deployment guide
- [ ] Create checkpoint for delivery
- [ ] Prepare for GitHub push and Vercel deployment
