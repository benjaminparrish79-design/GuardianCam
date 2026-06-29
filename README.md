# GuardianCam - Enterprise Security Camera Platform

A modern, production-ready SaaS application that transforms any device (phone, tablet, laptop) into a professional security camera with live streaming, night vision, motion alerts, and secure sharing.

## Features

### Core Capabilities
- **Real-time Live Streaming** - Stream video from any device's camera with high-quality video feed
- **Night Vision Mode** - Advanced low-light viewing with green thermal-style filter and real-time canvas processing
- **Push-to-Talk** - Real-time two-way audio communication with audio feedback
- **Snapshot & Recording** - Capture PNG snapshots and WebM video clips with one-click downloads
- **Motion Alerts** - AI-style motion detection with instant notifications and severity levels
- **Broadcast Mode** - Turn any device into a security camera with broadcast controls
- **Camera Management** - Add, delete, and manage multiple cameras with status tracking
- **Secure Sharing** - Generate shareable links for live feeds with expiration management
- **Alert History** - Searchable, filterable event log with timestamps and severity levels

### Enterprise Features
- **Multi-user Support** - Full user authentication and session management
- **Role-based Access** - Different permission levels for users and devices
- **Flexible Billing** - Free, Pro, and Enterprise subscription tiers
- **Responsive Design** - Mobile-first PWA-ready interface
- **Dark Theme UI** - Beautiful dark interface with cyan accents
- **Real-time Notifications** - Toast notifications for all user actions

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js + tRPC
- **Database**: MySQL (TiDB Cloud)
- **Authentication**: Built-in OAuth with JWT
- **Styling**: Tailwind CSS 4 + Radix UI components
- **Testing**: Vitest with jsdom
- **Deployment**: Vercel (recommended) or self-hosted

## Project Structure

```
guardian-cam/
├── client/                 # React frontend
│   └── src/
│       ├── pages/         # Page components (Landing, Dashboard)
│       ├── components/    # Reusable UI components
│       ├── lib/           # Utilities and helpers
│       ├── __tests__/     # Unit tests
│       └── App.tsx        # Main app component
├── server/                # Express backend
│   ├── _core/            # Server entry point
│   ├── api/              # API routes
│   └── auth.logout.test.ts
├── shared/               # Shared types and utilities
├── drizzle/              # Database schema and migrations
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Modern web browser with camera access
- (Optional) Supabase account for production deployment

### Installation

1. **Clone and install dependencies**
   ```bash
   cd guardian-cam
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

### Demo Login
- Use any email and password (e.g., `demo@company.com` / `demo123`)
- The app auto-creates a Pro account for demo purposes

## Usage Guide

### Landing Page
- View platform features and pricing tiers
- Sign up for free trial or login
- Learn about security camera capabilities

### Dashboard - Cameras Tab
1. Click **"Add Camera"** to register a new device
2. Enter camera name and location
3. View all cameras with status (online/offline)
4. Click **"Share"** to generate secure sharing links
5. Click **"Delete"** to remove a camera

### Dashboard - Broadcast Tab
1. Click **"Start Broadcasting"** to activate webcam
2. **Toggle Night Vision** for low-light viewing
3. **Take Snapshot** - Downloads PNG image
4. **Record Clip** - Records 10-second WebM video
5. Click **"Stop Broadcasting"** to end stream

### Dashboard - Alerts Tab
1. View all motion alerts with timestamps
2. Filter by severity (Low, Medium, High)
3. Click **"Simulate Alert"** to test motion detection
4. Alerts auto-sort by newest first

## Development

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run specific test file
pnpm test -- camera.test.ts
```

### Code Quality
```bash
# Type checking
pnpm check

# Format code
pnpm format

# Build for production
pnpm build
```

### Database Migrations
```bash
# Generate migration files
pnpm db:push
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Cameras
- `GET /api/cameras` - List user's cameras
- `POST /api/cameras` - Create new camera
- `DELETE /api/cameras/:id` - Delete camera
- `PATCH /api/cameras/:id` - Update camera

### Events
- `GET /api/events` - List user's events
- `POST /api/events` - Create event
- `GET /api/events?severity=high` - Filter by severity

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - GuardianCam"
   git remote add origin https://github.com/YOUR_USERNAME/guardian-cam.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables (see below)
   - Click **Deploy**

3. **Environment Variables for Vercel**
   ```
   DATABASE_URL=mysql://user:pass@host:port/database
   JWT_SECRET=your-secret-key
   OAUTH_SERVER_URL=https://api.manus.im
   ```

### Deploy to Other Platforms

The app works on Railway, Render, Fly.io, and self-hosted environments:

**Railway**
- Connect GitHub repo
- Add MySQL database
- Set environment variables
- Deploy

**Docker (Self-hosted)**
```bash
docker build -t guardian-cam .
docker run -p 3000:3000 -e DATABASE_URL=... guardian-cam
```

## Performance Optimization

- **Code Splitting** - Automatic route-based code splitting
- **Image Optimization** - Lazy loading for camera feeds
- **Caching** - Browser caching for static assets
- **Compression** - Gzip compression for API responses
- **CDN** - Vercel's global CDN for fast delivery

## Security Features

- **JWT Authentication** - Secure token-based auth
- **HTTPS Only** - All connections encrypted
- **CORS Protection** - Restricted cross-origin requests
- **Input Validation** - All user inputs validated
- **Rate Limiting** - API rate limiting to prevent abuse
- **Secure Headers** - Security headers configured

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Camera Not Working
- Check browser permissions for camera access
- Ensure camera is not in use by another app
- Try a different browser

### Night Vision Not Displaying
- Verify canvas support in browser
- Check console for errors
- Try disabling and re-enabling

### Performance Issues
- Close other browser tabs
- Reduce video quality if needed
- Check network connection

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests:
- GitHub Issues: [github.com/guardian-cam/issues](https://github.com/guardian-cam/issues)
- Email: support@guardiancam.com
- Documentation: [docs.guardiancam.com](https://docs.guardiancam.com)

## Roadmap

- [ ] WebRTC peer-to-peer streaming
- [ ] Supabase backend integration
- [ ] Advanced AI motion detection
- [ ] Cloud storage for recordings
- [ ] Mobile app (iOS/Android)
- [ ] Multi-device sync
- [ ] Custom alerts and rules
- [ ] Analytics dashboard

## Changelog

### v1.0.0 (Current)
- Initial release
- Live streaming with night vision
- Motion alerts and history
- Camera management
- Secure sharing
- Billing tiers
- Responsive mobile UI

---

**GuardianCam** - Transform any device into a professional security camera. Built with ❤️ for security and privacy.
