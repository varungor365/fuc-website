# FUC Profile & QR - Website Integration

A comprehensive website integration that combines Linktree-like profile pages, QR code generation, and T-shirt mockup builder functionality. Built with Next.js, TypeScript, and modern web technologies.

## Features

### 🔗 Linktree-like Profile Pages
- Create and manage personalized profile pages
- Add multiple social and web links
- Customizable themes and bio
- Clean, responsive design inspired by LittleLink

### 📱 QR Code Generation
- Generate unique QR codes for each profile
- Customizable QR code styling and sizes
- Download QR codes as PNG images
- Powered by the robust `node-qrcode` library

### 👕 T-Shirt Mockup Builder
- Create professional T-shirt mockups with your QR code
- Multiple template options (front/back, different styles)
- Automatic image composition using Sharp
- Perfect for merchandise and marketing

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React, TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3 (easily upgradeable to PostgreSQL)
- **Image Processing**: Sharp for high-performance image manipulation
- **QR Code Generation**: node-qrcode library
- **Authentication**: JWT with bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Change the `JWT_SECRET` to a strong, unique key in production!

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── profile/       # Profile management
│   │   ├── qr/            # QR code generation
│   │   └── mockup/        # T-shirt mockup creation
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── profile/           # Public profile pages
│   └── globals.css        # Global styles
└── lib/                   # Utility libraries
    ├── database.ts        # Database configuration
    ├── auth.ts            # Authentication utilities
    ├── qrcode.ts          # QR code generation
    └── mockup.ts          # Image mockup creation
```

## Usage Guide

### 1. User Registration
1. Visit `/auth/register`
2. Create an account with email and display name
3. A unique username will be automatically generated

### 2. Profile Setup
1. Access your dashboard at `/dashboard`
2. Edit your profile to add bio, links, and customization
3. Your profile will be available at `/profile/[username]`

### 3. QR Code Generation
1. From your dashboard, click "Generate QR Code"
2. Download the QR code image
3. Share the QR code to drive traffic to your profile

### 4. T-Shirt Mockup Creation
1. Navigate to the mockup builder
2. Select a template and position for your QR code
3. Generate and download professional mockup images

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Profile Management
- `GET /api/profile/[username]` - Get public profile
- `PUT /api/profile/[username]` - Update profile (authenticated)

### QR Code Generation
- `POST /api/qr/generate` - Generate QR code for profile
- `GET /api/qr/generate` - Get existing QR code

### Mockup Creation
- `POST /api/mockup/generate` - Create T-shirt mockup
- `GET /api/mockup/generate` - Get user's mockups

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Make sure to set these environment variables:
- `NEXT_PUBLIC_BASE_URL` - Your production domain
- `JWT_SECRET` - A strong, unique secret key

**Built with ❤️ using the best open-source tools for profile management, QR generation, and image manipulation.**
